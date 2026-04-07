export interface Product {
  id: string;
  name: string;
  slug?: string;
  description: string;
  price: number;
  image: string;
  category: string;
  categoryId?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  skip: number;
}
