'use client';

import { Variant } from '@/types/variant';
import BtnAddToCart from '../cart/BtnAddToCart';

interface FloatingAddToCartProps {
  show: boolean;
  isComplete: boolean;
  selectedVariant: Variant | null;
  remainingStock: number;
  quantityAvailable: number;
  quantitySelected: number;
  productName: string;
  productImages: string[];
  combinationName: string;
}

export default function FloatingAddToCart({
  show,
  isComplete,
  selectedVariant,
  remainingStock,
  quantityAvailable,
  quantitySelected,
  productName,
  productImages,
  combinationName,
}: FloatingAddToCartProps) {
  if (!show) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-white border-t border-gray-100 shadow-lg">
      {isComplete ? (
        <BtnAddToCart
          variant={selectedVariant!}
          quantitySelected={quantitySelected}
          remainingStock={remainingStock}
          totalStock={quantityAvailable}
          productName={productName}
          productImages={productImages}
          combinationName={combinationName}
        />
      ) : (
        <button disabled className="w-full bg-gray-300 text-gray-500 py-3 rounded-full cursor-not-allowed">
          {selectedVariant && remainingStock === 0 ? 'Sin stock disponible' : 'Seleccionar opciones'}
        </button>
      )}
    </div>
  );
}
