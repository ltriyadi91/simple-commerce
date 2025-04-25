import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export const calculateDiscountedPrice = (price: number, discount: number | null) => {
  if (!discount || discount <= 0) return price;
  return price - (price * discount) / 100;
};

export const calculateDiscountedAmount = async (cart: any) => {
  let totalAmount = 0;
  let finalAmount = 0;
  let productDiscountAmount = 0;

  for (const item of cart.items) {
    totalAmount += item.quantity * item.product.price;

    item.product.isDiscounted
      ? (productDiscountAmount +=
          (item.quantity * item.product.price * (item.product.discount || 0)) / 100)
      : (productDiscountAmount = 0);

    // final amount with product discount
    finalAmount = totalAmount - productDiscountAmount;
  }

  return {
    totalAmount,
    finalAmount,
    productDiscountAmount
  };
};
