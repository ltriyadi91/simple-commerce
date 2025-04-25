import bcrypt from 'bcrypt';
import { unifiedResponse } from 'uni-response';

import { ERROR, SUCCESS } from '../../../constants/messages';
import { generateToken } from '../../../util/token.util';
import { UserRepository } from '../repositories/user.repository';
import { LoginInputTypes, RegisterInputTypes } from '../types/user.types';
import { Role } from '@prisma/client';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(loginInputObj: LoginInputTypes) {
    const { email, password } = loginInputObj;
    const user = await this.userRepository.findCustomerUserByEmail(email);

    if (!user) {
      return unifiedResponse(false, ERROR.USER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      return unifiedResponse(false, 'Invalid credentials');
    }

    const token = generateToken(user.id, Role.CUSTOMER || 'user');
    return unifiedResponse(true, SUCCESS.LOGIN_SUCCESSFUL, { token });
  }

  async register(registerInputObj: RegisterInputTypes) {
    const { email, password, name } = registerInputObj;

    const existingUser = await this.userRepository.findCustomerUserByEmail(email);
    if (existingUser) {
      return unifiedResponse(false, ERROR.USER_EXISTS_WITH_EMAIL);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userRepository.createUser({
      email,
      password: hashedPassword,
      name,
      role: Role.CUSTOMER,
    });

    const token = generateToken(newUser.id, Role.ADMIN || 'user');
    return unifiedResponse(true, SUCCESS.REGISTRATION_SUCCESSFUL, { token });
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      return unifiedResponse(false, ERROR.USER_NOT_FOUND);
    }
    return unifiedResponse(true, SUCCESS.USER_FOUND, user);
  }
}
