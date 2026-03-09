import { CombinationData } from "./inventory";
import { Product } from "./product";
import { Variant } from "./variant";

export interface ProductDetail extends Product {
  variants: Variant[];
  available_attributes: {
    "Color": Color[]
    "Talla": string[]
    "Material": string[]
  };
  combination_index: Record<string, CombinationData>;
}

export interface Color {
  name: string
  hex_color: string
}