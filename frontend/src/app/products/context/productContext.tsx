import React, { createContext, useContext, useEffect, useState } from "react";

type Product = {
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
  pagination: Pagination | null;
  fetchProducts: (params?: Record<string, string | number>) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (
    params: Record<string, string | number> = { page: 1, limit: 12 }
  ) => {
    setLoading(true);
    setError(null);
    const query = new URLSearchParams(params as any).toString();
    try {
      const res = await fetch(
        `http://localhost:4000/api/v1/customer/products?${query}`
      );
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.data);
        setPagination(data.data.pagination);
      } else {
        setError("Failed to fetch products");
      }
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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
    throw new Error("useProductContext must be used within a ProductProvider");
  return ctx;
};
