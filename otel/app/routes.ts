import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("traces", "routes/traces.tsx"),
  route("traces/:traceId", "routes/traces.$traceId.tsx"),

  // API Routes
  route("api/traces", "routes/api.traces.ts"),
  route("api/traces/:traceId", "routes/api.traces.$traceId.ts"),
  route("api/logs", "routes/api.logs.ts"),
  route("api/metrics/names", "routes/api.metrics.names.ts"),
  route("api/metrics/query", "routes/api.metrics.query.ts"),

  // Ingestion Routes
  route("ingest/traces", "routes/ingest.traces.ts"),
  route("ingest/logs", "routes/ingest.logs.ts"),
  route("ingest/metrics", "routes/ingest.metrics.ts"),

  // UI Routes
  route("logs", "routes/logs.tsx"),
  route("metrics", "routes/metrics.tsx"),
] satisfies RouteConfig;
