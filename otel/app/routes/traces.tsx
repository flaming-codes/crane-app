import { Link, useLoaderData, Form, useSearchParams } from "react-router";
import { db } from "../db/client.server";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const service = url.searchParams.get("service");
  const hasError = url.searchParams.get("hasError");
  const limit = parseInt(url.searchParams.get("limit") || "50", 10);

  const now = BigInt(Date.now()) * 1000000n;
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

  return {
    traces: traces.map((t: any) => ({
      ...t,
      start_time_ns: t.start_time_ns.toString(),
      duration_ms: Number(t.duration_ns) / 1000000,
    })),
    filters: { service, hasError, from: from.toString(), to: to.toString() },
  };
}

export default function Traces() {
  const { traces, filters } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Traces</h1>

      <Form className="mb-6 flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium">Service</label>
          <input
            name="service"
            defaultValue={filters.service || ""}
            className="border p-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Has Error</label>
          <select
            name="hasError"
            defaultValue={filters.hasError || ""}
            className="border p-1 rounded"
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Filter
        </button>
      </Form>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Trace ID</th>
              <th className="p-2 text-left">Time</th>
              <th className="p-2 text-left">Service</th>
              <th className="p-2 text-left">Root Span</th>
              <th className="p-2 text-right">Duration (ms)</th>
              <th className="p-2 text-center">Spans</th>
              <th className="p-2 text-center">Errors</th>
            </tr>
          </thead>
          <tbody>
            {traces.map((trace: any) => (
              <tr key={trace.trace_id} className="border-t hover:bg-gray-50">
                <td className="p-2 font-mono text-sm">
                  <Link
                    to={`/traces/${trace.trace_id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {trace.trace_id.substring(0, 8)}...
                  </Link>
                </td>
                <td className="p-2 text-sm">
                  {new Date(
                    Number(BigInt(trace.start_time_ns) / 1000000n),
                  ).toLocaleString()}
                </td>
                <td className="p-2">{trace.service_name}</td>
                <td className="p-2">{trace.root_span_name}</td>
                <td className="p-2 text-right">
                  {trace.duration_ms.toFixed(2)}
                </td>
                <td className="p-2 text-center">{trace.span_count}</td>
                <td className="p-2 text-center">
                  {trace.has_error ? (
                    <span className="text-red-500 font-bold">Yes</span>
                  ) : (
                    <span className="text-gray-400">No</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
