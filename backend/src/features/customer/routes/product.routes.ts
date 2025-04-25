import { Router } from 'express';
import { PrismaService } from '@/config/prisma.config';
import { ProductRepository } from '../repositories/product.repository';
import { ProductService } from '../services/product.service';
import { ProductController } from '../controllers/product.controller';

const prismaService = PrismaService.getInstance();
const prisma = prismaService.client;
const productRepository = new ProductRepository(prisma);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const router = Router();

router.get('/', productController.findAllProducts);
router.get('/:id', productController.findProductById);

export default router;
