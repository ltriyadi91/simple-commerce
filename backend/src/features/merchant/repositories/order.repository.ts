import { OrderStatus, PrismaClient } from '@prisma/client';

export class MerchantOrderRepository {
  private prisma: PrismaClient;
  
  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;   
  }

  async getAllOrders(filters: any, sort: string, order: string, skip: number, take: number) {
    return this.prisma.order.findMany({
      where: filters,
      orderBy: { [sort]: order === 'desc' ? 'desc' : 'asc' },
      skip,
      take,
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
        items: { include: { product: true } },
      },
    });
  }

  async getOrderById(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: { include: { product: true } },
      },
    });
  }

  async updateOrderStatus(id: number, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  async countOrders(filters: any) {
    return this.prisma.order.count({ where: filters });
  }
}
