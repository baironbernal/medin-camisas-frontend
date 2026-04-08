'use client'

import { useRef, useEffect, useState } from 'react';
import { ProductDetail } from '@/types/product-detail';
import { useProductDetail } from '@/app/hooks/useProductDetail';
import { useDiscount } from '@/app/hooks/useDiscount';
import { useDiscountRules } from '@/app/useContext/DiscountRuleContext';
import { useCartStore } from '@/app/store/useCartStore';
import { FadeIn, Breadcrumb } from '@/app/components';
import GalleryDetail from '../gallery/Gallery';
import ProductInfo from './ProductInfo';
import ColorSelector from './ColorSelector';
import SizeSelector from './SizeSelector';
import QuantitySelector from './QuantitySelector';
import ProductActions from './ProductActions';
import ProductDescription from './ProductDescription';
import FloatingAddToCart from './FloatingAddToCart';

interface ProductDetailProps {
  data: ProductDetail;
}

export const WrapperDetail = ({ data }: ProductDetailProps) => {
  const {
    colors, sizes, availableSizes,
    selectedColor, selectedSize, selectedVariant,
    currentImages, currentPrice, isComplete, exactKey,
    selectColor, selectSize,
    quantityAvailable, remainingStock, inCartQuantity,
    quantitySelected, setQuantitySelected,
  } = useProductDetail(data);

  const openCart = useCartStore(state => state.openCart);
  const { rules } = useDiscountRules();
  const { getDiscountForQuantity } = useDiscount(rules);

  const currentDiscount = getDiscountForQuantity(quantitySelected, currentPrice);
  const nextTierQuantity = quantitySelected + 1;
  const nextTierDiscount = nextTierQuantity <= quantityAvailable
    ? getDiscountForQuantity(nextTierQuantity, currentPrice)
    : null;

  const addToCartBtnRef = useRef<HTMLDivElement>(null);
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);

  useEffect(() => {
    const el = addToCartBtnRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowFloatingBtn(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    ...(data.brand ? [{ label: data.brand }] : []),
    { label: data.name },
  ];

  const sharedActionProps = {
    isComplete,
    selectedVariant,
    remainingStock,
    quantityAvailable,
    quantitySelected,
    productName: data.name,
    productImages: currentImages ?? [],
    combinationName: exactKey,
  };

  return (
    <section className="w-full container mx-auto px-6 py-10 font-sans">
      <Breadcrumb items={breadcrumbItems} className="mb-8" />

      {/* Mobile-only: product name above the gallery */}
      <div className="block lg:hidden mb-4">
        <h1 className="text-3xl font-semibold text-primary">{data.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        <FadeIn animation="fadeInLeft" duration={0.7}>
          <GalleryDetail images={currentImages} />
        </FadeIn>

        <FadeIn animation="fadeInRight" duration={0.7} delay={0.2}>
          <div className="flex flex-col gap-8 lg:sticky lg:top-24 h-fit">

            <FadeIn animation="fadeInUp" delay={0.1}>
              <ProductInfo name={data.name} price={currentPrice} discount={currentDiscount} />
            </FadeIn>

            <FadeIn animation="fadeInUp" delay={0.2}>
              <ColorSelector colors={colors} selectedColor={selectedColor} onSelect={selectColor} />
            </FadeIn>

            <FadeIn animation="fadeInUp" delay={0.3}>
              <SizeSelector
                sizes={sizes}
                availableSizes={availableSizes}
                selectedSize={selectedSize}
                onSelect={selectSize}
              />
            </FadeIn>

            {selectedSize && (
              <FadeIn animation="fadeInUp" delay={0.4}>
                <QuantitySelector
                  quantityAvailable={quantityAvailable}
                  remainingStock={remainingStock}
                  inCartQuantity={inCartQuantity}
                  quantitySelected={quantitySelected}
                  onChange={setQuantitySelected}
                  nextTierDiscount={nextTierDiscount}
                  nextTierQuantity={nextTierQuantity}
                />
              </FadeIn>
            )}

            <FadeIn animation="fadeInUp" delay={0.5}>
              <ProductActions {...sharedActionProps} btnRef={addToCartBtnRef} onBuyNow={openCart} />
            </FadeIn>

            <ProductDescription description={data.description} />

          </div>
        </FadeIn>
      </div>

      <FloatingAddToCart show={showFloatingBtn} {...sharedActionProps} />
    </section>
  );
};
