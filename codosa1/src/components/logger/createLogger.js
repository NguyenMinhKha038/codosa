import winston from "winston";
import customizeLevels from "./customizeLogger";
winston.addColors(customizeLevels.colors);
// const logger = winston.createLogger({
//   level: "info",
//   format: winston.format.json(),
//   defaultMeta: { service: "user-service" },
//   colorize: true,
//   transports: [
//     //
//     // - Write all logs with level `error` and below to `error.log`
//     // - Write all logs with level `info` and below to `combined.log`
//     //
//     new winston.transports.File({ filename: "error.log", level: "error" }),
//     new winston.transports.File({ filename: "combined.log" }),
//   ],
// });
const loggerwithColor = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
  })
);
const loggerNonColor = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
  })
)
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};
const transports = [
  new winston.transports.Console({
    format: loggerwithColor,
  }),
  new winston.transports.File({
    filename: './error.log',
    level: 'error',
    format: loggerNonColor,
  }),
  new winston.transports.File({
    filename: './allLog.log',
    format: loggerwithColor,
  }),
];

const logger = winston.createLogger({
  level: level(),
  levels:customizeLevels.levels,
  transports,
});
export default logger;
