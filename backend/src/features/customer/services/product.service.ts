import { ProductRepository } from '../repositories/product.repository';
import { calculateDiscountedPrice } from '@/util/discount.util';
import { ProductsPaginationQueryTypes, ProductsFilterTypes } from '../types/product.types';
import { unifiedResponse } from 'uni-response';
import { ERROR, SUCCESS } from '@/constants/messages';

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async findAllProducts(query: ProductsPaginationQueryTypes) {
    const { name, minPrice, maxPrice, sort, order, page, limit } = query;

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    const filters: ProductsFilterTypes = {};
    if (name) filters.name = name;
    if (minPrice) filters.price = { gte: parseInt(minPrice) };
    if (maxPrice) filters.price = { ...filters.price, lte: parseInt(maxPrice) };

    const totalCount = await this.productRepository.getProductCount(filters);
    const products = await this.productRepository.findAllProducts(filters, sort, order, skip, pageSize);

    const productsWithFinalPrice = products.map(product => ({
      ...product,
      finalPrice: calculateDiscountedPrice(product.price, product.discount),
    }));

    return unifiedResponse(true, SUCCESS.PRODUCT_LIST_FOUND, {
      data: productsWithFinalPrice,
      pagination: {
        total: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        page: pageNumber,
        limit: pageSize,
      },
    })
  }

  async findProductById(productId: number) {
    const product = await this.productRepository.findProductById(productId);
    if (!product) return unifiedResponse(false, ERROR.PRODUCT_NOT_FOUND);
    return unifiedResponse(true, SUCCESS.PRODUCT_FOUND, product);
  }
}
