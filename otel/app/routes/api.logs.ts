import { type LoaderFunctionArgs } from "react-router";
import { db } from "../db/client.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const service = url.searchParams.get("service");
  const traceId = url.searchParams.get("traceId");
  const severity = url.searchParams.get("severity");
  const limit = parseInt(url.searchParams.get("limit") || "100", 10);

  const now = BigInt(Date.now()) * 1000000n;
  const oneHourAgo = now - 60n * 60n * 1000n * 1000000n;

  const from = url.searchParams.get("from")
    ? BigInt(url.searchParams.get("from")!)
    : oneHourAgo;
  const to = url.searchParams.get("to")
    ? BigInt(url.searchParams.get("to")!)
    : now;

  let sql = `
    SELECT * FROM logs 
    WHERE timestamp_ns >= ? AND timestamp_ns <= ?
  `;
  const params: any[] = [from, to];

  if (service) {
    sql += ` AND service_name = ?`;
    params.push(service);
  }

  if (traceId) {
    sql += ` AND trace_id = ?`;
    params.push(traceId);
  }

  if (severity) {
    sql += ` AND severity_text = ?`;
    params.push(severity);
  }

  sql += ` ORDER BY timestamp_ns DESC LIMIT ?`;
  params.push(limit);

  const logs = db.prepare(sql).all(...params);

  const serializedLogs = logs.map((l: any) => ({
    ...l,
    timestamp_ns: l.timestamp_ns.toString(),
    attributes: JSON.parse(l.attributes_json || "[]"),
    resource: JSON.parse(l.resource_json || "{}"),
  }));

  return new Response(JSON.stringify({ logs: serializedLogs }), {
    headers: { "Content-Type": "application/json" },
  });
}
