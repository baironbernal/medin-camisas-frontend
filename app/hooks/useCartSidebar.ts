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
    try {
      const sessionId = getSessionId();
      
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
      
      setOrderNumber(res.data.order.order_number);
      setOrderData({
        total: res.data.order.total,
        subtotal_original: res.data.order.subtotal_original,
        subtotal_discounted: res.data.order.subtotal_discounted,
        total_discount: res.data.order.total_discount,
        items: res.data.items,
      });
      clearCart();
      setStep('success');
    } catch (err: unknown) {
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
