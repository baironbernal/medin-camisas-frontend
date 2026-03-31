'use client';

import { ProductDetail } from '@/types/product-detail';
import { WrapperDetail } from "./WrapperDetail";

interface ProductDetailWithDiscountProps {
  data: ProductDetail;
}

export default function ProductDetailWithDiscount({ data }: ProductDetailWithDiscountProps) {
  return <WrapperDetail data={data} />;
}
