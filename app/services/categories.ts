import { apiFetch } from "./fetcher";
import { Category } from "@/types/category";

export function getCategories() {
  return apiFetch<Category[]>('/categories');
}

export function getCategoryBySlug(slug: string) {
  return apiFetch<Category>(`/categories/${slug}`);
}