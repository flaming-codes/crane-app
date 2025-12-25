import { Link, useLoaderData, Form } from "react-router";
import { db } from "../db/client.server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Search } from "lucide-react";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Traces</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            method="get"
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Service</label>
              <Input
                name="service"
                defaultValue={filters.service || ""}
                placeholder="Filter by service..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Has Error</label>
              <Select name="hasError" defaultValue={filters.hasError || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trace ID</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Root Span</TableHead>
                <TableHead>Duration (ms)</TableHead>
                <TableHead>Spans</TableHead>
                <TableHead>Errors</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {traces.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    No traces found.
                  </TableCell>
                </TableRow>
              ) : (
                traces.map((trace: any) => (
                  <TableRow key={trace.trace_id}>
                    <TableCell>
                      <Link
                        to={`/traces/${trace.trace_id}`}
                        className="font-mono text-xs text-primary hover:underline"
                      >
                        {trace.trace_id.substring(0, 8)}...
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs">
                      {new Date(
                        Number(BigInt(trace.start_time_ns) / 1000000n)
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell>{trace.service_name}</TableCell>
                    <TableCell>{trace.root_span_name}</TableCell>
                    <TableCell>{trace.duration_ms.toFixed(2)}</TableCell>
                    <TableCell>{trace.span_count}</TableCell>
                    <TableCell>
                      {trace.has_error ? (
                        <Badge variant="destructive">Error</Badge>
                      ) : (
                        <Badge variant="outline">OK</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
