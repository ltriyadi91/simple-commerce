import { Request, Response } from 'express';
import UserRequest from '../../../types/express';
import { CartService } from '../services/cart.service';
import { unifiedResponse } from 'uni-response';

export class CartController {
  constructor(private readonly cartService: CartService) {}

  addToCart = async (req: UserRequest, res: Response): Promise<void> => {
    const { productId, quantity } = req.body;
    try {
      if (!req.user) {
        res.status(401).json(unifiedResponse(false, 'User not found'));
        return;
      }
      const userId = req.user.id;
      const newItem = await this.cartService.addToCart(userId, productId, quantity);
      res.status(200).json(newItem);
    } catch (err) {
      res.status(500).json({ message: 'Server error', err });
    }
  };

  getCart = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      const userId = req.user.id;
      const cartData = await this.cartService.getCart(userId);

      res.status(200).json(cartData);
    } catch (err) {
      res.status(500).json({ message: 'Server error', err });
    }
  };

  updateCartItem = async (req: Request, res: Response): Promise<void> => {
    const { itemId } = req.params;
    const { quantity } = req.body;
    try {
      const updatedItem = await this.cartService.updateCartItem(parseInt(itemId), quantity);
      res.status(200).json(updatedItem);
    } catch (err) {
      console.log({ err })
      res.status(500).json({ message: 'Server error', err });
    }
  };

  removeCartItem = async (req: Request, res: Response): Promise<void> => {
    const { itemId } = req.params;
    try {
      const result = await this.cartService.removeCartItem(parseInt(itemId));
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: 'Server error', err });
    }
  };

  clearCart = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      const userId = req.user.id;

      const result = await this.cartService.clearCart(userId);
      res.status(200).json(result);
    } catch (err) {
      console.log({ err })
      res.status(500).json({ message: 'Server error', err });
    }
  };
}
