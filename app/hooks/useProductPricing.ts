'use client';

import { useState, useEffect, useRef } from 'react';
import { calculateCart, CalculatedItem } from '@/app/services/cart';

interface DiscountPreview {
  discount: number;
  discountedPrice: number;
}

interface UseProductPricingResult {
  currentDiscount: DiscountPreview | null;
  nextTierDiscount: DiscountPreview | null;
  isLoading: boolean;
}

export function useProductPricing(
  variantId: number | null,
  quantity: number,
  quantityAvailable: number,
): UseProductPricingResult {
  const [currentItem, setCurrentItem] = useState<CalculatedItem | null>(null);
  const [nextItem, setNextItem]       = useState<CalculatedItem | null>(null);
  const [isLoading, setIsLoading]     = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!variantId) {
      setCurrentItem(null);
      setNextItem(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const nextQty = quantity + 1;
        const hasNextTier = nextQty <= quantityAvailable;

        const requests: Promise<CalculatedItem | null>[] = [
          calculateCart([{ product_variant_id: variantId, quantity }])
            .then(r => r.items[0] ?? null)
            .catch(() => null),
        ];

        if (hasNextTier) {
          requests.push(
            calculateCart([{ product_variant_id: variantId, quantity: nextQty }])
              .then(r => r.items[0] ?? null)
              .catch(() => null)
          );
        } else {
          requests.push(Promise.resolve(null));
        }

        const [current, next] = await Promise.all(requests);

        setCurrentItem(current);
        // Only show next tier hint if the discount is actually better
        setNextItem(
          next && next.discount_percentage > (current?.discount_percentage ?? 0)
            ? next
            : null
        );
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [variantId, quantity, quantityAvailable]);

  // Reset when variant changes
  useEffect(() => {
    setCurrentItem(null);
    setNextItem(null);
  }, [variantId]);

  const currentDiscount: DiscountPreview | null =
    currentItem && currentItem.discount_percentage > 0
      ? { discount: currentItem.discount_percentage, discountedPrice: currentItem.discounted_unit_price }
      : null;

  const nextTierDiscount: DiscountPreview | null =
    nextItem
      ? { discount: nextItem.discount_percentage, discountedPrice: nextItem.discounted_unit_price }
      : null;

  return { currentDiscount, nextTierDiscount, isLoading };
}
