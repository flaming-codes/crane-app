import { Link, useLoaderData, Form, useSubmit } from "react-router";
import { db } from "../db/client.server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Search } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const metricName = url.searchParams.get("name");
  const service = url.searchParams.get("service");

  // Get all metric names for the dropdown
  const names = db
    .prepare(
      "SELECT DISTINCT metric_name FROM metric_points ORDER BY metric_name"
    )
    .all()
    .map((n: any) => n.metric_name);

  let points: any[] = [];

  if (metricName) {
    const now = BigInt(Date.now()) * 1000000n;
    const oneHourAgo = now - 60n * 60n * 1000n * 1000000n;

    const from = url.searchParams.get("from")
      ? BigInt(url.searchParams.get("from")!)
      : oneHourAgo;
    const to = url.searchParams.get("to")
      ? BigInt(url.searchParams.get("to")!)
      : now;

    let sql = `
      SELECT timestamp_ns, value 
      FROM metric_points 
      WHERE metric_name = ? AND timestamp_ns >= ? AND timestamp_ns <= ?
    `;
    const params: any[] = [metricName, from, to];

    if (service) {
      sql += ` AND service_name = ?`;
      params.push(service);
    }

    sql += ` ORDER BY timestamp_ns ASC`;

    // Limit points for UI performance
    sql += ` LIMIT 1000`;

    const rawPoints = db.prepare(sql).all(...params);
    points = rawPoints.map((p: any) => ({
      timestamp: Number(BigInt(p.timestamp_ns) / 1000000n), // ms
      value: p.value,
    }));
  }

  return {
    names,
    points,
    filters: { metricName, service },
  };
}

export default function Metrics() {
  const { names, points, filters } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Metrics</h1>
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
              <label className="text-sm font-medium">Metric Name</label>
              <Select name="name" defaultValue={filters.metricName || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metric..." />
                </SelectTrigger>
                <SelectContent>
                  {names.map((name: string) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Service</label>
              <Input
                name="service"
                defaultValue={filters.service || ""}
                placeholder="Filter by service..."
              />
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

      {filters.metricName && (
        <Card>
          <CardHeader>
            <CardTitle>{filters.metricName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={points}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                    minTickGap={50}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(time) => new Date(time).toLocaleString()}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
