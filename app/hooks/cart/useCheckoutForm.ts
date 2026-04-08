'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/useContext/AuthContext';

export interface CheckoutFormState {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes: string;
}

export function useCheckoutForm() {
  const { user } = useAuth();

  const [formState, setFormState] = useState<CheckoutFormState>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    notes: '',
  });

  // Sync with user data once it becomes available (avoids stale initial state)
  useEffect(() => {
    if (!user) return;
    setFormState(prev => ({
      ...prev,
      customer_name:  prev.customer_name  || user.name         || '',
      customer_email: prev.customer_email || user.email        || '',
      customer_phone: prev.customer_phone || user.phone_number || '',
    }));
  }, [user]);

  const setField =
    (field: keyof CheckoutFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState(prev => ({ ...prev, [field]: e.target.value }));
    };

  const resetForm = () => {
    setFormState({
      customer_name:  user?.name         || '',
      customer_email: user?.email        || '',
      customer_phone: user?.phone_number || '',
      notes: '',
    });
  };

  return { formState, setField, resetForm };
}
