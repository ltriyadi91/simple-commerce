import { calculateDiscountedAmount } from '@/util/discount.util';
import { OrderRepository } from '../repositories/order.repository';
import { CartRepository } from '../repositories/cart.repository';
import { unifiedResponse } from 'uni-response';

export class OrderService {
  private orderRepository: OrderRepository;
  private cartRepository: CartRepository;

  constructor(orderRepository: OrderRepository, cartRepository: CartRepository) {
    this.orderRepository = orderRepository;
    this.cartRepository = cartRepository;
  }

  async placeOrder(userId: number) {
    const cart = await this.cartRepository.findUserCart(userId);

    if (!cart) {
      throw new Error('Cart is empty');
    }

    const orderItems = [];
    for (const item of cart.items) {
      if (item.product.quantity < item.quantity) {
        throw new Error(`Not enough stock for ${item.product.title}`);
      }
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      });
    }

    const priceData = await calculateDiscountedAmount(cart);
    const order = await this.orderRepository.createOrder(
      userId,
      priceData.totalAmount,
      priceData.finalAmount,
      orderItems,
    );

    // Update stock and clear cart
    for (const item of cart.items) {
      await this.orderRepository.updateProductQuantity(item.productId, item.quantity);
    }

    // Clear cart and cart items
    await this.cartRepository.clearCartItem(userId);
    await this.orderRepository.deleteCartByUserId(userId);

    return unifiedResponse(true, 'Order placed successfully', order);
  }

  async getOrders(userId: number) {
    const orders = await this.orderRepository.getOrdersByUserId(userId);
    return unifiedResponse(true, 'Orders fetched successfully', orders);
  }

  async getOrder(orderId: number, userId: number) {
    const order = await this.orderRepository.getOrderByIdAndUserId(orderId, userId);
    return unifiedResponse(true, 'Order fetched successfully', order);
  }
}
