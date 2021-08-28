import { NextFunction, Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { DtoType } from '../config/keys.config';

export const dtoValidation = (dto: any, dtoType: DtoType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const valueByType = {
      [DtoType.Body]: req.body,
      [DtoType.Params]: req.params,
      [DtoType.Query]: req.query
    };

    const payload = valueByType[dtoType];

    const dtoObj = plainToClass(dto, payload, {
      excludeExtraneousValues: true
    });

    const errors = await validate(dtoObj, {
      validationError: { target: false, value: false }
    });

    if (errors.length > 0) return res.status(400).json(errors);

    req[dtoType] = dtoObj;

    next();
  };
};
