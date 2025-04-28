import { PrismaClient } from '@prisma/client';
import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { unifiedResponse } from 'uni-response';
import { env } from '../config/env-config';
import { ERROR } from '../constants/messages';
import UserRequest from '../../../backend/src/types/express';

const prisma = new PrismaClient();

export const auth = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json(unifiedResponse(false, ERROR.NO_TOKEN_PROVIDED));
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    req.user = user;
    next();
  } catch (err) {
    console.log({ err });
    res.status(401).json(unifiedResponse(false, ERROR.NOT_AUTHORIZED));
    return;
  }
};

export const authorizedRoles = (...roles: string[]) => {
  return (req: UserRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json(unifiedResponse(false, ERROR.NOT_AUTHENTICATED));
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json(unifiedResponse(false, ERROR.ACCESS_DENIED));
      return;
    }

    next();
  };
};
