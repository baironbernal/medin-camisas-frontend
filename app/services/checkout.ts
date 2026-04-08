import { apiFetch } from './fetcher';
import { getAuthHeaders } from './auth';

export interface WhatsAppOrderPayload {
  customer_name?: string;
  customer_phone?: string;
  notes?: string;
  items: CheckoutItem[];
}

export interface WhatsAppOrderResponse {
  success: boolean;
  message: string;
  data: {
    order: {
      id: number;
      order_number: string;
      status: string;
      total: string;
      subtotal_original: string;
      subtotal_discounted: string;
      currency: string;
      created_at: string;
    };
    items: OrderItem[];
  };
}

export interface CheckoutItem {
  product_variant_id: number;
  quantity: number;
  discount_rule_id: number | null;
  discount_percentage: number;
  unit_price: number;
  discounted_unit_price: number;
  total_price: number;
  discounted_total_price: number;
}

export interface CheckoutPayload {
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  notes?: string;
  subtotal_original: number;
  subtotal_discounted: number;
  items: CheckoutItem[];
}

export interface OrderItem {
  product_name: string;
  variant_sku: string;
  quantity: number;
  discount_rule_id: number | null;
  discount_percentage: number;
  unit_price: string;
  discounted_unit_price: string;
  total_price: string;
  discounted_total_price: string;
}

export interface WompiPaymentConfig {
  public_key: string;
  currency: string;
  amount_in_cents: number;
  reference: string;
  signature: string;
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
      subtotal_original: string;
      subtotal_discounted: string;
      currency: string;
      created_at: string;
    };
    items: OrderItem[];
    payment: WompiPaymentConfig;
  };
}

export async function checkout(
  payload: CheckoutPayload,
  sessionId: string
): Promise<OrderResponse> {
  const authHeaders = await getAuthHeaders();
  return apiFetch<OrderResponse>('/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Session-ID': sessionId,
      ...authHeaders,
    },
    body: JSON.stringify(payload),
  });
}

export async function createWhatsAppOrder(
  payload: WhatsAppOrderPayload
): Promise<WhatsAppOrderResponse> {
  const authHeaders = await getAuthHeaders();
  return apiFetch<WhatsAppOrderResponse>('/whatsapp-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
    },
    body: JSON.stringify(payload),
  });
}
