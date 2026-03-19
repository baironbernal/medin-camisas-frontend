'use client'

import { useCartStore } from "@/app/hooks/useCartStore"
import { Variant } from "@/types/variant";
import { Trash, Plus, Minus } from 'lucide-react';
import { getImageUrl } from "@/app/lib/image";
import { formatCOP } from "@/app/lib/formatPrice";
import { useDiscountRules } from "@/app/useContext/DiscountRuleContext";
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

const toast = (text: string, type: 'success' | 'error') => {
  Toastify({
    text,
    duration: 3000,
    close: true,
    gravity: 'top',
    position: 'right',
    stopOnFocus: true,
    style: {
      background: type === 'success'
        ? 'linear-gradient(135deg, #2d2d5e, #4b4b9e)'
        : 'linear-gradient(135deg, #c0392b, #e74c3c)',
      borderRadius: '12px',
      padding: '12px 20px',
      fontFamily: 'inherit',
      fontSize: '14px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    },
  }).showToast();
};


export default function CartItem({ product }: { product: Variant }) {
  const removeFromCart = useCartStore(state => state.removeFromCart)
  const updateQuantity = useCartStore(state => state.updateQuantity)

  const { getDiscountForQuantity } = useDiscountRules();

  const displayName = product.product_name || `Producto #${product.product_id}`
  const displayImages = product.product_images || product.images
  const basePrice = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0
  const quantity = product.quantity || 1

  const discountInfo = getDiscountForQuantity(quantity, basePrice);
  const hasDiscount = discountInfo && discountInfo.discount > 0;
  const finalUnitPrice = hasDiscount ? discountInfo.discountedPrice : basePrice;
  const finalTotalPrice = finalUnitPrice * quantity;

  const productStock = product.stock ?? Infinity;

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
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        {displayImages && displayImages.length > 0 ? (
          <img
            src={getImageUrl(displayImages[0])}
            alt={displayName}
            className="w-full h-full object-cover"
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
                <p className="text-xs !line-through text-secondary ">Antes: {formatCOP(basePrice)}</p>
                <p className="text-xs font-semibold text-green-600">Con descuento: {formatCOP(finalUnitPrice)}</p>
              </>
            ) : (
              <p className="text-sm font-medium text-primary">{formatCOP(basePrice)}</p>
            )}
          </article>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between items-end">
          <div className="flex items-center gap-1">
            <button
              className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              onClick={() => updateQuantity(product.id, -1)}
            >
              <Minus size={14} className="text-gray-600" />
            </button>
            <span className="text-sm font-medium w-8 text-center text-primary">{quantity}</span>
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
        <span className="text-sm font-semibold text-primary">{formatCOP(finalTotalPrice)}</span>
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
