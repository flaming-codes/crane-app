import { type LoaderFunctionArgs } from "react-router";
import { db } from "../db/client.server";

export async function loader({ params }: LoaderFunctionArgs) {
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
    return new Response("Trace not found", { status: 404 });
  }

  const serializedTrace = {
    ...trace,
    start_time_ns: trace.start_time_ns.toString(),
    end_time_ns: trace.end_time_ns.toString(),
    duration_ns: trace.duration_ns.toString(),
  };

  const serializedSpans = spans.map((s: any) => ({
    ...s,
    start_time_ns: s.start_time_ns.toString(),
    end_time_ns: s.end_time_ns.toString(),
    duration_ns: s.duration_ns.toString(),
    attributes: JSON.parse(s.attributes_json || "[]"),
    events: JSON.parse(s.events_json || "[]"),
    resource: JSON.parse(s.resource_json || "{}"),
  }));

  return new Response(
    JSON.stringify({ trace: serializedTrace, spans: serializedSpans }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}
