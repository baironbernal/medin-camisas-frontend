'use client';

import { useState, useCallback } from 'react';
import { createWhatsAppOrder, OrderItem } from '@/app/services/checkout';
import { useCartStore } from '@/app/store/useCartStore';
import { formatCOP } from '@/app/lib/formatPrice';
import { SimpleCheckoutItem } from './useCartPricing';

const WHATSAPP_NUMBER = '573024197103';

function buildWhatsAppMessage(
  orderNumber: string,
  orderItems: OrderItem[],
  subtotalOriginal: number,
  subtotalDiscounted: number,
  customerName: string,
  customerPhone: string,
): string {
  const totalDiscount = subtotalOriginal - subtotalDiscounted;
  const discountPct = orderItems[0]?.discount_percentage ?? 0;

  const lines: string[] = [];
  lines.push(`Hola, soy *${customerName}* y mi teléfono es *${customerPhone}*. Quiero confirmar mi pedido *${orderNumber}*`);
  lines.push('');
  lines.push('📦 *Productos:*');

  orderItems.forEach(item => {
    const name = item.product_name || `SKU ${item.variant_sku}`;
    lines.push(`- ${name} (${item.variant_sku}) × ${item.quantity}: ${formatCOP(Number(item.discounted_total_price))}`);
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
  buildCheckoutItems: () => SimpleCheckoutItem[];
}

export function useWhatsAppOrder({ buildCheckoutItems }: UseWhatsAppOrderParams) {
  const clearCart = useCartStore(state => state.clearCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleWhatsAppOrder = useCallback(async (customerName: string, customerPhone: string) => {
    setError('');
    setLoading(true);

    try {
      const res = await createWhatsAppOrder({
        customer_name:  customerName,
        customer_phone: customerPhone,
        items:          buildCheckoutItems(),
      });

      const { order, items } = res.data;
      const subtotalOriginal   = Number(order.subtotal_original);
      const subtotalDiscounted = Number(order.subtotal_discounted);

      const message = buildWhatsAppMessage(
        order.order_number,
        items,
        subtotalOriginal,
        subtotalDiscounted,
        customerName,
        customerPhone,
      );

      clearCart();
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear el pedido. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [buildCheckoutItems, clearCart]);

  return { loading, error, handleWhatsAppOrder };
}
