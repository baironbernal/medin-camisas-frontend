'use client';

import { ReactNode } from "react";
import { DiscountRuleProvider } from "./DiscountRuleContext";

interface DiscountRulesLoaderProps {
  children: ReactNode;
}

export function DiscountRulesLoader({ children }: DiscountRulesLoaderProps) {
  return (
    <DiscountRuleProvider>
      {children}
    </DiscountRuleProvider>
  );
}
