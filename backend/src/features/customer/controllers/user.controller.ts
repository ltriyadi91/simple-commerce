import { NextFunction, Request, Response } from 'express';

import { UserService } from '../services/user.service';
import { LoginInputTypes, RegisterInputTypes } from '../types/user.types';
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
      const loginInputObj: LoginInputTypes = req.body; // Map request body to Obj
      const result = await this.userService.login(loginInputObj);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
  
      if (userId) {
        const result = await this.userService.getProfile(parseInt(userId, 10));
        res.status(result.success ? 200 : 404).json(result);
      }
    } catch (error) {
      next(error);
    }
  };
}
