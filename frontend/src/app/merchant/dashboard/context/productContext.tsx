'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export type Product = {
  id: number;
  title: string;
  price: number;
  discount: number;
  quantity: number;
  description: string;
  images: string[];
  finalPrice?: number;
};

type Pagination = {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
};

type ProductContextType = {
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  fetchProducts: (params?: Record<string, string | number>) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 10
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const title= params.title ?? '';
  const page = params.page ?? '1';
  const limit = params.limit ?? '10';
  const sort = params.sort ?? 'createdAt';
  const order = params.order ?? 'desc';
  const minPrice = params.minPrice?? '0';
  const maxPrice = params.maxPrice?? '1000000000';

  const fetchProducts = async (
    params: Record<string, string | number | undefined> = {
      page: '1',
      limit: '10',
      sort: 'createdAt',
      order: 'desc',
      title: '',
      minPrice: '',
      maxPrice: ''
    }
  ) => {
    setLoading(true);
    setError(null);
    const query = new URLSearchParams(params as any).toString();
    console.log({ query })
    try {
      // Get merchant_jwt from cookies using js-cookie
      const res = await fetch(
        `http://localhost:4000/api/v1/merchant/products?${query}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      );
      const data = await res.json();

      if (data.success) {
        setProducts(data.data.data);
        setPagination(data.data.pagination);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts({ 
      page: String(page), 
      limit: String(limit), 
      sort: String(sort), 
      order: String(order), 
      title: String(title) ,
      minPrice: String(minPrice),
      maxPrice: String(maxPrice)
    });
  }, []);

  return (
    <ProductContext.Provider
      value={{ products, loading, error, pagination, fetchProducts }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const ctx = useContext(ProductContext);
  if (!ctx)
    throw new Error('useProductContext must be used within a ProductProvider');
  return ctx;
};
