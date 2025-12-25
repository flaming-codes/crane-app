import { type ActionFunctionArgs } from "react-router";
import { gunzipSync, inflateSync } from "node:zlib";
import { db } from "../db/client.server";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    const contentEncoding = request.headers.get("content-encoding") || "";

    const bodyBytes = new Uint8Array(await request.arrayBuffer());
    let decodedBytes: Uint8Array | Buffer = bodyBytes;

    try {
      if (contentEncoding.includes("gzip")) {
        decodedBytes = gunzipSync(Buffer.from(bodyBytes));
      } else if (contentEncoding.includes("deflate")) {
        decodedBytes = inflateSync(Buffer.from(bodyBytes));
      }
    } catch (decompressError) {
      console.error("Log payload decompress failed", {
        contentType,
        contentEncoding,
        error: decompressError,
        preview: Buffer.from(bodyBytes).subarray(0, 256).toString("hex"),
      });

      return new Response(
        JSON.stringify({
          status: "error",
          message: "invalid compressed log payload",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let data: any;
    try {
      const bodyText = new TextDecoder().decode(decodedBytes);
      data = JSON.parse(bodyText);
    } catch (parseError) {
      console.error("Log payload parse failed", {
        contentType,
        contentEncoding,
        preview: new TextDecoder().decode(decodedBytes.slice(0, 256)),
        error: parseError,
      });

      return new Response(
        JSON.stringify({
          status: "error",
          message: "invalid JSON log payload",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const insertLog = db.prepare(`
      INSERT INTO logs (
        timestamp_ns, severity_number, severity_text, body,
        trace_id, span_id, service_name, attributes_json, resource_json
      ) VALUES (
        @timestamp_ns, @severity_number, @severity_text, @body,
        @trace_id, @span_id, @service_name, @attributes_json, @resource_json
      )
    `);

    const transaction = db.transaction((resourceLogs: any[]) => {
      for (const rl of resourceLogs) {
        const resource = rl.resource || {};
        const serviceNameAttr = resource.attributes?.find(
          (a: any) => a.key === "service.name"
        );
        const serviceName =
          serviceNameAttr?.value?.stringValue || "unknown_service";
        const resourceJson = JSON.stringify(resource);

        for (const sl of rl.scopeLogs || []) {
          for (const log of sl.logRecords || []) {
            let body = "";
            if (log.body?.stringValue) {
              body = log.body.stringValue;
            } else if (log.body) {
              body = JSON.stringify(log.body);
            }

            insertLog.run({
              timestamp_ns: BigInt(log.timeUnixNano),
              severity_number: log.severityNumber,
              severity_text: log.severityText,
              body: body,
              trace_id: log.traceId || null,
              span_id: log.spanId || null,
              service_name: serviceName,
              attributes_json: JSON.stringify(log.attributes || []),
              resource_json: resourceJson,
            });
          }
        }
      }
    });

    if (data.resourceLogs) {
      transaction(data.resourceLogs);
    }

    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Log ingestion error:", error);
    return new Response(
      JSON.stringify({ status: "error", message: String(error) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
