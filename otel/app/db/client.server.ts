import Database from "better-sqlite3";
import path from "path";

const dbPath = process.env.DB_PATH || path.join(process.cwd(), "telemetry.db");

// Ensure the directory exists if we are using a custom path,
// but for CWD it should be fine.
const db = new Database(dbPath);

// Enable WAL mode for concurrency
db.pragma("journal_mode = WAL");
db.pragma("synchronous = NORMAL");

// Initialize tables
const initSql = `
  CREATE TABLE IF NOT EXISTS spans (
    trace_id TEXT NOT NULL,
    span_id TEXT NOT NULL,
    parent_span_id TEXT,
    service_name TEXT,
    span_name TEXT,
    span_kind TEXT,
    start_time_ns INTEGER,
    end_time_ns INTEGER,
    duration_ns INTEGER,
    status_code TEXT,
    status_message TEXT,
    attributes_json TEXT,
    events_json TEXT,
    links_json TEXT,
    resource_json TEXT,
    PRIMARY KEY (trace_id, span_id)
  );

  CREATE INDEX IF NOT EXISTS idx_spans_trace_id ON spans(trace_id);
  CREATE INDEX IF NOT EXISTS idx_spans_start_time ON spans(start_time_ns);
  CREATE INDEX IF NOT EXISTS idx_spans_service_time ON spans(service_name, start_time_ns);

  CREATE TABLE IF NOT EXISTS traces (
    trace_id TEXT PRIMARY KEY,
    start_time_ns INTEGER,
    end_time_ns INTEGER,
    duration_ns INTEGER,
    root_span_name TEXT,
    service_name TEXT,
    span_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    has_error INTEGER DEFAULT 0
  );

  CREATE INDEX IF NOT EXISTS idx_traces_start_time ON traces(start_time_ns);
  CREATE INDEX IF NOT EXISTS idx_traces_error_time ON traces(has_error, start_time_ns);

  CREATE TABLE IF NOT EXISTS logs (
    timestamp_ns INTEGER,
    severity_number INTEGER,
    severity_text TEXT,
    body TEXT,
    trace_id TEXT,
    span_id TEXT,
    service_name TEXT,
    attributes_json TEXT,
    resource_json TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp_ns);
  CREATE INDEX IF NOT EXISTS idx_logs_trace_id ON logs(trace_id);
  CREATE INDEX IF NOT EXISTS idx_logs_service ON logs(service_name);

  CREATE TABLE IF NOT EXISTS metric_points (
    timestamp_ns INTEGER,
    metric_name TEXT,
    metric_type TEXT,
    value REAL,
    service_name TEXT,
    attributes_json TEXT,
    resource_json TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_metrics_time_name ON metric_points(metric_name, timestamp_ns);
  CREATE INDEX IF NOT EXISTS idx_metrics_service ON metric_points(service_name);

  CREATE TABLE IF NOT EXISTS metric_rollups (
    bucket_start_ns INTEGER,
    metric_name TEXT,
    service_name TEXT,
    attributes_hash TEXT,
    count INTEGER,
    sum REAL,
    min REAL,
    max REAL,
    last REAL,
    attributes_json TEXT,
    PRIMARY KEY (bucket_start_ns, metric_name, service_name, attributes_hash)
  );
`;

db.exec(initSql);

// Background Job for Rollups
if (!(global as any).__rollupStarted) {
  (global as any).__rollupStarted = true;
  console.log("Starting metric rollup job...");

  setInterval(() => {
    try {
      const bucketSizeNs = 60n * 1000n * 1000000n; // 1 minute
      const now = BigInt(Date.now()) * 1000000n;
      const fiveMinutesAgo = now - 5n * bucketSizeNs;

      // Aggregate into 1m buckets
      const sql = `
        INSERT INTO metric_rollups (
          bucket_start_ns, metric_name, service_name, attributes_hash,
          count, sum, min, max, last, attributes_json
        )
        SELECT 
          (timestamp_ns / ${bucketSizeNs}) * ${bucketSizeNs} as bucket_start,
          metric_name,
          service_name,
          metric_name || '_' || service_name || '_' || attributes_json as attr_hash,
          COUNT(*) as count,
          SUM(value) as sum,
          MIN(value) as min,
          MAX(value) as max,
          MAX(value) as last,
          attributes_json
        FROM metric_points
        WHERE timestamp_ns > ?
        GROUP BY bucket_start, metric_name, service_name, attributes_json
        ON CONFLICT(bucket_start_ns, metric_name, service_name, attributes_hash) DO UPDATE SET
          count = excluded.count,
          sum = excluded.sum,
          min = excluded.min,
          max = excluded.max,
          last = excluded.last
      `;

      db.prepare(sql).run(fiveMinutesAgo);

      // Cleanup raw points older than 1 hour
      const oneHourAgo = now - 60n * 60n * 1000n * 1000000n;
      db.prepare("DELETE FROM metric_points WHERE timestamp_ns < ?").run(
        oneHourAgo,
      );
    } catch (e) {
      console.error("Rollup job failed:", e);
    }
  }, 60 * 1000);
}

export { db };
