import { type ActionFunctionArgs } from "react-router";
import { db } from "../db/client.server";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const data = await request.json();

    const insertPoint = db.prepare(`
      INSERT INTO metric_points (
        timestamp_ns, metric_name, metric_type, value,
        service_name, attributes_json, resource_json
      ) VALUES (
        @timestamp_ns, @metric_name, @metric_type, @value,
        @service_name, @attributes_json, @resource_json
      )
    `);

    const transaction = db.transaction((resourceMetrics: any[]) => {
      for (const rm of resourceMetrics) {
        const resource = rm.resource || {};
        const serviceNameAttr = resource.attributes?.find(
          (a: any) => a.key === "service.name",
        );
        const serviceName =
          serviceNameAttr?.value?.stringValue || "unknown_service";
        const resourceJson = JSON.stringify(resource);

        for (const sm of rm.scopeMetrics || []) {
          for (const metric of sm.metrics || []) {
            const name = metric.name;

            const points = [];
            let type = "unknown";

            if (metric.gauge) {
              type = "gauge";
              points.push(...(metric.gauge.dataPoints || []));
            } else if (metric.sum) {
              type = "sum";
              points.push(...(metric.sum.dataPoints || []));
            } else if (metric.histogram) {
              type = "histogram";
              // For histogram, we store the sum as the value for simple plotting
              points.push(
                ...(metric.histogram.dataPoints || []).map((p: any) => ({
                  ...p,
                  value: p.sum,
                })),
              );
            }

            for (const point of points) {
              let value = 0;
              if (point.asDouble !== undefined) value = point.asDouble;
              else if (point.asInt !== undefined) value = Number(point.asInt);
              else if (point.value !== undefined) value = point.value;

              insertPoint.run({
                timestamp_ns: BigInt(point.timeUnixNano),
                metric_name: name,
                metric_type: type,
                value: value,
                service_name: serviceName,
                attributes_json: JSON.stringify(point.attributes || []),
                resource_json: resourceJson,
              });
            }
          }
        }
      }
    });

    if (data.resourceMetrics) {
      transaction(data.resourceMetrics);
    }

    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Metric ingestion error:", error);
    return new Response(
      JSON.stringify({ status: "error", message: String(error) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
