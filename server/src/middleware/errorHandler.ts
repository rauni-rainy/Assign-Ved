import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ZodError') {
    statusCode = 400;
    try {
      const parsedErrors = JSON.parse(err.message);
      message = parsedErrors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
    } catch {
      message = 'Validation Error';
    }
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    code: statusCode,
  });
};
