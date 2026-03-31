import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../useCartStore';
import { Variant } from '@/types/variant';

const makeVariant = (overrides: Partial<Variant> = {}): Variant => ({
  id: 1,
  product_id: 100,
  sku: 'SKU-001',
  color: 'Rojo',
  size: 'M',
  price: 50000,
  stock: 10,
  quantity: 1,
  images: ['img1.jpg'],
  created_at: '2026-01-01',
  updated_at: '2026-01-01',
  ...overrides,
});

describe('useCartStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useCartStore.setState({ cart: [], totalItems: 0, totalPrice: 0 });
  });

  describe('addToCart', () => {
    it('adds a new product to the cart', () => {
      const variant = makeVariant();
      useCartStore.getState().addToCart(variant);

      const state = useCartStore.getState();
      expect(state.cart).toHaveLength(1);
      expect(state.cart[0].id).toBe(1);
      expect(state.cart[0].quantity).toBe(1);
      expect(state.totalItems).toBe(1);
      expect(state.totalPrice).toBe(50000);
    });

    it('increments quantity when adding existing product', () => {
      const variant = makeVariant();
      useCartStore.getState().addToCart(variant);
      useCartStore.getState().addToCart(variant);

      const state = useCartStore.getState();
      expect(state.cart).toHaveLength(1);
      expect(state.cart[0].quantity).toBe(2);
      expect(state.totalItems).toBe(2);
      expect(state.totalPrice).toBe(100000);
    });

    it('respects stock limits', () => {
      const variant = makeVariant({ stock: 2 });
      useCartStore.getState().addToCart(variant);
      useCartStore.getState().addToCart(variant);
      useCartStore.getState().addToCart(variant); // should be capped at 2

      const state = useCartStore.getState();
      expect(state.cart[0].quantity).toBe(2);
    });

    it('adds multiple quantities at once', () => {
      const variant = makeVariant({ quantity: 3 });
      useCartStore.getState().addToCart(variant);

      const state = useCartStore.getState();
      expect(state.cart[0].quantity).toBe(3);
      expect(state.totalItems).toBe(3);
    });
  });

  describe('removeFromCart', () => {
    it('removes a product from the cart', () => {
      useCartStore.getState().addToCart(makeVariant());
      useCartStore.getState().removeFromCart(1);

      const state = useCartStore.getState();
      expect(state.cart).toHaveLength(0);
      expect(state.totalItems).toBe(0);
      expect(state.totalPrice).toBe(0);
    });

    it('does nothing if product not in cart', () => {
      useCartStore.getState().addToCart(makeVariant());
      useCartStore.getState().removeFromCart(999);

      expect(useCartStore.getState().cart).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    it('increments quantity by delta', () => {
      useCartStore.getState().addToCart(makeVariant());
      useCartStore.getState().updateQuantity(1, 2);

      expect(useCartStore.getState().cart[0].quantity).toBe(3);
    });

    it('removes item when quantity reaches 0', () => {
      useCartStore.getState().addToCart(makeVariant());
      useCartStore.getState().updateQuantity(1, -1);

      expect(useCartStore.getState().cart).toHaveLength(0);
    });

    it('caps at stock limit when increasing', () => {
      useCartStore.getState().addToCart(makeVariant({ stock: 3 }));
      useCartStore.getState().updateQuantity(1, 10);

      expect(useCartStore.getState().cart[0].quantity).toBe(3);
    });
  });

  describe('setQuantity', () => {
    it('sets exact quantity', () => {
      useCartStore.getState().addToCart(makeVariant());
      useCartStore.getState().setQuantity(1, 5);

      expect(useCartStore.getState().cart[0].quantity).toBe(5);
    });

    it('enforces minimum of 1', () => {
      useCartStore.getState().addToCart(makeVariant());
      useCartStore.getState().setQuantity(1, 0);

      expect(useCartStore.getState().cart[0].quantity).toBe(1);
    });

    it('enforces stock maximum', () => {
      useCartStore.getState().addToCart(makeVariant({ stock: 5 }));
      useCartStore.getState().setQuantity(1, 100);

      expect(useCartStore.getState().cart[0].quantity).toBe(5);
    });
  });

  describe('clearCart', () => {
    it('clears all items', () => {
      useCartStore.getState().addToCart(makeVariant({ id: 1 }));
      useCartStore.getState().addToCart(makeVariant({ id: 2 }));
      useCartStore.getState().clearCart();

      const state = useCartStore.getState();
      expect(state.cart).toHaveLength(0);
      expect(state.totalItems).toBe(0);
      expect(state.totalPrice).toBe(0);
    });
  });
});
