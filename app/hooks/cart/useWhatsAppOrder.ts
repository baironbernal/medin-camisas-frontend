'use client';

import { useState, useCallback } from 'react';
import { createWhatsAppOrder } from '@/app/services/checkout';
import { useCartStore } from '@/app/store/useCartStore';
import { useAuth } from '@/app/useContext/AuthContext';
import { formatCOP } from '@/app/lib/formatPrice';
import { Variant } from '@/types/variant';
import { CheckoutItem } from './useCartPricing';

const WHATSAPP_NUMBER = '573024197103';

// ── Pure presentation function — builds the pre-filled WhatsApp message ──────
function buildWhatsAppMessage(
  orderNumber: string,
  cart: Variant[],
  checkoutItems: CheckoutItem[],
  subtotalOriginal: number,
  subtotalDiscounted: number,
  totalDiscount: number,
  discountPct: number,
): string {
  const lines: string[] = [];
  lines.push(`Hola! Quiero confirmar mi pedido *${orderNumber}*`);
  lines.push('');
  lines.push('📦 *Productos:*');

  cart.forEach((item, index) => {
    const ci = checkoutItems[index];
    const finalUnitPrice = ci.discounted_unit_price;
    const itemTotal = finalUnitPrice * ci.quantity;
    const name = item.product_name || `SKU ${item.id}`;
    const combo = item.combination_name ? ` (${item.combination_name})` : '';
    lines.push(`- ${name}${combo} × ${ci.quantity}: ${formatCOP(itemTotal)}`);
  });

  lines.push('');
  lines.push('📊 *Resumen:*');

  if (totalDiscount > 0) {
    lines.push(`Subtotal sin descuento: ${formatCOP(subtotalOriginal)}`);
    lines.push(`Descuento (${discountPct}%): -${formatCOP(totalDiscount)}`);
  }

  lines.push(`*Total: ${formatCOP(subtotalDiscounted)}*`);

  return lines.join('\n');
}

interface UseWhatsAppOrderParams {
  buildCheckoutItems: () => CheckoutItem[];
  cart: Variant[];
  subtotalOriginal: number;
  subtotalDiscounted: number;
  totalDiscount: number;
  discountPct: number;
}

export function useWhatsAppOrder({
  buildCheckoutItems,
  cart,
  subtotalOriginal,
  subtotalDiscounted,
  totalDiscount,
  discountPct,
}: UseWhatsAppOrderParams) {
  const clearCart = useCartStore(state => state.clearCart);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleWhatsAppOrder = useCallback(async () => {
    setError('');
    setLoading(true);

    try {
      const checkoutItems = buildCheckoutItems();

      const res = await createWhatsAppOrder({
        customer_name:  user?.name,
        customer_phone: user?.phone_number,
        items:          checkoutItems,
      });

      const message = buildWhatsAppMessage(
        res.data.order.order_number,
        cart,
        checkoutItems,
        subtotalOriginal,
        subtotalDiscounted,
        totalDiscount,
        discountPct,
      );

      clearCart();
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear el pedido. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [buildCheckoutItems, cart, user, subtotalOriginal, subtotalDiscounted, totalDiscount, discountPct, clearCart]);

  return { loading, error, handleWhatsAppOrder };
}
