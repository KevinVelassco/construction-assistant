import { NextFunction, Request, Response } from "express";
import { HttpException } from "../common/http-exception";

export const errorHandling = (err: HttpException, req: Request, res: Response, next: NextFunction) => {
    const {status = 500, message = 'Internal Server Error'} = err;
    return res.status(status).json({
        success: false,
        message
    });
}