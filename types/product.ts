import { Variant } from "./variant";

export type ProductDimensions = {
  length: number;
  width: number;
  height: number;
};

export type ProductSpecifications = {
  weight: number;
  dimensions: ProductDimensions;
  care_instructions: string;
  origin: string;
};

export type Product = {
  id: number;
  reference_code: string;
  name: string;
  slug: string;
  description: string;
  season_id: number;
  category_id: number;
  base_price: string;
  wholesaler_price: string | null;
  colors_count: number;
  cost: string;
  brand: string;
  supplier: string;
  is_active: boolean;
  images: string[] | null;
  tags: string[];
  specifications: ProductSpecifications;
  created_at: string;
  updated_at: string;
  variants?: Variant[];
};


export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}


export interface ApiResponse<T> {
  data: T;
}
