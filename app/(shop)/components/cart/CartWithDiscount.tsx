'use client';

import { DiscountRulesLoader } from "@/app/useContext/DiscountRulesLoader";
import CartSidebar from "./Cart";

interface CartWithDiscountProps {
  onClose: () => void;
  isClosing: boolean;
}

export default function CartWithDiscount({ onClose, isClosing }: CartWithDiscountProps) {
  return (
    <DiscountRulesLoader>
      <CartSidebar onClose={onClose} isClosing={isClosing} />
    </DiscountRulesLoader>
  );
}
