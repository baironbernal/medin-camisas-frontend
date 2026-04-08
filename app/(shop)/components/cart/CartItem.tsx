'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';

import { useCartStore } from '@/app/store/useCartStore'
import { Variant } from "@/types/variant";
import { Trash, Plus, Minus } from 'lucide-react';
import { getImageUrl } from "@/app/lib/image";
import { formatCOP } from "@/app/lib/formatPrice";
import { useDiscountRules } from "@/app/useContext/DiscountRuleContext";
import { toast } from '@/app/lib/toast';


interface CartItemProps {
  product: Variant;
  largeSizeActive?: boolean;
  isLargeSize?: boolean;
  surcharge?: number;
}

export default function CartItem({ product, largeSizeActive = false, isLargeSize = false, surcharge = 0 }: CartItemProps) {

  const removeFromCart = useCartStore(state => state.removeFromCart)
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const setQuantity = useCartStore(state => state.setQuantity)
  const cart = useCartStore(state => state.cart)

  const { getDiscountForQuantity } = useDiscountRules();

  const displayName = product.product_name || `Producto #${product.product_id}`
  const displayImages = product.product_images || product.images
  const basePrice = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0
  const quantity = product.quantity || 1

  const totalCartQuantity = cart.reduce((acc, p) => acc + (p.quantity as number), 0);
  const effectiveBasePrice = largeSizeActive && isLargeSize ? basePrice + surcharge : basePrice;
  const discountInfo = getDiscountForQuantity(totalCartQuantity, effectiveBasePrice);
  const hasDiscount = discountInfo && discountInfo.discount > 0;
  const discountedUnitPrice = hasDiscount ? discountInfo.discountedPrice : effectiveBasePrice;

  const productStock = product.stock ?? Infinity;

  const [inputValue, setInputValue] = useState(quantity.toString());

  useEffect(() => {
    setInputValue(quantity.toString());
  }, [quantity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const rawValue = e.target.value;

  // 1. Permitir solo números o vacío
  if (!/^\d*$/.test(rawValue)) return;

  setInputValue(rawValue);

  // 2. Si está vacío, no hacer nada más
  if (rawValue === '') return;

  const parsedValue = parseInt(rawValue, 10);

  // 3. Validar mínimo
  if (parsedValue <= 0) return;

  // 4. Validar stock máximo
  if (parsedValue > productStock) {
    toast(`Solo hay ${productStock} unidades en stock.`, 'error');

    const maxStockString = productStock.toString();
    setInputValue(maxStockString);
    setQuantity(product.id, productStock);
    return;
  }

  // 5. Caso válido
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
                <p className="text-xs line-through text-secondary">Antes: {formatCOP(effectiveBasePrice)}</p>
                <p className="text-xs font-semibold text-green-600">Con descuento: {formatCOP(discountedUnitPrice)}</p>
              </>
            ) : (
              <p className="text-sm font-medium text-primary">{formatCOP(effectiveBasePrice)}</p>
            )}
            {largeSizeActive && isLargeSize && (
              <p className="text-xs text-amber-600">+{formatCOP(surcharge)} recargo talla grande</p>
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
            <input type="text" value={inputValue} onChange={handleInputChange} onBlur={handleBlur} className="w-10 py-1 text-center text-sm text-primary border border-transparent focus:border-gray-200 rounded outline-none transition-colors"  pattern="[0-9]*" />
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
      <div className="flex flex-col justify-between items-end ">
        <span className="text-sm font-semibold text-primary">{formatCOP(discountedUnitPrice * quantity)}</span>
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
