export const logger = {
  enabled: false,
  log: (...args: any[]) => {
    if (logger.enabled) {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    if (logger.enabled) {
      console.error(...args);
    }
  },
  warn: (...args: any[]) => {
    if (logger.enabled) {
      console.warn(...args);
    }
  },
};
