'use client';

import { useMemo, useCallback } from 'react';
import { useCartStore } from '@/app/store/useCartStore';
import { useDiscountRules } from '@/app/useContext/DiscountRuleContext';
import { useOrderRules } from '@/app/useContext/OrderRulesContext';
import { useDiscount } from '@/app/hooks/useDiscount';
import { Variant } from '@/types/variant';

export interface CheckoutItem {
  product_variant_id: number;
  quantity: number;
  discount_rule_id: number | null;
  discount_percentage: number;
  unit_price: number;
  discounted_unit_price: number;
  total_price: number;
  discounted_total_price: number;
}

export function useCartPricing() {
  const cart = useCartStore(state => state.cart);
  const { rules } = useDiscountRules();
  const { getDiscountForQuantity } = useDiscount(rules);
  const { orderRules, isLargeSize } = useOrderRules();
  const largeSizeCfg = orderRules.large_size_protection;

  const largeSizeAnalysis = useMemo(() => {
    let largeSizeUnits = 0;
    const largeVariantIds = new Set<number>();

    cart.forEach(item => {
      if (isLargeSize(item.size || '')) {
        largeSizeUnits += (item.quantity as number) || 1;
        largeVariantIds.add(item.id);
      }
    });

    const totalUnits = cart.reduce((acc, p) => acc + ((p.quantity as number) || 1), 0);
    const proportion = totalUnits > 0 ? largeSizeUnits / totalUnits : 0;
    const triggers = proportion > largeSizeCfg.threshold;

    return {
      triggers,
      surcharge_per_item: triggers ? largeSizeCfg.surcharge : 0,
      large_size_units: largeSizeUnits,
      total_units: totalUnits,
      proportion,
      large_variant_ids: largeVariantIds,
    };
  }, [cart, isLargeSize, largeSizeCfg]);

  const getEffectivePrice = useCallback((item: Variant): number => {
    const base = Number(item.price);
    if (largeSizeAnalysis.triggers && largeSizeAnalysis.large_variant_ids.has(item.id)) {
      return base + largeSizeCfg.surcharge;
    }
    return base;
  }, [largeSizeAnalysis, largeSizeCfg.surcharge]);

  const totalQuantity = useMemo(
    () => cart.reduce((acc, p) => acc + ((p.quantity as number) || 1), 0),
    [cart]
  );

  const subtotalOriginal = useMemo(
    () => cart.reduce((acc, p) => acc + getEffectivePrice(p) * ((p.quantity as number) || 1), 0),
    [cart, getEffectivePrice]
  );

  const cartDiscountInfo = useMemo(
    () => getDiscountForQuantity(totalQuantity, subtotalOriginal),
    [totalQuantity, subtotalOriginal, getDiscountForQuantity]
  );

  const subtotalDiscounted = useMemo(
    () => cartDiscountInfo && cartDiscountInfo.discount > 0
      ? cartDiscountInfo.discountedPrice
      : subtotalOriginal,
    [cartDiscountInfo, subtotalOriginal]
  );

  const totalDiscount = useMemo(
    () => subtotalOriginal - subtotalDiscounted,
    [subtotalOriginal, subtotalDiscounted]
  );

  const buildCheckoutItems = useCallback((): CheckoutItem[] => {
    return cart.map(item => {
      const unitPrice = getEffectivePrice(item);
      const quantity = (item.quantity as number) || 1;
      const discountInfo = getDiscountForQuantity(totalQuantity, unitPrice);
      const hasDiscount = discountInfo && discountInfo.discount > 0;
      const discountedUnitPrice = hasDiscount ? discountInfo.discountedPrice : unitPrice;

      return {
        product_variant_id: item.id,
        quantity,
        discount_rule_id: discountInfo?.rule?.id ?? null,
        discount_percentage: discountInfo?.discount ?? 0,
        unit_price: unitPrice,
        discounted_unit_price: discountedUnitPrice,
        total_price: unitPrice * quantity,
        discounted_total_price: discountedUnitPrice * quantity,
      };
    });
  }, [cart, getEffectivePrice, getDiscountForQuantity, totalQuantity]);

  return {
    largeSizeAnalysis,
    getEffectivePrice,
    totalQuantity,
    subtotalOriginal,
    cartDiscountInfo,
    subtotalDiscounted,
    totalDiscount,
    buildCheckoutItems,
  };
}
