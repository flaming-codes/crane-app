import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { logs } from "@opentelemetry/api-logs";
import {
  LoggerProvider,
  SimpleLogRecordProcessor,
  ConsoleLogRecordExporter,
} from "@opentelemetry/sdk-logs";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { WinstonInstrumentation } from "@opentelemetry/instrumentation-winston";
import * as winston from "winston";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { ENV } from "../data/env";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";

const serviceName = "crane-app";

const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
});

const otlpExporter = new OTLPLogExporter({
  url: process.env.OTEL_TRACE_URL,
});

const tracerProvider = new NodeTracerProvider({ resource });
tracerProvider.register();

const loggerProvider = new LoggerProvider({ resource });

// Configure the logger provider with a processor and exporter
loggerProvider.addLogRecordProcessor(
  new SimpleLogRecordProcessor(
    ENV.OTEL_ENABLED === "true" ? otlpExporter : new ConsoleLogRecordExporter(),
  ),
);

// Set the global logger provider
logs.setGlobalLoggerProvider(loggerProvider);

registerInstrumentations({
  instrumentations: [
    new WinstonInstrumentation({
      enabled: ENV.OTEL_ENABLED === "true",
      // Also set the resource here if needed for instrumentation-specific resources
      // resource: resource
    }),
  ],
});

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.json(),
});

export const slog = logger;
