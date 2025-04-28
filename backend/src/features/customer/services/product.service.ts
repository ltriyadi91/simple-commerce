import { ProductRepository } from '../repositories/product.repository';
import { calculateDiscountedPrice } from '@/util/discount.util';
import { ProductsPaginationQueryTypes, ProductsFilterTypes } from '@/types/product.types';
import { unifiedResponse } from 'uni-response';
import { ERROR, SUCCESS } from '@/constants/messages';
import { env } from '@/config/env-config';

const productItemFormater = (product: any) => {
  return {
    ...product,
    finalPrice: calculateDiscountedPrice(product.price, product.discount),
    images: product.images.map((image: { url: string, id: number }) => ({
      ...image,
      url: `${env.AWS_S3_ENDPOINT}${image.url}`,
    })),
  };
}

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async findAllProducts(query: ProductsPaginationQueryTypes) {
    const { title, minPrice, maxPrice, sort, order, page, limit } = query;

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    const filters: ProductsFilterTypes = {};
    if (title) filters.title = title;
    if (minPrice) filters.price = { gte: parseInt(minPrice) };
    if (maxPrice) filters.price = { ...filters.price, lte: parseInt(maxPrice) };

    const totalCount = await this.productRepository.getProductCount(filters);
    const products = await this.productRepository.findAllProducts(filters, sort, order, skip, pageSize);

    const productsWithFinalPrice = products.map(product => ({
      ...product,
      ...productItemFormater(product),
    }));

    productItemFormater

    const result = {
      data: productsWithFinalPrice,
      pagination: {
        total: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        page: pageNumber,
        limit: pageSize,
      },
    }

    return unifiedResponse(true, SUCCESS.PRODUCT_LIST_FOUND, result)
  }

  async findProductById(productId: number) {
    const product = await this.productRepository.findProductById(productId);
    if (!product) return unifiedResponse(false, ERROR.PRODUCT_NOT_FOUND);
    const result = productItemFormater(product);
    return unifiedResponse(true, SUCCESS.PRODUCT_FOUND, result);
  }
}
