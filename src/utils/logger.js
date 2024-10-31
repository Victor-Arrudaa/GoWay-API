const logger = {
  info: (...args) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(...args);
    }
  },
  error: (...args) => {
    if (process.env.NODE_ENV !== 'test') {
      console.error(...args);
    }
  },
  warn: (...args) => {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(...args);
    }
  }
};

export default logger;