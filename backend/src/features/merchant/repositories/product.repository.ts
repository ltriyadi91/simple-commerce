import { ProductsFilterTypes } from '@/types/product.types';
import { PrismaClient } from '@prisma/client';

export class ProductRepository {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async getProductCount(filters: ProductsFilterTypes) {
    return await this.prisma.product.count({ where: filters });
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
        images: {
          select: {
            url: true,
            id: true,
          }
        },
        sku: true,
        id: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async create(data: any) {
    console.log('cuuuk', {data});
    return await this.prisma.product.create({
      data: {
        ...data,
        images: data.images?.length ? {
          create: data.images.map((image: string) => ({ url: image }))
        } : undefined
      },
      select: { id: true }
    });
  }

  async update(id: number, data: any) {
    return await this.prisma.product.update({
      where: { id },
      data,
      select: { id: true },
    });
  }

  async delete(id: number) {
    return await this.prisma.product.delete({
      where: { id },
    });
  }

  async findById(id: number) {
    return await this.prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        price: true,
        discount: true,
        quantity: true,
        description: true,
        images: {
          select: {
            url: true,
            id: true,
          }
        },
        sku: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
