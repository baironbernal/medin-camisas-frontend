'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useCartStore } from '@/app/store/useCartStore';
import { calculateCart, CartCalculationResult, LargeSizeAnalysis } from '@/app/services/cart';

export type { CartCalculationResult };

export interface SimpleCheckoutItem {
  product_variant_id: number;
  quantity: number;
}

const EMPTY_LARGE_SIZE_ANALYSIS: LargeSizeAnalysis = {
  triggers: false,
  surcharge_per_item: 0,
  proportion: 0,
  large_size_units: 0,
  total_units: 0,
};

export function useCartPricing() {
  const cart = useCartStore(state => state.cart);
  const [calculatedData, setCalculatedData] = useState<CartCalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (cart.length === 0) {
      setCalculatedData(null);
      setIsLoading(false);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }

    setIsLoading(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const items = cart.map(item => ({
          product_variant_id: item.id,
          quantity: (item.quantity as number) || 1,
        }));
        const result = await calculateCart(items);
        setCalculatedData(result);
      } catch {
        // keep previous data on error; don't break UI
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [cart]);

  const buildCheckoutItems = useCallback((): SimpleCheckoutItem[] => {
    return cart.map(item => ({
      product_variant_id: item.id,
      quantity: (item.quantity as number) || 1,
    }));
  }, [cart]);

  return {
    calculatedData,
    isLoading,
    subtotalOriginal:   calculatedData?.subtotal_original   ?? 0,
    subtotalDiscounted: calculatedData?.subtotal_discounted ?? 0,
    totalDiscount:      calculatedData?.total_discount      ?? 0,
    largeSizeAnalysis:  calculatedData?.large_size_analysis ?? EMPTY_LARGE_SIZE_ANALYSIS,
    buildCheckoutItems,
  };
}
