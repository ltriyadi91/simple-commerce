import { PrismaClient } from '@prisma/client';
import { ProductsFilterTypes } from '../types/product.types';

export class ProductRepository {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async findAllProducts(
    filters: ProductsFilterTypes,
    sort: string,
    order: string,
    skip: number,
    take: number,
  ) {
    return await this.prisma.product.findMany({
      where: filters,
      orderBy: {
        [sort]: order === 'desc' ? 'desc' : 'asc',
      },
      skip,
      take,
      select: {
        title: true,
        price: true,
        discount: true,
        quantity: true,
        description: true,
        images: true
      }
    });
  }

  async getProductCount(filters: ProductsFilterTypes) {
    return await this.prisma.product.count({ where: filters });
  }

  async findProductById(productId: number) {
    return await this.prisma.product.findUnique({
      where: { id: productId },
      select: {
        title: true,
        price: true,
        discount: true,
        quantity: true,
        description: true,
        images: true
      }
    });
  }
}
