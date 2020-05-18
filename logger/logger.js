import winston, { format, transports } from "winston";

const customFormat = format.printf((info) => {
  return `${info.level} ${info.service} - ${info.message}\n`;
});

export function createLogger(file = "", level = "info") {
  const filePath = file.split("/");
  const moduleName = filePath[filePath.length - 1];
  const logger = winston.createLogger({
    level: level,
    format: format.json(),
    defaultMeta: { service: moduleName },
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log`
      // - Write all logs error (and below) to `error.log`.
      //
      new transports.File({ filename: "error.log", level: "error" }),
      new transports.File({ filename: "combined.log" }),
    ],
  });

  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  if (process.env.NODE_ENV !== "production") {
    logger.add(
      new transports.Console({
        format: format.combine(
          format((info) => {
            info.level = `[${info.level.toUpperCase()}]`;
            return info;
          })(),
          format.colorize({ all: true }),
          customFormat
        ),
      })
    );
  }

  return logger;
}
