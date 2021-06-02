import winston from "winston";
import customizeLevels from "./customizeLogger";
import dotenv from "dotenv";
dotenv.config();

const loggerwithColor = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    return `${info.timestamp } ${info.level }: ${ info.message}`;
  })
);
const loggerNonColor = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.printf((info) => {
    return `${info.timestamp } ${info.level }: ${ info.message}`;
  })
)
const level = () => {
  const env = process.env.NODE_ENV || 'DEV';
  const isDevelopment = env === 'DEV';
  return isDevelopment ? 'debug' : 'warn';
};
const transports = [
  new winston.transports.Console({
    format: loggerwithColor,
  }),
  new winston.transports.File({
    filename: "error.log",
    level: 'error',
    format: loggerNonColor,
  }),
  new winston.transports.File({
    filename: 'allLog.log',
    level: 'info',
    format: loggerNonColor,
  }),
];
const logger = winston.createLogger({
  level: level(),
  levels:customizeLevels.levels,
  format: winston.format.json(),
  transports,
});
 export default logger;
