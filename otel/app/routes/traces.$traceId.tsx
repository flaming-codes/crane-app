import { useLoaderData, Link } from "react-router";
import { db } from "../db/client.server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Separator } from "~/components/ui/separator";

export async function loader({ params }: { params: { traceId: string } }) {
  const { traceId } = params;

  const trace = db
    .prepare("SELECT * FROM traces WHERE trace_id = ?")
    .get(traceId) as any;
  const spans = db
    .prepare(
      "SELECT * FROM spans WHERE trace_id = ? ORDER BY start_time_ns ASC"
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
  const traceDuration = Number(trace.duration_ns);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Trace Details</h1>
        <Badge variant={trace.has_error ? "destructive" : "outline"}>
          {trace.has_error ? "Error" : "Success"}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground block">Trace ID</span>
              <span className="font-mono text-sm">{trace.trace_id}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground block">Service</span>
              <span>{trace.service_name}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground block">Start Time</span>
              <span>{new Date(Number(traceStart / 1000000n)).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground block">Duration</span>
              <span>{trace.duration_ms.toFixed(2)}ms</span>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground block">Spans</span>
              <span>{trace.span_count}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Waterfall</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="relative min-w-[800px] space-y-1">
            {spans.map((span: any) => {
              const spanStart = BigInt(span.start_time_ns);
              const relativeStart = Number(spanStart - traceStart) / 1000000; // ms
              const duration = span.duration_ms;

              const totalDuration = Math.max(trace.duration_ms, 1);
              const leftPct = (relativeStart / totalDuration) * 100;
              const widthPct = Math.max((duration / totalDuration) * 100, 0.5);

              return (
                <div key={span.span_id} className="group relative py-1 hover:bg-muted/50 rounded">
                  <div className="flex items-center text-xs mb-1 px-2">
                    <div className="w-48 truncate font-medium mr-2" title={span.span_name}>
                      {span.span_name}
                    </div>
                    <div className="w-32 truncate text-muted-foreground mr-2" title={span.service_name}>
                      {span.service_name}
                    </div>
                    <div className="text-muted-foreground">
                      {duration.toFixed(2)}ms
                    </div>
                  </div>
                  <div className="relative h-6 w-full bg-muted/20 rounded overflow-hidden">
                    <div
                      className={`absolute h-full rounded ${
                        span.status_code === "ERROR" ? "bg-destructive" : "bg-primary"
                      }`}
                      style={{
                        left: `${leftPct}%`,
                        width: `${widthPct}%`,
                      }}
                    />
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="details" className="border-none">
                      <AccordionTrigger className="py-1 text-xs text-muted-foreground hover:no-underline">
                        View Attributes
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="bg-muted/50 p-2 rounded text-xs font-mono overflow-x-auto">
                          <pre>{JSON.stringify(span.attributes, null, 2)}</pre>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
