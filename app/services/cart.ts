import { apiFetch } from './fetcher';

export interface CalculatedItem {
  product_variant_id: number;
  quantity: number;
  unit_price: number;
  discounted_unit_price: number;
  total_price: number;
  discounted_total_price: number;
  discount_percentage: number;
  discount_rule_id: number | null;
  has_large_size_surcharge: boolean;
  surcharge_amount: number;
}

export interface LargeSizeAnalysis {
  triggers: boolean;
  proportion: number;
  surcharge_per_item: number;
  large_size_units: number;
  total_units: number;
}

export interface CartCalculationResult {
  items: CalculatedItem[];
  subtotal_original: number;
  subtotal_discounted: number;
  total_discount: number;
  large_size_analysis: LargeSizeAnalysis;
}

interface CartCalculatePayload {
  items: { product_variant_id: number; quantity: number }[];
}

interface CartCalculateResponse {
  success: boolean;
  data: CartCalculationResult;
}

export async function calculateCart(
  items: CartCalculatePayload['items']
): Promise<CartCalculationResult> {
  const res = await apiFetch<CartCalculateResponse>('/cart/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  return res.data;
}
