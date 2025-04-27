import { unifiedResponse } from 'uni-response';
import { ProductRepository } from '../repositories/product.repository';
import { ImageRepository } from '../../common/repositories/image.repository';
import skuGenerator from '@/util/sku.util';
import { ERROR, SUCCESS } from '@/constants/messages';
import { calculateDiscountedPrice } from '@/util/discount.util';
import { ProductsFilterTypes, ProductsPaginationQueryTypes, ProductInputType } from '@/types/product.types';
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
  constructor(
    private productRepository: ProductRepository,
    private imageRepository: ImageRepository,
  ) {}

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
    const products = await this.productRepository.findAllProducts(
      filters,
      sort,
      order,
      skip,
      pageSize,
    );

    const productsWithFinalPrice = products.map(product => ({
      ...product,
      ...productItemFormater(product),
    }));

    return unifiedResponse(true, SUCCESS.PRODUCT_LIST_FOUND, {
      data: productsWithFinalPrice,
      pagination: {
        total: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        page: pageNumber,
        limit: pageSize,
      },
    });
  }

  async createProduct(productData: ProductInputType) {
    const data = {
      ...productData,
      sku: skuGenerator(productData.title),
      price: productData.price,
      quantity: productData.quantity,
      discount: productData.discount,
    };

    const result = await this.productRepository.create(data);
    return result;
  }

  async updateProduct(id: number, productData: ProductInputType) {
    const result =  await this.productRepository.update(id, {
      ...productData,
      price: productData.price,
      quantity: productData.quantity,
      discount: productData.discount?.toFixed(2),
    }).then(() => {
      if (productData.deletedImageIds) {
        this.imageRepository.deleteImageByProductId(id);
      }
    });

    return unifiedResponse(true, SUCCESS.PRODUCT_UPDATED, {
      data: result,
    });
  }

  async deleteProduct(id: number) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      return unifiedResponse(false, ERROR.PRODUCT_NOT_FOUND, {
        data: null,
      })
    }
    const deletedProduct = await this.productRepository.delete(id);
    return unifiedResponse(true, SUCCESS.PRODUCT_DELETED, {
      data: deletedProduct,
    });
  }

  async getProductById(id: number) {
    let data = await this.productRepository.findById(id);
    if (data) {
      data = productItemFormater(data);
    }
    return unifiedResponse(true, SUCCESS.PRODUCT_FOUND, {
      data,
    })
  }
}
