import { Link, useLoaderData, Form, useSearchParams } from "react-router";
import { db } from "../db/client.server";

export async function loader({ request }: { request: Request }) {
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

  return {
    logs: logs.map((l: any) => ({
      ...l,
      timestamp_ns: l.timestamp_ns.toString(),
    })),
    filters: {
      service,
      traceId,
      severity,
      from: from.toString(),
      to: to.toString(),
    },
  };
}

export default function Logs() {
  const { logs, filters } = useLoaderData<typeof loader>();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Logs</h1>

      <Form className="mb-6 flex gap-4 items-end flex-wrap">
        <div>
          <label className="block text-sm font-medium">Service</label>
          <input
            name="service"
            defaultValue={filters.service || ""}
            className="border p-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Trace ID</label>
          <input
            name="traceId"
            defaultValue={filters.traceId || ""}
            className="border p-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Severity</label>
          <select
            name="severity"
            defaultValue={filters.severity || ""}
            className="border p-1 rounded"
          >
            <option value="">All</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
            <option value="DEBUG">DEBUG</option>
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
        <table className="min-w-full bg-white border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left w-48">Time</th>
              <th className="p-2 text-left w-24">Severity</th>
              <th className="p-2 text-left w-32">Service</th>
              <th className="p-2 text-left">Body</th>
              <th className="p-2 text-left w-32">Trace</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log: any) => (
              <tr
                key={`${log.timestamp_ns}-${log.body.substring(0, 10)}`}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-2 whitespace-nowrap">
                  {new Date(
                    Number(BigInt(log.timestamp_ns) / 1000000n),
                  ).toLocaleString()}
                </td>
                <td
                  className={`p-2 font-bold ${
                    log.severity_text === "ERROR"
                      ? "text-red-600"
                      : log.severity_text === "WARN"
                        ? "text-yellow-600"
                        : "text-gray-600"
                  }`}
                >
                  {log.severity_text}
                </td>
                <td className="p-2">{log.service_name}</td>
                <td className="p-2 font-mono whitespace-pre-wrap break-all max-w-xl">
                  {log.body}
                </td>
                <td className="p-2 font-mono text-xs">
                  {log.trace_id && (
                    <Link
                      to={`/traces/${log.trace_id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {log.trace_id.substring(0, 8)}...
                    </Link>
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
