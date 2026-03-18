// hooks/usePricing.ts

import { useMemo } from "react";
import { DiscountRule } from "@/types/discount-rule";

export const useDiscount = (rules: DiscountRule[]) => {
  
    //sort rules by min_quantity
  const sortedRules = useMemo(() => {
    return [...rules].sort((a, b) => a.min_quantity - b.min_quantity);
  }, [rules]);

  const getDiscountForQuantity = (quantity: number, basePrice: number) => {
    if (sortedRules.length === 0 || quantity < 1) return null;

    let applicableRule: DiscountRule | null = null;

    for (const rule of sortedRules) {
      const maxQty = rule.max_quantity ?? null;

      if (quantity >= rule.min_quantity) {
        if (maxQty === null || quantity <= maxQty) applicableRule = rule;
      }
    }

    if (!applicableRule || applicableRule.discount_value === 0) {
      return null;
    }

    const discount = applicableRule.discount_value;
    const discountedPrice = basePrice * (1 - discount / 100);

    return {
      discount,
      discountedPrice,
      rule: applicableRule,
    };
  };

  return {
    getDiscountForQuantity,
  };
};