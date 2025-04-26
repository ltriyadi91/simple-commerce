import { OrderStatus } from "@prisma/client";
import { MerchantOrderRepository } from "../repositories/order.repository";

export class MerchantOrderService {
  constructor(private readonly orderRepository: MerchantOrderRepository) {}

  async getAllOrders(query: any) {
    const { userId, status, sort = "createdAt", order = "desc", page = "1", limit = "10" } = query;

    const pageNumber = parseInt(page as string);
    const pageSize = parseInt(limit as string);
    const skip = (pageNumber - 1) * pageSize;

    const filters: any = {};
    if (userId) filters.userId = parseInt(userId as string);
    if (status) filters.status = status;

    const [orders, totalCount] = await Promise.all([
      this.orderRepository.getAllOrders(filters, sort, order, skip, pageSize),
      this.orderRepository.countOrders(filters),
    ]);

    return {
      data: orders,
      pagination: {
        total: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        page: pageNumber,
        limit: pageSize,
      },
    };
  }

  async getOrderById(id: number) {
    return this.orderRepository.getOrderById(id);
  }

  async updateOrderStatus(id: number, status: OrderStatus) {
    return this.orderRepository.updateOrderStatus(id, status);
  }
}