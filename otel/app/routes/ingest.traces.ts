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

    // Read raw body so we can inspect/debug malformed payloads
    const bodyBytes = new Uint8Array(await request.arrayBuffer());
    let decodedBytes: Uint8Array | Buffer = bodyBytes;
    let data: any;

    // Handle gzip/deflate payloads
    try {
      if (contentEncoding.includes("gzip")) {
        decodedBytes = gunzipSync(Buffer.from(bodyBytes));
      } else if (contentEncoding.includes("deflate")) {
        decodedBytes = inflateSync(Buffer.from(bodyBytes));
      }
    } catch (decompressError) {
      console.error("Trace payload decompress failed", {
        contentType,
        contentEncoding,
        error: decompressError,
        preview: Buffer.from(bodyBytes).subarray(0, 256).toString("hex"),
      });

      return new Response(
        JSON.stringify({
          status: "error",
          message: "invalid compressed trace payload",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    try {
      const bodyText = new TextDecoder().decode(decodedBytes);
      data = JSON.parse(bodyText);
    } catch (parseError) {
      console.error("Trace payload parse failed", {
        contentType,
        contentEncoding,
        preview: new TextDecoder().decode(decodedBytes.slice(0, 256)),
        error: parseError,
      });

      return new Response(
        JSON.stringify({
          status: "error",
          message: "invalid JSON trace payload",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Prepare statements
    const insertSpan = db.prepare(`
      INSERT OR REPLACE INTO spans (
        trace_id, span_id, parent_span_id, service_name, span_name, span_kind,
        start_time_ns, end_time_ns, duration_ns, status_code, status_message,
        attributes_json, events_json, links_json, resource_json
      ) VALUES (
        @trace_id, @span_id, @parent_span_id, @service_name, @span_name, @span_kind,
        @start_time_ns, @end_time_ns, @duration_ns, @status_code, @status_message,
        @attributes_json, @events_json, @links_json, @resource_json
      )
    `);

    const upsertTrace = db.prepare(`
      INSERT INTO traces (
        trace_id, start_time_ns, end_time_ns, duration_ns, root_span_name, service_name, span_count, error_count, has_error
      ) VALUES (
        @trace_id, @start_time_ns, @end_time_ns, @duration_ns, @root_span_name, @service_name, 1, @error_count, @has_error
      )
      ON CONFLICT(trace_id) DO UPDATE SET
        start_time_ns = MIN(start_time_ns, excluded.start_time_ns),
        end_time_ns = MAX(end_time_ns, excluded.end_time_ns),
        duration_ns = MAX(end_time_ns, excluded.end_time_ns) - MIN(start_time_ns, excluded.start_time_ns),
        span_count = span_count + 1,
        error_count = error_count + excluded.error_count,
        has_error = MAX(has_error, excluded.has_error),
        service_name = COALESCE(traces.service_name, excluded.service_name),
        root_span_name = COALESCE(traces.root_span_name, excluded.root_span_name)
    `);

    const transaction = db.transaction((resourceSpans: any[]) => {
      for (const rs of resourceSpans) {
        const resource = rs.resource || {};
        const serviceNameAttr = resource.attributes?.find(
          (a: any) => a.key === "service.name"
        );
        const serviceName =
          serviceNameAttr?.value?.stringValue || "unknown_service";
        const resourceJson = JSON.stringify(resource);

        for (const ss of rs.scopeSpans || []) {
          for (const span of ss.spans || []) {
            // Guard against missing/invalid times to prevent ingestion failures
            if (!span.traceId || !span.spanId) continue;

            const startTimeRaw = span.startTimeUnixNano;
            const endTimeRaw = span.endTimeUnixNano ?? startTimeRaw;

            let startTime = 0n;
            let endTime = 0n;

            try {
              startTime = startTimeRaw != null ? BigInt(startTimeRaw) : 0n;
              endTime = endTimeRaw != null ? BigInt(endTimeRaw) : startTime;
            } catch (e) {
              // Skip spans with bad timestamps
              console.error("Invalid span timestamps", {
                spanId: span.spanId,
                traceId: span.traceId,
                startTimeRaw,
                endTimeRaw,
                error: e,
              });
              continue;
            }

            const duration = endTime > startTime ? endTime - startTime : 0n;

            // OTLP JSON status code: 0=Unset, 1=Ok, 2=Error
            // Sometimes it comes as "STATUS_CODE_ERROR" string
            let hasError = 0;
            if (
              span.status?.code === 2 ||
              span.status?.code === "STATUS_CODE_ERROR"
            ) {
              hasError = 1;
            }

            try {
              insertSpan.run({
                trace_id: span.traceId,
                span_id: span.spanId,
                parent_span_id: span.parentSpanId || null,
                service_name: serviceName,
                span_name: span.name,
                span_kind: span.kind,
                start_time_ns: startTime,
                end_time_ns: endTime,
                duration_ns: duration,
                status_code: span.status?.code,
                status_message: span.status?.message,
                attributes_json: JSON.stringify(span.attributes || []),
                events_json: JSON.stringify(span.events || []),
                links_json: JSON.stringify(span.links || []),
                resource_json: resourceJson,
              });

              upsertTrace.run({
                trace_id: span.traceId,
                start_time_ns: startTime,
                end_time_ns: endTime,
                duration_ns: duration,
                root_span_name: !span.parentSpanId ? span.name : null,
                service_name: !span.parentSpanId ? serviceName : null,
                error_count: hasError,
                has_error: hasError,
              });
            } catch (e) {
              console.error("Span ingest failed", {
                error: e,
                traceId: span.traceId,
                spanId: span.spanId,
                serviceName,
                spanName: span.name,
              });
              continue;
            }
          }
        }
      }
    });

    if (data.resourceSpans) {
      transaction(data.resourceSpans);
    }

    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Ingestion error:", error);
    return new Response(
      JSON.stringify({ status: "error", message: String(error) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
