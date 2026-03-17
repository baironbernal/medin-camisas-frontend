import { Product, PaginatedResponse, ApiResponse } from "@/types/product";
import { apiFetch } from "./fetcher";

export interface GetProductsParams {
  category?: string;
  subcategory?: string;
  name?: string;
  color?: string;
  size?: string;
  type?: string;
  season_id?: number | string;
  min_cost?: number | string;
  max_cost?: number | string;
  order_by?: string;
  order_dir?: 'asc' | 'desc';
  page?: number;
}

export function getProducts(params?: GetProductsParams) {
  const searchParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
  }

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/products?${queryString}` : '/products';

  return apiFetch<PaginatedResponse<Product>>(endpoint, {
    cache: 'no-store',
  });
}


export function getProduct<T>(slug: string): Promise<ApiResponse<T>> {
    return apiFetch(`/products/${slug}`, {
        cache: 'no-store',
    });
}