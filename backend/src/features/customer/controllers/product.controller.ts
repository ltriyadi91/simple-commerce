import { NextFunction, Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { ProductsPaginationQueryTypes } from '@/types/product.types';

export class ProductController {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  findAllProducts = async (
    req: Request<{}, {}, {}, ProductsPaginationQueryTypes>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { title, minPrice, maxPrice, sort = "title", order, page, limit } = req.query;
      const result = await this.productService.findAllProducts({
        title,
        minPrice,
        maxPrice,
        sort,
        order,
        page,
        limit,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  findProductById = async (req: Request, res: Response): Promise<void> => {
    const productId = parseInt(req.params.id);

    try {
      const product = await this.productService.findProductById(productId);

      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ message: 'Error in getting the product' });
    }
  }
}
