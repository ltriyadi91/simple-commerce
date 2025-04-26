import { unifiedResponse } from 'uni-response';
import { ProductRepository } from '../repositories/product.repository';
import skuGenerator from '@/util/sku.util';
import { SUCCESS } from '@/constants/messages';
import { calculateDiscountedPrice } from '@/util/discount.util';
import { ProductsFilterTypes, ProductsPaginationQueryTypes } from '@/types/product.types';
import { uploadFileToAws } from '@/middleware/aws-s3.middleware';

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

  async createProduct(productData: any) {
    const data = {
      ...productData,
      sku: skuGenerator(productData.title),
      price: parseFloat(productData.price),
      quantity: parseInt(productData.quantity),
      discount: parseFloat(productData.discount),
    };
    return await this.productRepository.create(data);
  }

  async updateProduct(id: number, productData: any) {
    return await this.productRepository.update(id, {
      ...productData,
      price: parseFloat(productData.price),
      quantity: parseInt(productData.quantity),
      discount: parseFloat(productData.discount),
    });
  }

  async deleteProduct(id: number) {
    return await this.productRepository.delete(id);
  }

  async getProductById(id: number) {
    return await this.productRepository.findById(id);
  }
}
