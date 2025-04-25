import { Router } from 'express';

import { PrismaService } from '@/config/prisma.config';
import { auth, authorizedRoles } from '@/middleware/auth.middleware';
import { validateRequest } from '@/middleware/validation.middleware';

import { ProductRepository } from '../repositories/product.repository';
import { ProductService } from '../services/product.service';
import { MerchantProductController } from '../controllers/product.controller';
import { productSchema } from '../schemas/product.schema';

const prismaService = PrismaService.getInstance();
const prisma = prismaService.client; // Get the PrismaClient instance
const productRepository = new ProductRepository(prisma);
const productService = new ProductService(productRepository);
const productController = new MerchantProductController(productService);

const router = Router();
router.use(auth);
router.use(authorizedRoles("ADMIN"));

router.get('/', productController.findAllProducts);

router.post(
  "/",
  auth,
  validateRequest(productSchema),
  productController.createProduct
);

router.put(
  "/:id",
  auth,
  validateRequest(productSchema),
  productController.updateProduct
);
router.delete("/:id", auth, productController.deleteProduct);

export default router;
