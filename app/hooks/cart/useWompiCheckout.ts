'use client';

import { useState, useCallback } from 'react';
import { checkout, guestCheckout } from '@/app/services/checkout';
import { useCartStore } from '@/app/store/useCartStore';
import { CheckoutFormState } from './useCheckoutForm';
import { SimpleCheckoutItem } from './useCartPricing';
import { trackMetaEvent, getMetaCookies, CURRENCY } from '@/app/lib/metaPixel';

export interface OrderData {
  total: string;
  subtotal_original: string;
  subtotal_discounted: string;
  total_discount: string;
  items: {
    product_name: string;
    variant_sku: string;
    quantity: number;
    discount_rule_id: number | null;
    discount_percentage: number;
    unit_price: string;
    discounted_unit_price: string;
    total_price: string;
    discounted_total_price: string;
  }[];
}

const WOMPI_SCRIPT_URL = 'https://checkout.wompi.co/widget.js';

function loadWompiScript(publicKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    type WompiWindow = Window & { WidgetCheckout?: unknown };

    if (typeof (window as WompiWindow).WidgetCheckout !== 'undefined') {
      resolve();
      return;
    }

    let tag = document.querySelector<HTMLScriptElement>(`script[src="${WOMPI_SCRIPT_URL}"]`);
    if (tag) {
      tag.addEventListener('load', () => resolve());
      tag.addEventListener('error', () => reject(new Error('No se pudo cargar el módulo de pago.')));
      return;
    }

    tag = document.createElement('script');
    tag.src = WOMPI_SCRIPT_URL;
    tag.setAttribute('data-public-key', publicKey);
    tag.onload = () => resolve();
    tag.onerror = () => reject(new Error('No se pudo cargar el módulo de pago. Verifica tu conexión.'));
    document.head.appendChild(tag);
  });
}

interface UseWompiCheckoutParams {
  buildCheckoutItems: () => SimpleCheckoutItem[];
  formState: CheckoutFormState;
  isGuest: boolean;
  onSuccess: (orderNumber: string, orderData: OrderData) => void;
}

export function useWompiCheckout({
  buildCheckoutItems,
  formState,
  isGuest,
  onSuccess,
}: UseWompiCheckoutParams) {
  const clearCart = useCartStore(state => state.clearCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const createOrder = isGuest ? guestCheckout : checkout;
      const res = await createOrder({
        customer_name:  formState.customer_name,
        customer_email: formState.customer_email,
        customer_phone: formState.customer_phone || undefined,
        notes:          formState.notes          || undefined,
        items:          buildCheckoutItems(),
        meta:           getMetaCookies(),
      });

      const { order, payment, items } = res.data;
      // Product IDs captured now — the cart is cleared once the payment is approved
      const productIds = [...new Set(useCartStore.getState().cart.map(item => String(item.product_id)))];

      await loadWompiScript(payment.public_key);

      const widget = new WidgetCheckout({
        currency:      payment.currency,
        amountInCents: payment.amount_in_cents,
        reference:     payment.reference,
        publicKey:     payment.public_key,
        signature:     { integrity: payment.signature },
      });

      widget.open(result => {
        const status = result?.transaction?.status;

        if (status === 'APPROVED') {
          // eventId = order number, same as the server-side Purchase → Meta counts it once
          trackMetaEvent('Purchase', {
            content_ids: productIds,
            content_type: 'product',
            num_items: items.reduce((sum, item) => sum + item.quantity, 0),
            value: Number(order.total),
            currency: CURRENCY,
          }, order.order_number);
          clearCart();
          onSuccess(order.order_number, {
            total:               order.total,
            subtotal_original:   order.subtotal_original,
            subtotal_discounted: order.subtotal_discounted,
            total_discount: String(
              Math.max(0, Number(order.subtotal_original) - Number(order.subtotal_discounted))
            ),
            items,
          });
        } else if (status === 'DECLINED' || status === 'VOIDED' || status === 'ERROR') {
          setError('El pago fue rechazado. Por favor intenta con otro método de pago.');
        }
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pedido. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [formState, isGuest, buildCheckoutItems, onSuccess, clearCart]);

  return { loading, error, handleCheckout };
}
