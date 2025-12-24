import { useLoaderData, Link } from "react-router";
import { db } from "../db/client.server";

export async function loader({ params }: { params: { traceId: string } }) {
  const { traceId } = params;

  const trace = db
    .prepare("SELECT * FROM traces WHERE trace_id = ?")
    .get(traceId) as any;
  const spans = db
    .prepare(
      "SELECT * FROM spans WHERE trace_id = ? ORDER BY start_time_ns ASC",
    )
    .all(traceId) as any[];

  if (!trace) {
    throw new Response("Trace not found", { status: 404 });
  }

  return {
    trace: {
      ...trace,
      start_time_ns: trace.start_time_ns.toString(),
      duration_ms: Number(trace.duration_ns) / 1000000,
    },
    spans: spans.map((s: any) => ({
      ...s,
      start_time_ns: s.start_time_ns.toString(),
      duration_ms: Number(s.duration_ns) / 1000000,
      attributes: JSON.parse(s.attributes_json || "[]"),
    })),
  };
}

export default function TraceDetail() {
  const { trace, spans } = useLoaderData<typeof loader>();

  const traceStart = BigInt(trace.start_time_ns);
  const traceDuration = Number(trace.duration_ns); // This might be 0 if single span

  return (
    <div className="p-4">
      <div className="mb-4">
        <Link to="/traces" className="text-blue-600 hover:underline">
          &larr; Back to Traces
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-2">Trace: {trace.trace_id}</h1>
      <div className="flex gap-4 text-sm text-gray-600 mb-6">
        <div>Service: {trace.service_name}</div>
        <div>
          Start: {new Date(Number(traceStart / 1000000n)).toLocaleString()}
        </div>
        <div>Duration: {trace.duration_ms.toFixed(2)}ms</div>
        <div>Spans: {trace.span_count}</div>
        <div>Errors: {trace.error_count}</div>
      </div>

      <div className="border rounded bg-white p-4 overflow-x-auto">
        <h2 className="font-bold mb-4">Waterfall</h2>
        <div className="relative min-w-[800px]">
          {spans.map((span: any) => {
            const spanStart = BigInt(span.start_time_ns);
            const relativeStart = Number(spanStart - traceStart) / 1000000; // ms
            const duration = span.duration_ms;

            // Calculate width and offset percentages
            // Use trace duration or max span end if trace duration is weird
            const totalDuration = Math.max(trace.duration_ms, 1);
            const leftPct = (relativeStart / totalDuration) * 100;
            const widthPct = Math.max((duration / totalDuration) * 100, 0.5); // Min width for visibility

            return (
              <div key={span.span_id} className="mb-2 group relative">
                <div className="flex items-center text-xs mb-1">
                  <div
                    className="w-48 truncate mr-2 text-right"
                    title={span.span_name}
                  >
                    {span.span_name}
                  </div>
                  <div className="flex-1 relative h-6 bg-gray-100 rounded">
                    <div
                      className={`absolute h-full rounded ${span.status_code === 2 ? "bg-red-400" : "bg-blue-400"} opacity-80 hover:opacity-100`}
                      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                      title={`${span.span_name} (${duration.toFixed(2)}ms)`}
                    ></div>
                  </div>
                  <div className="w-16 text-right ml-2">
                    {duration.toFixed(2)}ms
                  </div>
                </div>
                {/* Details on hover or click could go here */}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-bold mb-4">Span Details</h2>
        {spans.map((span: any) => (
          <details key={span.span_id} className="mb-2 border rounded p-2">
            <summary className="cursor-pointer font-mono text-sm">
              {span.span_name}{" "}
              <span className="text-gray-500">({span.span_id})</span>
            </summary>
            <div className="mt-2 pl-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold">Attributes</h3>
                  <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(span.attributes, null, 2)}
                  </pre>
                </div>
                <div>
                  <h3 className="font-bold">Metadata</h3>
                  <ul className="list-disc pl-4">
                    <li>Kind: {span.span_kind}</li>
                    <li>
                      Status: {span.status_code} {span.status_message}
                    </li>
                    <li>Parent: {span.parent_span_id || "None"}</li>
                  </ul>
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
