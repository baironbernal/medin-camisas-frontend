'use client';

import { createContext, useContext, useMemo, ReactNode } from 'react';
import { OrderRules } from '@/types/order-rules';

type OrderRulesContextType = {
  orderRules: OrderRules;
  isLargeSize: (sizeCode: string) => boolean;
};

const OrderRulesContext = createContext<OrderRulesContextType | undefined>(undefined);

interface OrderRulesProviderProps {
  children: ReactNode;
  initialRules: OrderRules;
}

export function OrderRulesProvider({ children, initialRules }: OrderRulesProviderProps) {
  const largeSizeCodes = useMemo(
    () => new Set(initialRules.large_size_protection.large_size_codes.map(c => c.toUpperCase())),
    [initialRules]
  );

  const isLargeSize = (sizeCode: string) => largeSizeCodes.has(sizeCode.toUpperCase());

  const value = useMemo(
    () => ({ orderRules: initialRules, isLargeSize }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initialRules, largeSizeCodes]
  );

  return (
    <OrderRulesContext.Provider value={value}>
      {children}
    </OrderRulesContext.Provider>
  );
}

export function useOrderRules() {
  const ctx = useContext(OrderRulesContext);
  if (!ctx) throw new Error('useOrderRules must be used within OrderRulesProvider');
  return ctx;
}
