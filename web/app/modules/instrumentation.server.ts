/* eslint-disable no-console */
import process from "node:process";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { ENV } from "../data/env";
import { RemixInstrumentation } from "opentelemetry-instrumentation-remix";

export function initOTEL() {
  console.log("Initializing instrumentation server");

  if (ENV.OTEL_ENABLED === "true" && ENV.OTEL_TRACE_URL && ENV.OTEL_NAME) {
    const traceExporter = new OTLPTraceExporter({
      url: ENV.OTEL_TRACE_URL,
    });

    const sdk = new NodeSDK({
      traceExporter,
      instrumentations: [
        getNodeAutoInstrumentations(),
        new RemixInstrumentation(),
      ],
      resource: new Resource({
        ["service.name"]: ENV.OTEL_NAME,
        ["service.version"]: ENV.npm_package_version,
      }),
    });

    // initialize the SDK and register with the OpenTelemetry API
    // this enables the API to record telemetry
    sdk.start();

    console.log("Instrumentation server initialized");

    // gracefully shut down the SDK on process exit
    process.on("SIGTERM", () => {
      sdk
        .shutdown()
        .then(() => console.log("Tracing terminated"))
        .catch((error) => console.log("Error terminating tracing", error))
        .finally(() => process.exit(0));
    });
  } else {
    console.log("Instrumentation server skipped");
  }
}
