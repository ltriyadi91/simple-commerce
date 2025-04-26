import { Request, Response } from 'express';
import { MerchantOrderService } from '../../merchant/services/order.service';

export class MerchantOrderController {
  private orderService: MerchantOrderService;

  constructor(orderService: MerchantOrderService) {
    this.orderService = orderService;
  }

  getAllOrders =async (req: Request, res: Response) => {
    try {
      const result = await this.orderService.getAllOrders(req.query);
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Server error', err });
    }
  }

  getOrderById =async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const order = await this.orderService.getOrderById(parseInt(id));
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      res.status(200).json(order);
    } catch (err) {
      res.status(500).json({ message: 'Server error', err });
    }
  }

  updateOrderStatus =async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await this.orderService.updateOrderStatus(parseInt(id), status);
      res.status(200).json(order);
    } catch (err) {
      res.status(500).json({ message: 'Server error', err });
    }
  }
}
