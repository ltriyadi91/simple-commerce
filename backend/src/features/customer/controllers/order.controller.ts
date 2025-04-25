import { Response } from 'express';
import UserRequest from '../../../types/express';
import { OrderService } from '../services/order.service';

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  placeOrder = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      const order = await this.orderService.placeOrder(req.user.id);
      res.status(201).json(order);
    } catch (err) {
      console.error(err); // TODO: log t
      res.status(500).json({ message: 'Server error', err });
    }
  };

  getOrders = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      const orders = await this.orderService.getOrders(req.user.id);
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json({ message: 'Server error', err });
    }
  };

  getOrderById = async (req: UserRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      if (!req.user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      const order = await this.orderService.getOrder(parseInt(id), req.user.id);
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      res.status(200).json(order);
    } catch (err) {
      res.status(500).json({ message: 'Server error', err });
    }
  };
}
