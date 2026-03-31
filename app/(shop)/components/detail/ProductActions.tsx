'use client';

import { RefObject } from 'react';
import { Variant } from '@/types/variant';
import BtnAddToCart from '../cart/BtnAddToCart';

interface ProductActionsProps {
  isComplete: boolean;
  selectedVariant: Variant | null;
  remainingStock: number;
  quantityAvailable: number;
  quantitySelected: number;
  productName: string;
  productImages: string[];
  combinationName: string;
  onBuyNow: () => void;
  btnRef: RefObject<HTMLDivElement | null>;
}

export default function ProductActions({
  isComplete,
  selectedVariant,
  remainingStock,
  quantityAvailable,
  quantitySelected,
  productName,
  productImages,
  combinationName,
  onBuyNow,
  btnRef,
}: ProductActionsProps) {
  return (
    <div ref={btnRef}  className="flex flex-col gap-3 pt-4">
      {isComplete ? (
        <>
          <BtnAddToCart
            variant={selectedVariant!}
            quantitySelected={quantitySelected}
            remainingStock={remainingStock}
            totalStock={quantityAvailable}
            productName={productName}
            productImages={productImages}
            combinationName={combinationName}
          />
          <button
            onClick={onBuyNow}
            className="w-full bg-black cursor-pointer text-white font-medium py-3 rounded-full hover:opacity-80 transition-opacity duration-200"
          >
            Comprar ahora
          </button>
        </>
      ) : (
        <button disabled className="w-full bg-gray-300 text-gray-500 py-3 rounded-full cursor-not-allowed">
          {selectedVariant && remainingStock === 0 ? 'Sin stock disponible' : 'Seleccionar opciones'}
        </button>
      )}
    </div>
  );
}
