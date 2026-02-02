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
  cost: string;
  brand: string;
  supplier: string;
  is_active: boolean;
  images: string[] | null;
  tags: string[];
  specifications: ProductSpecifications;
  created_at: string;
  updated_at: string;
};
