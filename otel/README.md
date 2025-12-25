# OpenTelemetry Dashboard

A personal OpenTelemetry ingestion and visualization stack built with React Router v7 and SQLite.

## Features

- **Traces**: Waterfall visualization, error filtering, service filtering.
- **Logs**: Time-series logs, correlation with traces (via Trace ID).
- **Metrics**: Basic metric visualization with 1-minute rollups.
- **Architecture**: Single-process app (plus Collector), SQLite storage, no external dependencies.

## Prerequisites

- Node.js >= 20
- OpenTelemetry Collector (binary) installed locally.

## Setup

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start the App**

   ```bash
   npm run dev
   ```

   The app will run at `http://localhost:5173` (or `http://localhost:5174` if 5173 is occupied).

3. **Start the Collector**
   Run the OpenTelemetry Collector with the provided config:
   ```bash
   otelcol --config otel-collector-config.yaml
   ```
   (Ensure you have the `otelcol` binary in your path, or download it from [OpenTelemetry Releases](https://github.com/open-telemetry/opentelemetry-collector-releases/releases). Note: The provided config assumes the app is running on port 5174.)

## Instrumentation

Configure your services to send OTLP data to the collector:

- **Endpoint**: `http://localhost:4318` (HTTP) or `http://localhost:4317` (gRPC)
- **Protocol**: OTLP

Example (Node.js):

```javascript
const { NodeSDK } = require("@opentelemetry/sdk-node");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-http");
// ...
```

## Data Storage

Data is stored in `telemetry.db` (SQLite) in the root of this directory.

- **Traces**: `spans`, `traces` tables.
- **Logs**: `logs` table.
- **Metrics**: `metric_points` (raw, 1h retention), `metric_rollups` (1m buckets).

## Background Jobs

A simple in-process job runs every minute to:

1. Aggregate raw metric points into 1-minute rollups.
2. Delete raw metric points older than 1 hour.

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.
