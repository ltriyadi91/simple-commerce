import { NextFunction, Request, Response } from 'express';

import { UserService } from '../services/user.service';
import { LoginInputTypes } from '../types/user.types';
import UserRequest from '@/types/express';
import { ERROR, SUCCESS } from '@/constants/messages';
import { unifiedResponse } from 'uni-response';
import { env } from '@/config/env-config';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  login = async (
    req: Request<{}, {}, LoginInputTypes>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const loginInputObj: LoginInputTypes = req.body;
      const result = await this.userService.login(loginInputObj);
      const token = (result?.data as { token: string })?.token;

      if (!token) {
        res.status(401).json(unifiedResponse(false, ERROR.INVALID_USER_DATA));
        return;
      }

      res
        .status(200)
        .cookie('token', token, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          secure: env.NODE_ENV === 'production',
        })
        .json(result);

    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  getProfile = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(404).json(unifiedResponse(false, ERROR.USER_NOT_FOUND));
        return;
      }
      res.status(200).json(
        unifiedResponse(true, SUCCESS.USER_FOUND, {
          user: req.user,
          token: req.cookies.jwt,
        }),
      );
    } catch (error) {
      console.error('cuuuk', { error });
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res
        .clearCookie('token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        })
        .status(200)
        .json(unifiedResponse(true, SUCCESS.LOGOUT_SUCCESSFUL));
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}
