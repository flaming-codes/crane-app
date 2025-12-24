import { type LoaderFunctionArgs } from "react-router";
import { db } from "../db/client.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const service = url.searchParams.get("service");
  const hasError = url.searchParams.get("hasError");
  const limit = parseInt(url.searchParams.get("limit") || "50", 10);

  // Default to last 1 hour if not specified
  const now = BigInt(Date.now()) * 1000000n; // ns
  const oneHourAgo = now - 60n * 60n * 1000n * 1000000n;

  const from = url.searchParams.get("from")
    ? BigInt(url.searchParams.get("from")!)
    : oneHourAgo;
  const to = url.searchParams.get("to")
    ? BigInt(url.searchParams.get("to")!)
    : now;

  let sql = `
    SELECT * FROM traces 
    WHERE start_time_ns >= ? AND start_time_ns <= ?
  `;
  const params: any[] = [from, to];

  if (service) {
    sql += ` AND service_name = ?`;
    params.push(service);
  }

  if (hasError === "true") {
    sql += ` AND has_error = 1`;
  }

  sql += ` ORDER BY start_time_ns DESC LIMIT ?`;
  params.push(limit);

  const traces = db.prepare(sql).all(...params);

  // Convert BigInt to string for JSON serialization
  const serializedTraces = traces.map((t: any) => ({
    ...t,
    start_time_ns: t.start_time_ns.toString(),
    end_time_ns: t.end_time_ns.toString(),
    duration_ns: t.duration_ns.toString(),
  }));

  return new Response(JSON.stringify({ traces: serializedTraces }), {
    headers: { "Content-Type": "application/json" },
  });
}
