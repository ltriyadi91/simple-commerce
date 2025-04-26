import { Router } from 'express';
import { PrismaService } from '@/config/prisma.config';
import { CartRepository } from '../repositories/cart.repository';
import { CartService } from '../services/cart.service';
import { CartController } from '../controllers/cart.controller';
import { validateRequest } from '@/middleware/validation.middleware';
import { createCartSchema, updateCartSchema } from '../schemas/cart.schema';
import { auth, authorizedRoles } from '@/middleware/auth.middleware';

const prismaService = PrismaService.getInstance();
const prisma = prismaService.client;
const cartRepository = new CartRepository(prisma);
const cartService = new CartService(cartRepository);
const cartController = new CartController(cartService);

const router = Router();
router.use(auth);
router.use(authorizedRoles('CUSTOMER'));

router.post('/add', validateRequest(createCartSchema), cartController.addToCart);

router.get('/', cartController.getCart);
router.put('/update/:itemId', validateRequest(updateCartSchema), cartController.updateCartItem);

router.delete('/remove/:itemId', cartController.removeCartItem);
router.delete('/clear', cartController.clearCart);

export default router;
