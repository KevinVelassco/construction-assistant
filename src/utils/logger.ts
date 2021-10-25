import { createLogger, transports, format } from 'winston';
const { timestamp, combine, printf, errors, colorize, json } = format;

const buildDevLogger = () => {
  const logFormat = printf(
    ({ timestamp, level, message, stack }) =>
      `[${timestamp}] [${level}]: ${stack || message}`
  );

  return createLogger({
    format: combine(
      colorize(),
      timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      errors({ stack: true }),
      logFormat
    ),
    transports: [new transports.Console()]
  });
};

const buildProdLogger = () => {
  return createLogger({
    format: combine(timestamp(), errors({ stack: true }), json()),
    transports: [new transports.Console()]
  });
};

const enviroment = process.env.NODE_ENV || 'local';

export const logger =
  enviroment === 'local' ? buildDevLogger() : buildProdLogger();
