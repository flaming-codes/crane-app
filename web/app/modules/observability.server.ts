import { Logger } from "@remix-pwa/sw";

const slog = new Logger({
  prefix: "[SERVER]",
});

export { slog };
