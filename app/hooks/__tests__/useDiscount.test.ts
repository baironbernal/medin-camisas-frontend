import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDiscount } from '../useDiscount';
import { DiscountRule } from '@/types/discount-rule';

const mockRules: DiscountRule[] = [
  { id: 1, min_quantity: 3, max_quantity: 5, discount_value: 10, name: 'Tier 1', discount_type: 'percentage' },
  { id: 2, min_quantity: 6, max_quantity: 10, discount_value: 20, name: 'Tier 2', discount_type: 'percentage' },
  { id: 3, min_quantity: 11, discount_value: 30, name: 'Tier 3', discount_type: 'percentage' },
];

describe('useDiscount', () => {
  it('returns null when no rules', () => {
    const { result } = renderHook(() => useDiscount([]));
    expect(result.current.getDiscountForQuantity(5, 10000)).toBeNull();
  });

  it('returns null for quantity < 1', () => {
    const { result } = renderHook(() => useDiscount(mockRules));
    expect(result.current.getDiscountForQuantity(0, 10000)).toBeNull();
  });

  it('returns null when quantity is below first tier', () => {
    const { result } = renderHook(() => useDiscount(mockRules));
    expect(result.current.getDiscountForQuantity(2, 10000)).toBeNull();
  });

  it('applies tier 1 discount (10%) for quantity 3-5', () => {
    const { result } = renderHook(() => useDiscount(mockRules));
    const discount = result.current.getDiscountForQuantity(4, 10000);
    expect(discount).not.toBeNull();
    expect(discount!.discount).toBe(10);
    expect(discount!.discountedPrice).toBe(9000);
  });

  it('applies tier 2 discount (20%) for quantity 6-10', () => {
    const { result } = renderHook(() => useDiscount(mockRules));
    const discount = result.current.getDiscountForQuantity(8, 10000);
    expect(discount).not.toBeNull();
    expect(discount!.discount).toBe(20);
    expect(discount!.discountedPrice).toBe(8000);
  });

  it('applies tier 3 discount (30%) for quantity 11+', () => {
    const { result } = renderHook(() => useDiscount(mockRules));
    const discount = result.current.getDiscountForQuantity(15, 10000);
    expect(discount).not.toBeNull();
    expect(discount!.discount).toBe(30);
    expect(discount!.discountedPrice).toBe(7000);
  });

  it('returns null when discount_value is 0', () => {
    const zeroRules: DiscountRule[] = [
      { id: 1, min_quantity: 1, max_quantity: 10, discount_value: 0, name: 'No discount', discount_type: 'percentage' },
    ];
    const { result } = renderHook(() => useDiscount(zeroRules));
    expect(result.current.getDiscountForQuantity(5, 10000)).toBeNull();
  });

  it('handles unsorted rules correctly', () => {
    const unsortedRules: DiscountRule[] = [
      { id: 2, min_quantity: 6, max_quantity: 10, discount_value: 20, name: 'Tier 2', discount_type: 'percentage' },
      { id: 1, min_quantity: 3, max_quantity: 5, discount_value: 10, name: 'Tier 1', discount_type: 'percentage' },
    ];
    const { result } = renderHook(() => useDiscount(unsortedRules));
    const discount = result.current.getDiscountForQuantity(4, 10000);
    expect(discount!.discount).toBe(10);
  });
});
