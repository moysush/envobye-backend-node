import { Request, Response, NextFunction } from 'express';

export const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // passes it to global error handler
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};