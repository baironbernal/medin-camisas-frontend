'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../store/useCartStore';
import { useAuth } from '@/app/useContext/AuthContext';
import { checkout } from '@/app/services/checkout';
import { useDiscountRules } from '@/app/useContext/DiscountRuleContext';
import { useDiscount } from '@/app/hooks/useDiscount';

export type Step = 'cart' | 'form' | 'success';

export interface FormState {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes: string;
}

const WOMPI_SCRIPT_URL = 'https://checkout.wompi.co/widget.js';

/**
 * Injects the Wompi script tag if it isn't already in the document and
 * returns a Promise that resolves once WidgetCheckout is available on window.
 * Safe to call multiple times — reuses the same <script> element.
 */
function loadWompiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    type WompiWindow = Window & { WidgetCheckout?: unknown };

    // Already available — resolve immediately
    if (typeof (window as WompiWindow).WidgetCheckout !== 'undefined') {
      console.log('[Wompi] WidgetCheckout ya estaba en window, listo.');
      resolve();
      return;
    }

    // Script tag already injected — wait for it to finish
    let tag = document.querySelector<HTMLScriptElement>(`script[src="${WOMPI_SCRIPT_URL}"]`);
    if (tag) {
      console.log('[Wompi] <script> ya existe en el DOM, esperando evento load...');
      tag.addEventListener('load', () => { console.log('[Wompi] script cargó (tag existente).'); resolve(); });
      tag.addEventListener('error', (e) => { console.error('[Wompi] error en tag existente:', e); reject(new Error('No se pudo cargar el módulo de pago.')); });
      return;
    }

    // Inject the script for the first time
    console.log('[Wompi] Inyectando <script> por primera vez:', WOMPI_SCRIPT_URL);
    tag = document.createElement('script');
    tag.src = WOMPI_SCRIPT_URL;
    tag.onload = () => { console.log('[Wompi] script cargado correctamente. WidgetCheckout:', typeof (window as WompiWindow).WidgetCheckout); resolve(); };
    tag.onerror = (e) => { console.error('[Wompi] falló la carga del script:', e); reject(new Error('No se pudo cargar el módulo de pago. Verifica tu conexión.')); };
    document.head.appendChild(tag);
  });
}

function getSessionId(): string {
  const key = 'medin_session_id';
  let id = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
  if (!id) {
    id = crypto.randomUUID();
    if (typeof window !== 'undefined') localStorage.setItem(key, id);
  }
  return id;
}

export function useCartSidebar(onClose: () => void) {
  const cart = useCartStore(state => state.cart);
  const clearCart = useCartStore(state => state.clearCart);
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();
  const { rules } = useDiscountRules();
  const { getDiscountForQuantity } = useDiscount(rules);

  const [step, setStep] = useState<Step>('cart');
  const [formState, setFormState] = useState<FormState>({
    customer_name: user?.name || '',
    customer_email: user?.email || '',
    customer_phone: user?.phone_number || '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [orderData, setOrderData] = useState<{
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
  } | null>(null);

  const subtotalDiscounted = cart.reduce((acc, p) => {
    const basePrice = Number(p.price);
    const quantity = p.quantity as number;
    const discountInfo = getDiscountForQuantity(quantity, basePrice);
    const finalPrice = discountInfo && discountInfo.discount > 0 
      ? discountInfo.discountedPrice 
      : basePrice;
    return acc + finalPrice * quantity;
  }, 0);

  const subtotalOriginal = cart.reduce(
    (acc, p) => acc + Number(p.price) * (p.quantity as number),
    0
  );

  const totalDiscount = subtotalOriginal - subtotalDiscounted;

  const setField = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleProceed = () => {
    if (!isLoggedIn) {
      onClose();
      router.push('/login?callback=cart');
      return;
    }
    setFormState({
      customer_name: user?.name || '',
      customer_email: user?.email || '',
      customer_phone: user?.phone_number || '',
      notes: '',
    });
    setStep('form');
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log('[Checkout] ── INICIO handleCheckout ──');
    try {
      const sessionId = getSessionId();
      console.log('[Checkout] sessionId:', sessionId);

      const checkoutItems = cart.map(item => {
        const unitPrice = Number(item.price);
        const quantity = item.quantity as number;
        const totalPrice = unitPrice * quantity;
        const discountInfo = getDiscountForQuantity(quantity, unitPrice);
        const hasDiscount = discountInfo && discountInfo.discount > 0;
        const discountedUnitPrice = hasDiscount ? discountInfo.discountedPrice : unitPrice;
        const discountedTotalPrice = discountedUnitPrice * quantity;

        return {
          product_variant_id: item.id,
          quantity,
          discount_rule_id: discountInfo?.rule?.id ?? null,
          discount_percentage: discountInfo?.discount ?? 0,
          unit_price: unitPrice,
          discounted_unit_price: discountedUnitPrice,
          total_price: totalPrice,
          discounted_total_price: discountedTotalPrice,
        };
      });

      console.log('[Checkout] Payload que se envía al backend:', {
        customer_name: formState.customer_name,
        customer_email: formState.customer_email,
        items: checkoutItems,
      });

      const res = await checkout(
        {
          customer_name: formState.customer_name,
          customer_email: formState.customer_email,
          customer_phone: formState.customer_phone || undefined,
          notes: formState.notes || undefined,
          subtotal_original: subtotalOriginal,
          subtotal_discounted: subtotalDiscounted,
          items: checkoutItems,
        },
        sessionId
      );

      console.log('[Checkout] Respuesta del backend:', res);

      const { order, payment, items } = res.data;
      console.log('[Checkout] order:', order);
      console.log('[Checkout] payment config:', payment);

      // Guarantee the script is fully loaded before using WidgetCheckout
      console.log('[Checkout] Llamando loadWompiScript...');
      await loadWompiScript();
      console.log('[Checkout] loadWompiScript resolvió. Abriendo widget...');

      const widget = new WidgetCheckout({
        currency: payment.currency,
        amountInCents: payment.amount_in_cents,
        reference: payment.reference,
        publicKey: payment.public_key,
        signature: { integrity: payment.signature },
      });

      console.log('[Checkout] widget.open() llamado.');
      widget.open((result) => {
        console.log('[Checkout] Callback de open, result completo:', result);
        const status = result?.transaction?.status;
        console.log('[Checkout] transaction status:', status);

        if (status === 'APPROVED') {
          console.log('[Checkout] Pago aprobado');
          clearCart();
          setOrderNumber(order.order_number);
          setOrderData({
            total: order.total,
            subtotal_original: order.subtotal_original,
            subtotal_discounted: order.subtotal_discounted,
            total_discount: String(
              Math.max(0, Number(order.subtotal_original) - Number(order.subtotal_discounted))
            ),
            items,
          });
          setStep('success');
        } else if (status === 'DECLINED' || status === 'VOIDED' || status === 'ERROR') {
          console.log('[Checkout] Pago rechazado');
          setError('El pago fue rechazado. Por favor intenta con otro método de pago.');
        }
        // Sin status (cerró sin pagar) → se queda en el form silenciosamente
      });
    } catch (err: unknown) {
      console.error('[Checkout] ❌ ERROR capturado:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al procesar el pedido. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    cart,
    isLoggedIn,
    step,
    setStep,
    formState,
    setField,
    loading,
    error,
    orderNumber,
    orderData,
    subtotalDiscounted,
    subtotalOriginal,
    totalDiscount,
    handleProceed,
    handleCheckout,
    getDiscountForQuantity
  };
}
