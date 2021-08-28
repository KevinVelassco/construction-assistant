import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../common/http-exception';

export const notfound404 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  throw new HttpException(404, 'Not Found');
};
