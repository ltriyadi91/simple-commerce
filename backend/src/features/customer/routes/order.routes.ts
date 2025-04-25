import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { OrderRepository } from '../repositories/order.repository';
import { OrderService } from '../services/order.service';
import { auth } from '@/middleware/auth.middleware';
import { PrismaService } from '@/config/prisma.config';
import { CartRepository } from '../repositories/cart.repository';

const prismaService = PrismaService.getInstance();
const prisma = prismaService.client;
const cartRepository = new CartRepository(prisma);
const orderRepository = new OrderRepository(prisma);

const orderService = new OrderService(orderRepository, cartRepository);
const orderController = new OrderController(orderService);

const router = Router();
router.use(auth);

// Place order
router.post('/', auth, orderController.placeOrder);

// Getting all orders of logged in customer
router.get('/', auth, orderController.getOrders);

// Getting an order of customer by id
router.get('/:id', auth, orderController.getOrderById);

export default router;
