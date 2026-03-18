import { apiFetch } from "./fetcher";
import { DiscountRules } from "@/types/discount-rule";

export function getDiscountRules() {
  return apiFetch<DiscountRules>(`/discount-rules`);
}