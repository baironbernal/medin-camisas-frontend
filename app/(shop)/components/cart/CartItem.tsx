'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';

import { useCartStore } from '@/app/store/useCartStore'
import { Variant } from "@/types/variant";
import { Trash, Plus, Minus } from 'lucide-react';
import { getImageUrl } from "@/app/lib/image";
import { formatCOP } from "@/app/lib/formatPrice";
import { toast } from '@/app/lib/toast';
import { CalculatedItem } from '@/app/services/cart';


interface CartItemProps {
  product: Variant;
  calculatedItem: CalculatedItem | null;
}

export default function CartItem({ product, calculatedItem }: CartItemProps) {

  const removeFromCart = useCartStore(state => state.removeFromCart)
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const setQuantity = useCartStore(state => state.setQuantity)

  const displayName = product.product_name || `Producto #${product.product_id}`
  const displayImages = product.product_images || product.images
  const quantity = product.quantity || 1
  const productStock = product.stock ?? Infinity

  // Use backend-calculated prices when available, fall back to base price
  const basePrice = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0
  const effectiveUnitPrice     = calculatedItem?.unit_price          ?? basePrice
  const discountedUnitPrice    = calculatedItem?.discounted_unit_price ?? effectiveUnitPrice
  const discountedTotalPrice   = calculatedItem?.discounted_total_price ?? (discountedUnitPrice * quantity)
  const hasDiscount            = discountedUnitPrice < effectiveUnitPrice
  const hasLargeSizeSurcharge  = calculatedItem?.has_large_size_surcharge ?? false
  const surchargeAmount        = calculatedItem?.surcharge_amount ?? 0

  const [inputValue, setInputValue] = useState(quantity.toString());

  useEffect(() => {
    setInputValue(quantity.toString());
  }, [quantity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (!/^\d*$/.test(rawValue)) return;

    setInputValue(rawValue);

    if (rawValue === '') return;

    const parsedValue = parseInt(rawValue, 10);

    if (parsedValue <= 0) return;

    if (parsedValue > productStock) {
      toast(`Solo hay ${productStock} unidades en stock.`, 'error');
      setInputValue(productStock.toString());
      setQuantity(product.id, productStock);
      return;
    }

    setQuantity(product.id, parsedValue);
  };

  const handleBlur = () => {
    if (inputValue === '' || parseInt(inputValue, 10) === 0) {
      setInputValue(quantity.toString());
    }
  }

  const handleIncrease = () => {
    if (quantity >= productStock) {
      toast(`Solo hay ${productStock} unidades en stock.`, 'error');
      return;
    }
    updateQuantity(product.id, 1);
  };


  return (
    <li className="flex gap-3 py-4 items-start">
      {/* Product Image */}
      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        {displayImages && displayImages.length > 0 ? (
          <Image
            src={getImageUrl(displayImages[0])}
            alt={displayName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            Sin imagen
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="min-w-0">
          <h3 className="font-medium text-md text-primary">
            {displayName}
          </h3>

          {/* Unit Price */}
          <article className="py-4">
            {product.combination_name && (
              <p className="text-xs text-gray-500 truncate">{product.combination_name}</p>
            )}
            {hasDiscount ? (
              <>
                <p className="text-xs line-through text-secondary">Antes: {formatCOP(effectiveUnitPrice)}</p>
                <p className="text-xs font-semibold text-green-600">Con descuento: {formatCOP(discountedUnitPrice)}</p>
              </>
            ) : (
              <p className="text-sm font-medium text-primary">{formatCOP(effectiveUnitPrice)}</p>
            )}
            {hasLargeSizeSurcharge && surchargeAmount > 0 && (
              <p className="text-xs text-amber-600">+{formatCOP(surchargeAmount)} recargo talla grande</p>
            )}
          </article>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between items-end">
          <div className="flex items-center justify-between gap-1">
            <button
              className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              onClick={() => updateQuantity(product.id, -1)}
            >
              <Minus size={14} className="text-gray-600" />
            </button>
            <input type="text" value={inputValue} onChange={handleInputChange} onBlur={handleBlur} className="w-10 py-1 text-center text-sm text-primary border border-transparent focus:border-gray-200 rounded outline-none transition-colors" pattern="[0-9]*" />
            <button
              className={`w-7 h-7 flex items-center justify-center border border-gray-200 rounded transition-colors ${
                quantity >= productStock
                  ? 'opacity-50 cursor-not-allowed bg-gray-100'
                  : 'hover:bg-gray-50 cursor-pointer'
              }`}
              onClick={handleIncrease}
              disabled={quantity >= productStock}
            >
              <Plus size={14} className={quantity >= productStock ? 'text-gray-400' : 'text-gray-600'} />
            </button>
          </div>
        </div>
      </div>

      {/* Total Price */}
      <div className="flex flex-col justify-between items-end">
        <span className="text-sm font-semibold text-primary">{formatCOP(discountedTotalPrice)}</span>
        <button
          title="Eliminar producto"
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
          onClick={() => removeFromCart(product.id)}
        >
          <Trash size={16} />
        </button>
      </div>
    </li>
  )
}
