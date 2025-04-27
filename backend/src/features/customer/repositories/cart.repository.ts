import { PrismaClient } from '@prisma/client/extension';

export class CartRepository {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async findUserCart(userId: number) {
    return await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
  }

  async createUserCart(userId: number) {
    return await this.prisma.cart.create({
      data: { userId },
    });
  }

  async findProductById(productId: number) {
    return await this.prisma.product.findUnique({
      where: { id: productId },
    });
  }

  async findCartItemByCartIdAndProductId(cartId: number, productId: number) {
    return await this.prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
      },
    });
  }

  async findCartItemById(id: number) {
    return await this.prisma.cartItem.findFirst({
      where: {
        id,
      },
    });
  }

  async updateCartItemQuantity(itemId: number, quantity: number) {
    return await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      select: {
        id: true,
        quantity: true,
        product: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
    });
  }

  async createCartItem({
    cartId,
    productId,
    quantity,
    price,
  }: {
    cartId: number;
    productId: number;
    quantity: number;
    price: number;
  }) {
    return await this.prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
        price,
      },
    });
  }

  async deleteCartItem(itemId: number) {
    return await this.prisma.cartItem.delete({
      where: { id: itemId },
      select: {
        id: true,
        product: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
    });
  }

  async clearCartItem(cartId: number) {
    return await this.prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
}
