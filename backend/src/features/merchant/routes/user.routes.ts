import { Router } from 'express';

import { PrismaService } from '@/config/prisma.config';
import { auth } from '@/middleware/auth.middleware';
import { validateRequest } from '@/middleware/validation.middleware';

import { UserController } from '../controllers/user.controller';
import { UserRepository } from '../repositories/user.repository';
import { loginSchema } from '../schemas/user.schema';
import { UserService } from '../services/user.service';

const prismaService = PrismaService.getInstance();
const prisma = prismaService.client;
const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const router = Router();

router.post('/login', validateRequest(loginSchema), userController.login);
router.get('/profile', auth, userController.getProfile);

export default router;
