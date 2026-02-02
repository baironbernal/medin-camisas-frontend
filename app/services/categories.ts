import { apiFetch } from "./fetcher";
import { Category } from "@/types/category";

export function getCategories() {
  return apiFetch<Category[]>('/categories', {
    next: { revalidate: 3600 },
  });
}

export function getCategoryBySlug(slug: string) {
  return apiFetch<Category>(`/categories/${slug}`);
}