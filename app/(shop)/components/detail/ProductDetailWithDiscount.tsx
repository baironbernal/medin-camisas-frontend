'use client';

import { ProductDetail } from '@/types/product-detail';
import { DiscountRulesLoader } from "@/app/useContext/DiscountRulesLoader";
import { WrapperDetail } from "./WrapperDetail";

interface ProductDetailWithDiscountProps {
  data: ProductDetail;
}

export default function ProductDetailWithDiscount({ data }: ProductDetailWithDiscountProps) {
  return (
    <DiscountRulesLoader>
      <WrapperDetail data={data} />
    </DiscountRulesLoader>
  );
}
