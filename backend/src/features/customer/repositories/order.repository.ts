import { PrismaClient } from '@prisma/client';

export class OrderRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createOrder(userId: number, totalAmount: number, finalAmount: number, items: any[]) {
    return await this.prisma.order.create({
      data: {
        userId,
        totalAmount,
        finalAmount,
        items: {
          create: items,
        },
      },
    });
  }

  async getOrdersByUserId(userId: number) {
    return await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                title: true,
                price: true,
                images: true,
              }
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getOrderByIdAndUserId(id: number, userId: number) {
    return await this.prisma.order.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                title: true,
                price: true,
                images: true,
              }
            },
          },
        },
      },
    });
  }

  async updateProductQuantity(productId: number, quantity: number) {
    return await this.prisma.product.update({
      where: { id: productId },
      data: {
        quantity: { decrement: quantity },
      },
    });
  }

  async deleteCartByUserId(userId: number) {
    return await this.prisma.cart.deleteMany({
      where: { userId },
    });
  }
}
