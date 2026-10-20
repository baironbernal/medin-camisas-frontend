'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../store/useCartStore';
import { useAuth } from '@/app/useContext/AuthContext';
import { useCartPricing } from './cart/useCartPricing';
import { useCheckoutForm } from './cart/useCheckoutForm';
import { useWompiCheckout, OrderData } from './cart/useWompiCheckout';
import { useWhatsAppOrder } from './cart/useWhatsAppOrder';
import { trackMetaEvent, CURRENCY } from '@/app/lib/metaPixel';

export type Step = 'cart' | 'form' | 'success';

/** Orders up to this many units can be paid without an account. */
export const GUEST_MAX_UNITS = 6;

// Re-exported so existing imports from this file keep working
export type { CheckoutFormState as FormState } from './cart/useCheckoutForm';
export type { OrderData } from './cart/useWompiCheckout';

export function useCartSidebar(onClose: () => void) {
  const cart = useCartStore(state => state.cart);
  const totalUnits = useCartStore(state => state.totalItems);
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const [step, setStep]               = useState<Step>('cart');
  const [orderNumber, setOrderNumber] = useState('');
  const [orderData, setOrderData]     = useState<OrderData | null>(null);

  const canGuestCheckout = totalUnits <= GUEST_MAX_UNITS;
  const isGuest = !isLoggedIn;

  // ── Sub-hooks ──────────────────────────────────────────────────────────────
  const pricing = useCartPricing();
  const { formState, setField, resetForm } = useCheckoutForm();

  const { loading, error: checkoutError, handleCheckout } = useWompiCheckout({
    buildCheckoutItems: pricing.buildCheckoutItems,
    formState,
    isGuest,
    onSuccess: (num, data) => {
      setOrderNumber(num);
      setOrderData(data);
      setStep('success');
    },
  });

  const { loading: whatsappLoading, error: whatsappError, handleWhatsAppOrder } = useWhatsAppOrder({
    buildCheckoutItems: pricing.buildCheckoutItems,
  });


  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleProceed = () => {
    trackMetaEvent('InitiateCheckout', {
      content_ids: cart.map(item => String(item.product_id)),
      num_items: totalUnits,
      value: pricing.subtotalDiscounted,
      currency: CURRENCY,
    });

    if (!isLoggedIn && !canGuestCheckout) {
      onClose();
      router.push('/login?callback=cart');
      return;
    }
    resetForm();
    setStep('form');
  };

  return {
    cart,
    isLoggedIn,
    isGuest,
    canGuestCheckout,
    step,
    setStep,
    formState,
    setField,
    loading,
    whatsappLoading,
    checkoutError,
    whatsappError,
    orderNumber,
    orderData,
    calculatedData:     pricing.calculatedData,
    isLoadingPricing:   pricing.isLoading,
    subtotalOriginal:   pricing.subtotalOriginal,
    subtotalDiscounted: pricing.subtotalDiscounted,
    totalDiscount:      pricing.totalDiscount,
    largeSizeAnalysis:  pricing.largeSizeAnalysis,
    handleProceed,
    handleCheckout,
    handleWhatsAppOrder,
  };
}
