export interface ProductsPaginationQueryTypes {
  title: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
  order: string;
  page: string;
  limit: string;
}

export interface ProductsFilterTypes {
  title?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
}
