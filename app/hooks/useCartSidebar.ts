'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/app/hooks/useCartStore';
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
  const [orderTotal, setOrderTotal] = useState('');

  const total = cart.reduce((acc, p) => {
    const basePrice = Number(p.price);
    const quantity = p.quantity as number;
    const discountInfo = getDiscountForQuantity(quantity, basePrice);
    const finalPrice = discountInfo && discountInfo.discount > 0 
      ? discountInfo.discountedPrice 
      : basePrice;
    return acc + finalPrice * quantity;
  }, 0);

  const originalTotal = cart.reduce(
    (acc, p) => acc + Number(p.price) * (p.quantity as number),
    0
  );

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
      const res = await checkout(
        {
          customer_name: formState.customer_name,
          customer_email: formState.customer_email,
          customer_phone: formState.customer_phone || undefined,
          notes: formState.notes || undefined,
          items: cart.map(item => ({
            product_variant_id: item.id,
            quantity: item.quantity as number,
          })),
        },
        sessionId
      );
      setOrderNumber(res.data.order.order_number);
      setOrderTotal(res.data.order.total);
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
    orderTotal,
    total,
    originalTotal,
    handleProceed,
    handleCheckout,
    getDiscountForQuantity
  };
}
