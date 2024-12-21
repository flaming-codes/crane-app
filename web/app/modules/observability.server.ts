/* eslint-disable no-console */

const PREFIX = "[SERVER]";

const slog = {
  log: (...message: unknown[]) => {
    console.log(PREFIX, ...message);
  },
  warn: (...message: unknown[]) => {
    console.warn(PREFIX, ...message);
  },
  info: (...message: unknown[]) => {
    console.info(PREFIX, ...message);
  },
  error: (...message: unknown[]) => {
    console.error(PREFIX, ...message);
  },
  debug: (...message: unknown[]) => {
    console.debug(PREFIX, ...message);
  },
};

export { slog };
