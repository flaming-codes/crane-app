import { type LoaderFunctionArgs } from "react-router";
import { db } from "../db/client.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const metricName = url.searchParams.get("name");
  const service = url.searchParams.get("service");

  const now = BigInt(Date.now()) * 1000000n;
  const oneHourAgo = now - 60n * 60n * 1000n * 1000000n;

  const from = url.searchParams.get("from")
    ? BigInt(url.searchParams.get("from")!)
    : oneHourAgo;
  const to = url.searchParams.get("to")
    ? BigInt(url.searchParams.get("to")!)
    : now;

  if (!metricName) {
    return new Response("Metric name required", { status: 400 });
  }

  let sql = `
    SELECT timestamp_ns, value, attributes_json 
    FROM metric_points 
    WHERE metric_name = ? AND timestamp_ns >= ? AND timestamp_ns <= ?
  `;
  const params: any[] = [metricName, from, to];

  if (service) {
    sql += ` AND service_name = ?`;
    params.push(service);
  }

  sql += ` ORDER BY timestamp_ns ASC`;

  const points = db.prepare(sql).all(...params);

  return new Response(
    JSON.stringify({
      points: points.map((p: any) => ({
        timestamp_ns: p.timestamp_ns.toString(),
        value: p.value,
        attributes: JSON.parse(p.attributes_json || "[]"),
      })),
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}
