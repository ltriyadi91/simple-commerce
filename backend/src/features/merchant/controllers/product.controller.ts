import { NextFunction, Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { ProductsPaginationQueryTypes } from '@/types/product.types';
import { getFileUrlFromAws, uploadFileToAws } from '@/middleware/aws-s3.middleware';
import formidable from 'formidable';

export class MerchantProductController {
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
      const { title, minPrice, maxPrice, sort, order, page, limit } = req.query;
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
      const product = await this.productService.getProductById(productId);

      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ message: 'Error in getting the product' });
    }
  }

  createProduct = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.createProduct(req.body);
      res.status(201).json({ message: 'Product created successfully', product });
    } catch (err) {
      res.status(500).json({ message: 'Error in creating the product', err });
    }
  }

  updateProduct = async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await this.productService.updateProduct(productId, req.body);
      res.status(200).json({ message: 'Product updated successfully', product });
    } catch (err) {
      res.status(500).json({ message: 'Error in updating the product', err });
    }
  }

  deleteProduct = async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id);
      await this.productService.deleteProduct(productId);
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error in deleting product' });
    }
  }
}