import { OrderStatus } from "@prisma/client";
import { MerchantOrderRepository } from "../repositories/order.repository";
import { unifiedResponse } from "uni-response";

export class MerchantOrderService {
  constructor(private orderRepository: MerchantOrderRepository) {}

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

    const result = {
      data: orders,
      pagination: {
        total: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        page: pageNumber,
        limit: pageSize,
      },
    };

    return unifiedResponse(true, "Orders fetched successfully", result);
  }

  async getOrderById(id: number) {
    const order = await this.orderRepository.getOrderById(id);
    if (!order) {
      return unifiedResponse(false, "Order not found", null);
    }
    return unifiedResponse(true, "Order fetched successfully", order);
  }

  async updateOrderStatus(id: number, status: OrderStatus) {
    const order = await this.orderRepository.getOrderById(id);
    if (!order) {
      return unifiedResponse(false, "Order not found", null);
    }
    const updatedOrder = await this.orderRepository.updateOrderStatus(id, status);
    return unifiedResponse(true, "Order status updated successfully", updatedOrder);
  }
}