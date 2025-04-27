import { Router } from 'express';

import { PrismaService } from '@/config/prisma.config';
import { auth, authorizedRoles } from '@/middleware/auth.middleware';
import { validateRequest } from '@/middleware/validation.middleware';
import { ProductSchema } from '../schemas/product.schema';

import { ProductRepository } from '../repositories/product.repository';
import { ImageRepository } from '../../common/repositories/image.repository';

import { ProductService } from '../services/product.service';

import { MerchantProductController } from '../controllers/product.controller';

const prismaService = PrismaService.getInstance();
const prisma = prismaService.client;
const imageRepository = new ImageRepository(prisma);
const productRepository = new ProductRepository(prisma);
const productService = new ProductService(productRepository, imageRepository);
const productController = new MerchantProductController(productService);

const router = Router();
router.use(auth);
router.use(authorizedRoles("ADMIN"));

router.get('/', productController.findAllProducts);
router.post(
  "/",
  validateRequest(ProductSchema),
  productController.createProduct
);
router.get('/:id', productController.findProductById);
router.put(
  "/:id",
  validateRequest(ProductSchema),
  productController.updateProduct
);
router.delete("/:id", productController.deleteProduct);

export default router;
