import { Filter } from "@/types/filters";
import { apiFetch } from "./fetcher";

export function getFilters() {
  return apiFetch<Filter[]>(`/attributes`);
}