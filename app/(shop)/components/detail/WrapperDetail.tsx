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
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/products/${product.slug}/colors-pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-secondary border border-gray-300 rounded-full px-5 py-2 hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Descargar colores
            </a>
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/products/${product.slug}/images-zip`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-secondary border border-gray-300 rounded-full px-5 py-2 hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              Descargar imágenes
            </a>
          </div>
        </FadeIn>

        <FadeIn animation="fadeInRight" duration={0.7} delay={0.2}>
          <div className="flex flex-col gap-8 lg:sticky lg:top-24 h-fit">

            <FadeIn animation="fadeInUp" delay={0.1}>
              <ProductInfo name={product.name} price={currentPrice} discount={currentDiscount} wholesalerPrice={product.wholesaler_price} />
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
