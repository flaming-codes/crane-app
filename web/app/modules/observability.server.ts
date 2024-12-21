import { createLogger, format, transports } from "winston";

export const slog = createLogger({
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, label, level, message }) => {
      return `${timestamp} ${label} ${level}: ${message}`;
    }),
  ),
});

if (process.env.NODE_ENV === "production") {
  slog.add(new transports.Console({ format: format.json() }));
} else if (process.env.NODE_ENV === "test") {
  slog.add(new transports.Console({ format: format.errors() }));
} else {
  slog.add(new transports.Console({ format: format.simple() }));
}
