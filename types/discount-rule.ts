export type DiscountRules = DiscountRule[]

export interface DiscountRule {
  id: number
  name: string
  min_quantity: number
  max_quantity?: number
  discount_type: string
  discount_value: number
}