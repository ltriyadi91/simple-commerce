import { Prisma } from '@prisma/client';
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { unifiedResponse } from 'uni-response';

import { env } from '../config/env-config';
import { ERROR } from '../constants/messages';

const environment = env.NODE_ENV || 'prod';

// Middleware to check host whitelist
const apiErrorHandler = (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (environment === 'development') {
    console.log('err', err);
  }
  if (
    err instanceof SyntaxError &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (err as any).status === 400 &&
    'body' in err
  ) {
    // Handle JSON syntax error
    res.status(400).json(unifiedResponse(false, 'Invalid JSON'));
    return;
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle Prisma validation errors
    if (err.meta) {
      const firstKey = Object.keys(err?.meta)[0];
      const cause = err?.meta[firstKey] as string;
      res.status(400).json(unifiedResponse(false, `Provided field id not found, ${cause}`));
      return;
    }
  }
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    res.status(400).json(unifiedResponse(false, err?.message));
    return;
  }
  if (err instanceof Prisma.PrismaClientRustPanicError) {
    res.status(400).json(unifiedResponse(false, err?.message));
    return;
  }
  if (err instanceof Prisma.PrismaClientRustPanicError) {
    res.status(400).json(unifiedResponse(false, err?.message));
    return;
  }
  if (err instanceof Prisma.PrismaClientInitializationError) {
    res.status(400).json(unifiedResponse(false, err?.message));
    return;
  }
  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json(unifiedResponse(false, err?.message));
    return;
  }
  // Handle other errors
  res.status(500).json(unifiedResponse(false, ERROR.INTERNAL_SERVER_ERROR));
  return;
};

const unmatchedRoutes = (req: Request, res: Response): void => {
  res.status(404).json(unifiedResponse(false, ERROR.ROUTE_NOT_FOUND));
  return;
};

export { apiErrorHandler, unmatchedRoutes };
