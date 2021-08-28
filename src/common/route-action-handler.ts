import { NextFunction, Request, Response } from 'express';

export const routeActionHandler = (action: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = action(req, res, next);

    if (result instanceof Promise) {
      result.then(result => res.json(result)).catch(next);
    } else {
      res.json(result);
    }
  };
};
