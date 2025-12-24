# Personal OpenTelemetry Ingestion + SQLite Storage + React Router v7 Dashboard

_A full plan (instructions, guidelines, and design context — no code)._

## Goals and non-goals

### Goals

- **Simple architecture** with great DX.
- **Single deployable stack per site** (no multi-tenant isolation needed).
- **React Router v7 full-stack app**: UI routes + “resource routes” for ingestion/query endpoints.
- **SQLite** as the only database.
- Support core OTel pillars: **traces, logs, metrics** with correlation where possible.
- Fast-enough queries for interactive dashboards on small volumes.

### Non-goals

- Horizontal scaling / HA / distributed storage.
- Implementing the full OTLP protocol stack inside your app (unless you later choose to).
- Full-text enterprise search, sophisticated alerting, or multi-user RBAC (keep it optional).

---

## Architecture overview

### Recommended runtime topology (no Docker sidecar)

You still want an OpenTelemetry Collector to avoid implementing OTLP parsing and edge cases. Without Docker, the cleanest approach is:

- **React Router v7 server** (Node runtime)
  - Hosts the **dashboard UI**
  - Hosts **resource routes** for:
    - ingestion (collector → app)
    - query APIs (UI → app)
- **OpenTelemetry Collector** runs as a **local process** alongside the app
  - Receives OTLP from your instrumented services (HTTP/gRPC)
  - Performs batching/processing
  - Exports normalized telemetry to your app’s ingestion resource routes over HTTP (localhost)

> This is still “one stack” to deploy: two processes, one directory, one configuration. No containers required.

### Process management options

Pick one:

1. **System supervisor (recommended)**: `systemd`, `launchd`, `pm2`, or similar runs both:
   - `otel-collector` binary
   - `node server`
     Pros: resilient, predictable, restarts work well.
2. **App-managed child process**: the React Router server starts the collector (Node `child_process`).
   Pros: “one command” developer experience.
   Cons: crash loops and upgrades are trickier; you must handle shutdown carefully.

### Network binding and security

- Collector receiver binds to **localhost** by default unless you truly need remote ingestion.
- If remote ingestion is needed, enable:
  - **TLS** and/or
  - a **shared bearer token header** check (collector can attach headers on export; receiver side can validate)
- Your ingestion endpoints should ideally accept **only requests from localhost** (or require a token).

---

## Data model strategy (SQLite-first, query-friendly)

### General principles

- Keep a **normalized core** for fast queries and UI rendering.
- Keep **attributes/events/etc. as JSON blobs** (flexible, avoids schema churn).
- Promote a small set of high-value fields into dedicated columns for speed:
  - `service_name`, `span_name`, `status`, `duration`, timestamps, `trace_id`
  - optionally `http.route`, `http.method`, `http.status_code` later

### Timestamps

- Store as **integer nanoseconds** (OTel native).
- Always index by time-range queries:
  - traces list, logs list, metric range queries.

### Tables (conceptual)

#### Spans (raw span records)

Fields to preserve:

- ids: `trace_id`, `span_id`, `parent_span_id`
- `service_name`, `span_name`, `span_kind`
- `start_time_ns`, `end_time_ns`, `duration_ns`
- status: `status_code`, `status_message`
- JSON: `attributes_json`, `events_json`, `links_json`, `resource_json`, scope info

Indexes:

- by time: `(start_time_ns)`
- by trace: `(trace_id)`
- by service/time: `(service_name, start_time_ns)`

#### Traces (summary row per trace)

Purpose: fast trace list without scanning spans.
Fields:

- `trace_id` (pk)
- `start_time_ns`, `end_time_ns`, `duration_ns`
- `root_span_name` (best-effort)
- `service_name` (best-effort, often root span’s service)
- `span_count`
- `error_count`, `has_error`

Indexes:

- `(start_time_ns)`
- `(has_error, start_time_ns)`

Update behavior:

- Ingestion updates this incrementally as spans arrive out-of-order.

#### Logs

Fields:

- `timestamp_ns`, `severity_number`, `severity_text`, `body`
- correlation: `trace_id`, `span_id` (when present)
- `service_name` and JSON attributes/resource/scope

Indexes:

- `(timestamp_ns)`
- `(trace_id)` for “show logs for trace”

Optional: add SQLite **FTS5** later for fast body search.

#### Metrics (raw points + rollups)

Raw points (short retention) + rollups (longer retention):

- raw:
  - `timestamp_ns`, `metric_name`, `metric_type`, `value` (for gauges/counters)
  - JSON: `attributes_json`, `resource_json`, `service_name`
- rollups:
  - `bucket_start_ns` (e.g. 1m buckets)
  - `count`, `sum`, `min`, `max`, `last`
  - `attributes_hash` (stable identifier for attribute set)

Histogram support:

- Keep a representation that allows percentile computation later:
  - store bucket counts + explicit bounds as JSON
  - rollups sum bucket counts

---

## Collector integration plan (no OTLP implementation in your app)

### Collector responsibilities

- Receive OTLP (HTTP + gRPC if you want both)
- Batch + memory limits
- Optional attribute cleanup/sanitization
- Export to your app ingestion routes

### Key collector processors to include

- **batch**: reduces write amplification to SQLite
- **memory_limiter**: prevents collector from OOM on bursts
- **attributes**: optional normalization (e.g. drop secrets, remove query strings)
- Optional later: **tail_sampling** (keep errors/slow traces; drop noise)

### Export path into React Router v7 resource routes

- Configure collector to export via **HTTP** to:
  - `/ingest/traces`
  - `/ingest/logs`
  - `/ingest/metrics`
- Keep these endpoints “write-optimized”:
  - accept batches
  - validate quickly
  - insert in a single transaction per batch

### Payload format strategy

You have two viable approaches:

1. **Collector exports “OTel-like JSON”** (closest to spec concepts)

- Your ingestion routes map this into your internal schema.
- Easier to preserve semantics and evolve.

2. **Collector exports your “internal normalized JSON”**

- Fastest ingestion and simplest mapping.
- But you take on more schema coupling with collector config.

Recommendation: start with **OTel-like JSON** and a mapping layer in your server, so you can evolve storage without touching collector config constantly.

---

## React Router v7 full-stack app structure

### Routing concept

Use React Router v7 with:

- UI routes for pages
- Resource routes for ingestion and query APIs (JSON responses)
- Loaders for data fetching in the UI (server-side where it helps)

### Suggested route map

UI:

- `/` overview (recent errors, p95 latency, top services)
- `/traces` trace explorer (filters + list)
- `/traces/:traceId` trace detail waterfall
- `/logs` log explorer (filter, search)
- `/metrics` metric explorer (select metric, chart)
- `/settings` (optional: retention, attribute rules, tokens)

Resource routes (API):

- `GET /api/health` (db ok, last ingest time)
- `GET /api/traces` (list traces with filters)
- `GET /api/traces/:traceId` (trace detail: spans + computed tree)
- `GET /api/logs` (range query + optional search)
- `GET /api/metrics/names`
- `GET /api/metrics/query` (range query; rollup selection)

Ingestion routes (collector only):

- `POST /ingest/traces`
- `POST /ingest/logs`
- `POST /ingest/metrics`

### Separation inside the codebase (conceptual)

- `telemetry/ingest/*` mapping + validation + batching
- `telemetry/query/*` SQL queries + model shaping for UI
- `telemetry/jobs/*` retention + rollups + vacuum
- `db/*` migrations, connection setup, pragmas

---

## SQLite configuration and performance guidelines

### Must-have pragmas

- WAL mode (concurrent reads while writing)
- `synchronous=NORMAL` (good compromise)
- keep transactions big (batch inserts)

### Insert strategy

- For ingestion endpoints:
  - Validate once, then insert in **one transaction per batch**.
  - Prefer prepared statements.
- Avoid per-row round trips.

### Indexing strategy

- Start with the indexes needed for your UI queries:
  - traces by time, errors by time
  - spans by trace_id
  - logs by time, logs by trace_id
  - metrics by time and metric name
- Add “promoted columns” only when you prove you need them.

### Cardinality control (critical even for personal use)

High-cardinality attributes can bloat SQLite quickly (e.g. `http.target` with query params).
Plan for:

- dropping known-bad keys
- truncating very long values
- optional allowlist of “indexed attributes”

Keep these as config in your app (even if you hardcode at first).

---

## Ingestion behavior details (traces/logs/metrics)

### Traces: out-of-order spans and trace summary maintenance

Assume:

- spans arrive out-of-order
- root span might arrive late
- same trace can arrive over time

Ingestion logic (conceptual):

1. Insert spans (dedupe on `trace_id + span_id`)
2. Upsert trace summary:
   - start = min(current start, span start)
   - end = max(current end, span end)
   - duration = end - start
   - span_count++
   - if span status indicates error → error_count++, has_error=1
3. Root span name:
   - best-effort: parent is null OR earliest span OR server-kind span
   - don’t block on perfection; your UI can still show the trace.

### Logs: correlation-first

Store:

- `trace_id`/`span_id` if present
- Keep fast filters:
  - time range, severity, service_name

Search:

- Start with substring match for tiny volumes.
- Upgrade to FTS5 when it becomes annoying.

### Metrics: retention + rollups from day one

Without rollups, metrics can become your biggest data volume.
Plan:

- Raw points retention: 24–72 hours
- Rollups: 1 minute buckets kept for weeks/months

Query planning:

- If requested range is small, use raw.
- If range is large, use rollups.
- The API can choose the best source automatically based on time range and step.

Histogram plan:

- Implement “store and roll up buckets”
- Percentiles computed in query layer (acceptable for small use)

---

## Query API design guidelines (DX for the dashboard)

### General patterns

- Use consistent parameters:
  - `from`, `to` (ns or ISO; pick one and stick to it)
  - `service`, `hasError`, `minDuration`, `q`, `severity`
- Ensure endpoints are stable, because UI routes depend on them.
- Return UI-friendly shapes:
  - trace list entries include computed duration, error flags, “headline fields”
  - trace detail includes spans already grouped/sorted for waterfall

### Trace explorer filters (recommended minimum)

- time range
- service_name
- has_error
- duration threshold (slow traces)
- span_name contains (optional)

### Trace detail response shaping

Return:

- trace summary
- spans sorted by start time
- parent-child structure (or enough fields for UI to build it)
- derived fields for display:
  - relative start time from trace start
  - percent-of-trace duration
  - depth/indentation order

---

## Dashboard UX plan (React Router v7)

### Global UI principles

- Everything filterable by **time range**.
- Filters reflected in the URL querystring (shareable links).
- “Happy path” views first: “show me recent errors”, “what’s slow”.

### Pages

1. **Overview**
   - recent error traces count
   - slowest traces list
   - top services by traffic (approx: traces count)
   - a few key metric charts (if metrics enabled)

2. **Traces**
   - table of traces (start time, duration, root span, service, error)
   - quick toggles: Errors only / Slow only
   - click into trace detail

3. **Trace detail**
   - waterfall (span bars)
   - span detail panel (attributes/events)
   - “show correlated logs” (filtered by trace_id)

4. **Logs**
   - timeline list
   - severity filter
   - free-text search (basic → later FTS)

5. **Metrics**
   - choose metric name
   - choose aggregation (avg, max, rate)
   - attribute filters (simple key/value)
   - auto-select rollup resolution

### Waterfall visualization guidelines

- Use trace start as zero point.
- Bars show relative start + duration.
- Indentation via parent-span relationships.
- Highlight error spans, and provide a “critical path” hint later (optional).

---

## Background jobs and maintenance

### Jobs to implement

- **Metric rollups** every minute
- **Retention cleanup**:
  - metrics raw cleanup hourly
  - logs/traces cleanup daily
- **Optional vacuum** weekly (or when DB grows too much)

### Retention policy (reasonable defaults)

- traces: 7–30 days
- logs: 3–14 days
- raw metrics: 1–3 days
- rollups: 30–180 days

Make these configurable in one place.

---

## Instrumentation onboarding (DX checklist)

You are deploying per site, so onboarding should be dead-simple:

- Provide a “Getting started” doc in your app UI:
  - OTLP endpoint (collector)
  - required headers (if any)
  - recommended environment variables
  - minimal service naming guidance (`service.name`)

### Naming conventions (strongly recommended)

- Always set:
  - `service.name`
  - `deployment.environment` (even if always “prod”, it helps later)
- Encourage stable span names and stable route names (avoid IDs embedded in names).

---

## Observability of the observability stack (yes, do it lightly)

- Log ingestion failures (count and sample payload size, not full payload).
- Track last ingest timestamp for each signal (traces/logs/metrics).
- Add a minimal internal metric:
  - ingested spans/sec
  - DB insert latency
  - queue/batch sizes
    This can be printed in server logs first; metrics later.

---

## Development and deployment workflow

### Local dev

- Run React Router dev server
- Run collector as a local process with a config file pointing exports to localhost ingestion routes
- Use a sample instrumented app to generate telemetry

### Production deploy (simple)

- Build your React Router server
- Ship:
  - server bundle
  - SQLite DB file (created on first run)
  - migrations
  - collector binary + collector config
- Use systemd/pm2 to run both processes.

### Configuration strategy

- One `.env` or config file:
  - DB path
  - retention settings
  - collector ports
  - ingestion auth token (optional)
  - attribute drop/truncate rules

---

## Phased implementation plan

### Phase 1 — Traces MVP (highest value)

- Collector receives OTLP and exports traces to `/ingest/traces`
- SQLite spans + traces summary tables
- Trace explorer UI + trace detail waterfall
- Basic retention for spans/traces

**Done when:** you can click from “trace list” → “waterfall”, filter errors, and it stays fast.

### Phase 2 — Logs + correlation

- Collector exports logs to `/ingest/logs`
- Logs UI with time range + severity filter
- “Logs for this trace” link from trace detail

**Done when:** you can debug a failing trace with its logs.

### Phase 3 — Metrics + rollups

- Collector exports metrics to `/ingest/metrics`
- Raw storage + 1m rollups job
- Metrics explorer UI (basic charts)
- Add histogram support if you care about p95/p99

**Done when:** overview page shows latency/error trends without giant DB growth.

### Phase 4 — DX polish + guardrails

- Attribute rules UI (drop/truncate/index)
- Saved queries / pinned charts
- Optional FTS logs search
- Optional sampling rules (collector tail sampling later)

---

## Key tradeoffs and decisions (write these down so Future You remembers)

- You chose **collector** to avoid implementing OTLP parsing and edge cases.
- You chose **SQLite** + **rollups** to keep ops and cost near-zero.
- You chose **normalized core + JSON attributes** to avoid schema lock-in.
- You chose **per-site redeploy** instead of multi-tenant complexity.
- You chose **two-process stack** (app + collector) without Docker because it’s the cleanest “simple but correct” approach.

---

## Open questions (safe defaults)

If you don’t want to think about these now, choose the defaults:

- OTLP receiver exposure:
  - default: **localhost only**
- Auth:
  - default: **none** if localhost-only
  - add token if you open to LAN/WAN
- Sampling:
  - default: none initially, then head-sampling later if DB grows too fast
- Histogram percentiles:
  - default: implement later unless you really need p95 charts early
