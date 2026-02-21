'use client';

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";


interface State {
  cart: Product[];
  totalItems: number;
  totalPrice: number;
}

interface Actions {
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<State & Actions>() (
  persist(
    (set, get) => ({

      cart: [],
      totalItems: 0,
      totalPrice: 0,

      addToCart: (product: Product) => {
        const cart = get().cart;
        const existing = cart.find(item => item.id === product.id);

        let updatedCart: Product[];

        if (existing) {
          updatedCart = cart.map(item =>
            item.id === product.id
              ? { ...item, quantity: (item.quantity || 0) + 1 }
              : item
          );
        } else {
          updatedCart = [...cart, { ...product, quantity: 1 }];
        }

        set({
          cart: updatedCart,
          totalItems: calculateItems(updatedCart),
          totalPrice: calculateTotal(updatedCart),
        });
      },

      removeFromCart: (productId: number) => {
        const cart = get().cart;
        const item: Product | undefined = cart.find(i => i.id === productId);
        if (!item) return;

        let updatedCart: Product[];
        
        updatedCart = cart.filter(i => i.id !== productId); 

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

function calculateItems(cart: Product[]) {
  return cart.reduce((total, item) => total + (item.quantity || 0), 0);
}

function calculateTotal(cart: Product[]) {
  return cart.reduce(
    (total, item) => total + (item.quantity || 0) * Number(item.cost),
    0
  );
}