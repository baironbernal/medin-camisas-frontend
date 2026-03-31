'use client';

import CartSidebar from "./Cart";

interface CartWithDiscountProps {
  onClose: () => void;
  isClosing: boolean;
}

export default function CartWithDiscount({ onClose, isClosing }: CartWithDiscountProps) {
  return <CartSidebar onClose={onClose} isClosing={isClosing} />;
}
