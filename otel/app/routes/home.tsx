import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/home";
import { db } from "../db/client.server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Activity, AlertCircle, FileText } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Telemetry Dashboard" },
    {
      name: "description",
      content: "Overview of your system's observability data.",
    },
  ];
}

export async function loader() {
  const now = BigInt(Date.now()) * 1000000n;
  const oneDayAgo = now - 24n * 60n * 60n * 1000n * 1000000n;

  const traceCount = db
    .prepare("SELECT COUNT(*) as count FROM traces WHERE start_time_ns >= ?")
    .get(oneDayAgo) as { count: number };

  const errorCount = db
    .prepare(
      "SELECT COUNT(*) as count FROM traces WHERE start_time_ns >= ? AND has_error = 1"
    )
    .get(oneDayAgo) as { count: number };

  const logCount = db
    .prepare("SELECT COUNT(*) as count FROM logs WHERE timestamp_ns >= ?")
    .get(oneDayAgo) as { count: number };

  const recentTraces = db
    .prepare(
      "SELECT * FROM traces ORDER BY start_time_ns DESC LIMIT 5"
    )
    .all() as any[];

  return {
    stats: {
      traces: traceCount.count,
      errors: errorCount.count,
      logs: logCount.count,
      errorRate:
        traceCount.count > 0
          ? ((errorCount.count / traceCount.count) * 100).toFixed(2)
          : "0.00",
    },
    recentTraces: recentTraces.map((t) => ({
      ...t,
      start_time_ns: t.start_time_ns.toString(),
      duration_ms: Number(t.duration_ns) / 1000000,
    })),
  };
}

export default function Home() {
  const { stats, recentTraces } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Traces (24h)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.traces}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate (24h)</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.errorRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs (24h)</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.logs}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Traces</CardTitle>
            <CardDescription>
              Latest traces captured by the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTraces.map((trace) => (
                <div
                  key={trace.trace_id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {trace.service_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {trace.root_span_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-right">
                      <p>{trace.duration_ms.toFixed(2)}ms</p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(
                          Number(BigInt(trace.start_time_ns) / 1000000n)
                        ).toLocaleTimeString()}
                      </p>
                    </div>
                    <Link
                      to={`/traces/${trace.trace_id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
