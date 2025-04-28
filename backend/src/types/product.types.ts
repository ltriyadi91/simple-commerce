import { ProductSchema } from "@/features/merchant/schemas/product.schema";
import z from "zod";

export interface ProductsPaginationQueryTypes {
  title: string | undefined;
  minPrice: string;
  maxPrice: string;
  sort: string;
  order: string;
  page: string;
  limit: string;
}

export interface ProductsFilterTypes {
  title?: string | undefined;
  price?: {
    gte?: number;
    lte?: number;
  };
}

export type ProductInputType = z.infer<typeof ProductSchema>;