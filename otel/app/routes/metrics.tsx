import {
  Link,
  useLoaderData,
  Form,
  useSearchParams,
  useSubmit,
} from "react-router";
import { db } from "../db/client.server";
import { useEffect, useState } from "react";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const metricName = url.searchParams.get("name");
  const service = url.searchParams.get("service");

  // Get all metric names for the dropdown
  const names = db
    .prepare(
      "SELECT DISTINCT metric_name FROM metric_points ORDER BY metric_name",
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

  // Simple SVG Line Chart
  const width = 800;
  const height = 300;
  const padding = 40;

  let chartPath = "";
  let minTime = 0;
  let maxTime = 0;
  let minValue = 0;
  let maxValue = 0;

  if (points.length > 1) {
    minTime = Math.min(...points.map((p) => p.timestamp));
    maxTime = Math.max(...points.map((p) => p.timestamp));
    minValue = Math.min(...points.map((p) => p.value));
    maxValue = Math.max(...points.map((p) => p.value));

    // Add some padding to value range
    const valueRange = maxValue - minValue || 1;
    minValue -= valueRange * 0.1;
    maxValue += valueRange * 0.1;

    const timeRange = maxTime - minTime;
    const plotWidth = width - padding * 2;
    const plotHeight = height - padding * 2;

    chartPath = points
      .map((p, i) => {
        const x = padding + ((p.timestamp - minTime) / timeRange) * plotWidth;
        const y =
          height -
          padding -
          ((p.value - minValue) / (maxValue - minValue)) * plotHeight;
        return `${i === 0 ? "M" : "L"} ${x},${y}`;
      })
      .join(" ");
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Metrics</h1>

      <Form
        className="mb-6 flex gap-4 items-end"
        onChange={(e) => submit(e.currentTarget)}
      >
        <div>
          <label className="block text-sm font-medium">Metric Name</label>
          <select
            name="name"
            defaultValue={filters.metricName || ""}
            className="border p-1 rounded w-64"
          >
            <option value="">Select a metric...</option>
            {names.map((n: string) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Service</label>
          <input
            name="service"
            defaultValue={filters.service || ""}
            className="border p-1 rounded"
            placeholder="Optional"
          />
        </div>
      </Form>

      {filters.metricName && points.length === 0 && (
        <div className="text-gray-500">
          No data found for this metric in the last hour.
        </div>
      )}

      {points.length > 0 && (
        <div className="border rounded bg-white p-4">
          <h2 className="font-bold mb-2">{filters.metricName}</h2>
          <svg
            width="100%"
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="overflow-visible"
          >
            {/* Axes */}
            <line
              x1={padding}
              y1={height - padding}
              x2={width - padding}
              y2={height - padding}
              stroke="#ccc"
            />
            <line
              x1={padding}
              y1={padding}
              x2={padding}
              y2={height - padding}
              stroke="#ccc"
            />

            {/* Data Line */}
            <path d={chartPath} fill="none" stroke="#3b82f6" strokeWidth="2" />

            {/* Labels (simplified) */}
            <text
              x={padding}
              y={height - padding + 20}
              fontSize="10"
              textAnchor="middle"
            >
              {new Date(minTime).toLocaleTimeString()}
            </text>
            <text
              x={width - padding}
              y={height - padding + 20}
              fontSize="10"
              textAnchor="middle"
            >
              {new Date(maxTime).toLocaleTimeString()}
            </text>
            <text
              x={padding - 5}
              y={height - padding}
              fontSize="10"
              textAnchor="end"
            >
              {minValue.toFixed(2)}
            </text>
            <text x={padding - 5} y={padding} fontSize="10" textAnchor="end">
              {maxValue.toFixed(2)}
            </text>
          </svg>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Showing {points.length} data points from last hour
          </div>
        </div>
      )}
    </div>
  );
}
