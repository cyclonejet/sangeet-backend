import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import createError from 'http-errors';

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        params: req.params,
        query: req.query,
        body: req.body,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(createError(400, error.errors[0].message));
      }

      next(error);
    }
  };
