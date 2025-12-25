import { Link, useLoaderData, Form, useSubmit } from "react-router";
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
  const submit = useSubmit();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Logs</h1>
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
              <label className="text-sm font-medium">Trace ID</label>
              <Input
                name="traceId"
                defaultValue={filters.traceId || ""}
                placeholder="Filter by trace ID..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Severity</label>
              <Select name="severity" defaultValue={filters.severity || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="All Severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INFO">INFO</SelectItem>
                  <SelectItem value="WARN">WARN</SelectItem>
                  <SelectItem value="ERROR">ERROR</SelectItem>
                  <SelectItem value="DEBUG">DEBUG</SelectItem>
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
                <TableHead>Time</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Body</TableHead>
                <TableHead>Trace</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No logs found.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log: any) => (
                  <TableRow key={`${log.timestamp_ns}-${log.body.substring(0, 10)}`}>
                    <TableCell className="whitespace-nowrap font-mono text-xs">
                      {new Date(
                        Number(BigInt(log.timestamp_ns) / 1000000n)
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          log.severity_text === "ERROR"
                            ? "destructive"
                            : log.severity_text === "WARN"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {log.severity_text}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.service_name}</TableCell>
                    <TableCell className="max-w-md truncate" title={log.body}>
                      {log.body}
                    </TableCell>
                    <TableCell>
                      {log.trace_id ? (
                        <Link
                          to={`/traces/${log.trace_id}`}
                          className="font-mono text-xs text-primary hover:underline"
                        >
                          {log.trace_id.substring(0, 8)}...
                        </Link>
                      ) : (
                        "-"
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
