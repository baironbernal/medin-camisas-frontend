export interface Variant {
  id: number;
  product_id: number;
  sku: string;
  color: string;
  size: string;
  stock: number;
  images: string[];
  price: number;
  created_at: string;
  updated_at: string;
  quantity?: number;
  available_attributes?: {
    Color: string[];
    Talla: string[];
    Material: string[];
  };
  product_name?: string;
  product_images?: string[];
}