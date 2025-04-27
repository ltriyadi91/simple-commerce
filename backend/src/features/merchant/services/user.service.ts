import bcrypt from 'bcrypt';
import { unifiedResponse } from 'uni-response';

import { ERROR, SUCCESS } from '../../../constants/messages';
import { generateToken } from '../../../util/token.util';
import { UserRepository } from '../repositories/user.repository';
import { LoginInputTypes } from '../types/user.types';
import { Role } from '@prisma/client';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async login(loginInputObj: LoginInputTypes) {
    const { email, password } = loginInputObj;
    const user = await this.userRepository.findMerchantUserByEmail(email);

    if (!user) {
      return unifiedResponse(false, ERROR.USER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      return unifiedResponse(false, 'Invalid credentials');
    }

    const token = generateToken(user.id, Role.ADMIN || 'user');
    return unifiedResponse(true, SUCCESS.LOGIN_SUCCESSFUL, { token });
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findMerchantUserById(userId);
    if (!user) {
      return unifiedResponse(false, ERROR.USER_NOT_FOUND);
    }
    return unifiedResponse(true, SUCCESS.USER_FOUND, user);
  }
}
