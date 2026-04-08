import { apiFetch } from './fetcher';
import { OrderRules } from '@/types/order-rules';

export function getOrderRules(): Promise<OrderRules> {
  return apiFetch<OrderRules>('/order-rules', {
    next: { revalidate: 3600 },
  });
}
