'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useMemo, useCallback } from "react";
import { DiscountRule } from "@/types/discount-rule";
import { getDiscountRules } from "@/app/services/discount-rules";

type DiscountRuleContextType = {
  rules: DiscountRule[];
  loading: boolean;
  getDiscountForQuantity: (quantity: number, basePrice: number) => {
    discount: number;
    discountedPrice: number;
    rule: DiscountRule | null;
  } | null;
};

const DiscountRuleContext = createContext<DiscountRuleContextType | undefined>(undefined);

export function DiscountRuleProvider({ children }: { children: ReactNode }) {
  const [rules, setRules] = useState<DiscountRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscountRules = async () => {
      try {
        const data = await getDiscountRules();
        setRules(data);
      } catch (error) {
        console.error("Error fetching discount rules", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountRules();
  }, []);

  const getDiscountForQuantity = useCallback((quantity: number, basePrice: number) => {
    if (rules.length === 0 || quantity < 1) return null;

    const sortedRules = [...rules].sort((a, b) => a.min_quantity - b.min_quantity);
    
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
  }, [rules]);

  const value = useMemo(() => ({
    rules,
    loading,
    getDiscountForQuantity,
  }), [rules, loading, getDiscountForQuantity]);

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
