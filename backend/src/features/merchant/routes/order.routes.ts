import { Router } from "express";
import { auth, authorizedRoles } from "@/middleware/auth.middleware";

import { PrismaService } from "@/config/prisma.config";

import { MerchantOrderController } from "../controllers/order.controller";
import { MerchantOrderService } from "../services/order.service";
import { MerchantOrderRepository } from "../repositories/order.repository";

const prismaService = PrismaService.getInstance();
const prisma = prismaService.client;

const orderRepository = new MerchantOrderRepository(prisma);
const orderService = new MerchantOrderService(orderRepository);
const orderController = new  MerchantOrderController(orderService);

const router = Router();
router.use(auth);
router.use(authorizedRoles("ADMIN"));

router.get("/", auth, authorizedRoles("ADMIN"), orderController.getAllOrders);
router.get("/:id", auth, authorizedRoles("ADMIN"), orderController.updateOrderStatus);

export default router;
