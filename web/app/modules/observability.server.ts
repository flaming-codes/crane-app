import { logs } from "@opentelemetry/api-logs";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import {
  LoggerProvider,
  SimpleLogRecordProcessor,
  ConsoleLogRecordExporter,
} from "@opentelemetry/sdk-logs";
import { Resource } from "@opentelemetry/resources";
import { ENV } from "../data/env";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import * as winston from "winston";

const serviceName = ENV.OTEL_NAME || "crane-app";

// Surface OTLP exporter errors while debugging log delivery issues
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const resource = new Resource({
  ["service.name"]: serviceName,
  ["service.version"]: ENV.npm_package_version,
});

const otlpExporter = new OTLPLogExporter({
  url: ENV.OTEL_LOG_URL || ENV.OTEL_TRACE_URL,
});

const loggerProvider = new LoggerProvider({ resource });

// Configure the logger provider with a processor and exporter
loggerProvider.addLogRecordProcessor(
  new SimpleLogRecordProcessor(
    ENV.OTEL_ENABLED === "true" ? otlpExporter : new ConsoleLogRecordExporter(),
  ),
);

// Set the global logger provider
logs.setGlobalLoggerProvider(loggerProvider);

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.json(),
});

export const slog = logger;
