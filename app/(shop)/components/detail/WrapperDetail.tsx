'use client'

import { useRef, useEffect, useState } from 'react';
import { ProductDetail } from '@/types/product-detail';
import { useProductDetail } from '@/app/hooks/useProductDetail';
import { useProductPricing } from '@/app/hooks/useProductPricing';
import { useCartStore } from '@/app/store/useCartStore';
import { FadeIn, Breadcrumb } from '@/app/components';
import GalleryDetail from '../gallery/Gallery';
import ProductInfo from './ProductInfo';
import ColorSelector from './ColorSelector';
import SizeSelector from './SizeSelector';
import QuantitySelector from './QuantitySelector';
import ProductActions from './ProductActions';
import ProductDescription from './ProductDescription';
import ProductItem from '@/app/components/home/products/ProductItem';
import { Product } from '@/types/product';


interface ProductDetailProps {
  product: ProductDetail;
  interestedProducts: Product[];
}

export const WrapperDetail = ({ product, interestedProducts }: ProductDetailProps) => {
  const {
    colors, sizes, availableSizes,
    selectedColor, selectedSize, selectedVariant,
    currentImages, currentPrice, isComplete, exactKey,
    selectColor, selectSize,
    quantityAvailable, remainingStock, inCartQuantity,
    quantitySelected, setQuantitySelected,
  } = useProductDetail(product);

  const openCart = useCartStore(state => state.openCart);

  const { currentDiscount, nextTierDiscount } = useProductPricing(
    selectedVariant?.id ?? null,
    quantitySelected,
    quantityAvailable,
  );

  const nextTierQuantity = quantitySelected + 1;

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
    ...(product.brand ? [{ label: product.brand }] : []),
    { label: product.name },
  ];

  const sharedActionProps = {
    isComplete,
    selectedVariant,
    remainingStock,
    quantityAvailable,
    quantitySelected,
    productName: product.name,
    productImages: currentImages ?? [],
    combinationName: exactKey,
  };

  return (
    <section className="w-full container mx-auto px-6 py-10 font-sans">
      <Breadcrumb items={breadcrumbItems} className="mb-8" />

      {/* Mobile-only: product name above the gallery */}
      <div className="block lg:hidden mb-4">
        <h1 className="text-3xl font-semibold text-primary">{product.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        <FadeIn animation="fadeInLeft" duration={0.7}>
          <GalleryDetail images={currentImages} />
        </FadeIn>

        <FadeIn animation="fadeInRight" duration={0.7} delay={0.2}>
          <div className="flex flex-col gap-8 lg:sticky lg:top-24 h-fit">

            <FadeIn animation="fadeInUp" delay={0.1}>
              <ProductInfo name={product.name} price={currentPrice} discount={currentDiscount} />
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

            <ProductDescription description={product.description} />

          </div>
        </FadeIn>
      </div>

      {interestedProducts && interestedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-primary text-center mb-8">Productos relacionados</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {interestedProducts.map((p) => (
              <ProductItem key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </section>
  );
};
