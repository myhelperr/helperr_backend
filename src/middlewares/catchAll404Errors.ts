import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

export default (req: Request, _: Response, next: NextFunction) => {
    return next(createError(404, `Can't ${req.method} '${req.url}'`));
}