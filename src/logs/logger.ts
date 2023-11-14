const winston = require("winston"); // or you can use imports

// Create a logger with two transports: one for console output, and one for file output
// export logger to use it all around the app as a single place for all logging operations
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    // new winston.transports.Console(),
    new winston.transports.File({
      filename: "src/logs/error.log",
      level: "error",
    }),
  ],
});

export default logger;
