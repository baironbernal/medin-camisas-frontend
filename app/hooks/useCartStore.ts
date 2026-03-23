'use client';

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Variant } from "@/types/variant";

interface State {
  cart: Variant[];
  totalItems: number;
  totalPrice: number;
}

interface Actions {
  addToCart: (product: Variant) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, delta: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const calculateTotals = (cart: Variant[]) => ({
  totalItems: cart.reduce((acc, item) => acc + (item.quantity ?? 0), 0),
  totalPrice: cart.reduce(
    (acc, item) => acc + (item.quantity ?? 0) * Number(item.price),
    0
  ),
});

export const useCartStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      cart: [],
      totalItems: 0,
      totalPrice: 0,

      addToCart: (product) => {
        const cart = get().cart;
        const existing = cart.find(i => i.id === product.id);
        const addQty = product.quantity ?? 1;

        let updatedCart;

        if (existing) {
          updatedCart = cart.map(i => {
            if (i.id === product.id) {
              const currentQty = i.quantity ?? 0;
              const itemStock = i.stock ?? product.stock ?? Infinity;
              const newQty = Math.min(currentQty + addQty, itemStock);
              return { ...i, quantity: newQty, stock: itemStock };
            }
            return i;
          });
        } else {
          const initialStock = product.stock ?? Infinity;
          updatedCart = [...cart, { ...product, quantity: Math.min(addQty, initialStock), stock: initialStock }];
        }

        set({
          cart: updatedCart,
          ...calculateTotals(updatedCart),
        });
      },

      removeFromCart: (productId) => {
        const updatedCart = get().cart.filter(i => i.id !== productId);

        set({
          cart: updatedCart,
          ...calculateTotals(updatedCart),
        });
      },

      updateQuantity: (productId, delta) => {
        const updatedCart = get().cart
          .map(item => {
            if (item.id === productId) {
              const currentQty = item.quantity ?? 0;
              let newQty = currentQty + delta;
              if (delta > 0) {
                newQty = Math.min(newQty, item.stock ?? Infinity);
              }
              return { ...item, quantity: newQty };
            }
            return item;
          })
          .filter(item => (item.quantity ?? 0) > 0);

        set({
          cart: updatedCart,
          ...calculateTotals(updatedCart),
        });
      },

      setQuantity: (productId, quantity) => {
        const updatedCart = get().cart.map(item => {
          if (item.id === productId) {
            // Ensure between 1 and stock limit
            const newQty = Math.max(1, Math.min(quantity, item.stock ?? Infinity));
            return { ...item, quantity: newQty };
          }
          return item;
        });

        set({
          cart: updatedCart,
          ...calculateTotals(updatedCart),
        });
      },

      clearCart: () =>
        set({
          cart: [],
          totalItems: 0,
          totalPrice: 0,
        }),
    }),
    {
      name: "cart-storage",
    }
  )
);