import { createLogger, format, transports } from "winston";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";

const otlpLogExporter = new OTLPLogExporter({
  url: process.env.OTEL_LOG_URL,
});

export const slog = createLogger({
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, label, level, message }) => {
      return `${timestamp} ${label} ${level}: ${message}`;
    }),
  ),
  transports: [
    new transports.Console({
      format: process.env.NODE_ENV === "production" ? format.json() : format.simple(),
    }),
    otlpLogExporter,
  ],
});
