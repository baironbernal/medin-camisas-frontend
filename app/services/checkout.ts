import { apiFetch } from './fetcher';
import { getAuthHeaders } from './auth';

export interface CheckoutPayload {
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  notes?: string;
  items: {
    product_variant_id: number;
    quantity: number;
  }[];
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: {
    order: {
      id: number;
      order_number: string;
      status: string;
      total: string;
      currency: string;
      created_at: string;
    };
    items: {
      product_name: string;
      variant_sku: string;
      quantity: number;
      unit_price: string;
      total_price: string;
    }[];
  };
}

export async function checkout(
  payload: CheckoutPayload,
  sessionId: string
): Promise<OrderResponse> {
  return apiFetch<OrderResponse>('/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Session-ID': sessionId,
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
}
