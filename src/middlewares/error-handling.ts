import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../common/http-exception';
import { logger } from '../utils/logger';

export const errorHandling = (
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status = 500, message = 'Internal Server Error', stack } = err;

  logger.error(
    `[${req.method}] - [${req.originalUrl}] - [${status}] - [${req.ip}] - ${
      stack || message
    }`
  );

  return res.status(status).json({
    success: false,
    message
  });
};
