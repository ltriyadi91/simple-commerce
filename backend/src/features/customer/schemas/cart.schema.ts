import { z } from "zod";

export const createCartSchema = z.object({
  productId: z.number().int().positive("ProductId should be positive integer"),
  quantity: z.number().int().positive("Qty should be positive integer"),
});

export const updateCartSchema = z.object({
  quantity: z.number().int().positive("Qty should be positive integer"),
});
