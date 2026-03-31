'use client';

import { createContext, useContext, ReactNode, useMemo, useCallback } from "react";
import { DiscountRule } from "@/types/discount-rule";

type DiscountRuleContextType = {
  rules: DiscountRule[];
  getDiscountForQuantity: (quantity: number, basePrice: number) => {
    discount: number;
    discountedPrice: number;
    rule: DiscountRule | null;
  } | null;
};

const DiscountRuleContext = createContext<DiscountRuleContextType | undefined>(undefined);

interface DiscountRuleProviderProps {
  children: ReactNode;
  initialRules: DiscountRule[];
}

export function DiscountRuleProvider({ children, initialRules }: DiscountRuleProviderProps) {
  const getDiscountForQuantity = useCallback((quantity: number, basePrice: number) => {
    if (initialRules.length === 0 || quantity < 1) return null;

    const sortedRules = [...initialRules].sort((a, b) => a.min_quantity - b.min_quantity);

    let applicableRule: DiscountRule | null = null;

    for (const rule of sortedRules) {
      const maxQty = rule.max_quantity ?? null;
      if (quantity >= rule.min_quantity) {
        if (maxQty === null || quantity <= maxQty) {
          applicableRule = rule;
        }
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
  }, [initialRules]);

  const value = useMemo(() => ({
    rules: initialRules,
    getDiscountForQuantity,
  }), [initialRules, getDiscountForQuantity]);

  return (
    <DiscountRuleContext.Provider value={value}>
      {children}
    </DiscountRuleContext.Provider>
  );
};

export const useDiscountRules = () => {
  const context = useContext(DiscountRuleContext);

  if (context === undefined) {
    throw new Error("useDiscountRules must be used within a DiscountRuleProvider");
  }

  return context;
};
