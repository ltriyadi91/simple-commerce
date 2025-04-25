import { NextFunction, Request, Response } from 'express';

import { UserService } from '../services/user.service';
import { LoginInputTypes } from '../types/user.types';
import UserRequest from '@/types/express';
import { ERROR, SUCCESS } from '@/constants/messages';
import { unifiedResponse } from 'uni-response';

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
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(404).json(unifiedResponse(false, ERROR.USER_NOT_FOUND ));
        return;
      }
      res.status(200).json(unifiedResponse(true, SUCCESS.USER_FOUND,  req.user));
    } catch (error) {
      next(error);
    }
  };
}
