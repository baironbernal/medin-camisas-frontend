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
  decreaseQuantity: (productId: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<State & Actions>() (
  persist(
    (set, get) => ({

      cart: [],
      totalItems: 0,
      totalPrice: 0,

      addToCart: (product: Variant) => {
        const cart = get().cart;
        const existing = cart.find(item => item.id === product.id);
        const quantity = product.quantity || 1;

        let updatedCart: Variant[];

        if (existing) {
          updatedCart = cart.map(item =>
            item.id === product.id
              ? { ...item, quantity: (item.quantity || 0) + quantity }
              : item
          );
        } else {
          updatedCart = [...cart, { ...product, quantity: quantity }];
        }

        set({
          cart: updatedCart,
          totalItems: calculateItems(updatedCart),
          totalPrice: calculateTotal(updatedCart),
        });
      },

      removeFromCart: (productId: number) => {
        const cart = get().cart;
        const item: Variant | undefined = cart.find(i => i.id === productId);
        if (!item) return;

        let updatedCart: Variant[];
        
        updatedCart = cart.filter(i => i.id !== productId); 

        set({
          cart: updatedCart,
          totalItems: calculateItems(updatedCart),
          totalPrice: calculateTotal(updatedCart),
        });
      },

      decreaseQuantity: (productId: number) => {
        const cart = get().cart;
        const item = cart.find(i => i.id === productId);
        if (!item) return;

        let updatedCart: Variant[];

        if ((item.quantity || 1) <= 1) {
          updatedCart = cart.filter(i => i.id !== productId);
        } else {
          updatedCart = cart.map(i =>
            i.id === productId
              ? { ...i, quantity: (i.quantity || 1) - 1 }
              : i
          );
        }

        set({
          cart: updatedCart,
          totalItems: calculateItems(updatedCart),
          totalPrice: calculateTotal(updatedCart),
        });
      },

      clearCart: () => set({ cart: [], totalItems: 0, totalPrice: 0 }),

    }),
    {
      name: "cart-storage",
    }
  )
);

function calculateItems(cart: Variant[]) {
  return cart.reduce((total, item) => total + (item.quantity || 0), 0);
}

function calculateTotal(cart: Variant[]) {
  return cart.reduce(
    (total, item) => total + (item.quantity || 0) * Number(item.price),
    0
  );
}