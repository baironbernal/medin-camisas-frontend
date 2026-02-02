import { Product } from "@/types/product";
import { apiFetch } from "./fetcher";


export function getProducts() {
  return apiFetch<Product[]>('/products', {
    next: { revalidate: 3600 },
  });
}