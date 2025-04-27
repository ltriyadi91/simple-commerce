import { unifiedResponse } from 'uni-response';
import { CartRepository } from '../repositories/cart.repository';
import { calculateDiscountedAmount } from '@/util/discount.util';

export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  async addToCart(userId: number, productId: number, quantity: number) {
    const product = await this.cartRepository.findProductById(productId);
    if (!product) throw new Error('Product not found');

    let cart = await this.cartRepository.findUserCart(userId);
    if (!cart) {
      cart = await this.cartRepository.createUserCart(userId);
    }

    const existingItem = await this.cartRepository.findCartItemByCartIdAndProductId(cart.id, productId);
    if (existingItem) {
      const updatedItem = await this.cartRepository.updateCartItemQuantity(
        existingItem.id,
        existingItem.quantity + quantity,
      );
      return unifiedResponse(true, 'Item added to cart', updatedItem);
    } else {
      const newItem = await this.cartRepository.createCartItem({
        cartId: cart.id,
        productId,
        quantity,
        price: product.price,
      });
      return unifiedResponse(true, 'Item added to cart', newItem);
    }
  }

  async getCart(userId: number) {
    const cart = await this.cartRepository.findUserCart(userId);
    if (!cart || cart.items.length === 0) {
      return unifiedResponse(false, 'Cart is empty', { items: [] })
    }

    const priceData = await calculateDiscountedAmount(cart);
    return unifiedResponse(true, 'Cart found', {
      totalAmount: priceData.totalAmount,
      finalAmount: priceData.finalAmount,
      productDiscountAmount: priceData.productDiscountAmount,
      ...cart
    });
  }

  async removeCartItem(itemId: number) {
    const item = await this.cartRepository.findCartItemById(itemId);
    if (!item) throw new Error('Cart item not found');

    await this.cartRepository.deleteCartItem(itemId);
    return unifiedResponse(true, 'Cart item removed', item);
  }

  async updateCartItem(itemId: number, quantity: number) {
    const item = await this.cartRepository.findCartItemById(itemId);
    if (!item) throw new Error('Cart item not found');

    const updatedItem = await this.cartRepository.updateCartItemQuantity(itemId, quantity);
    return unifiedResponse(true, 'Cart item updated', updatedItem);
  }

  async clearCart(userId: number) {
    const cart = await this.cartRepository.findUserCart(userId);
    if (!cart) throw new Error('Cart not found');

    const deletedCart = await this.cartRepository.clearCartItem(cart.id);
    return unifiedResponse(true, 'Cart cleared', deletedCart);
  }
}
