'use client'

import { useCartStore } from "@/app/hooks/useCartStore"
import { Variant } from "@/types/variant";
import { Trash, Plus, Minus } from 'lucide-react';
import { getImageUrl } from "@/app/lib/image";
import { formatCOP } from "@/app/lib/formatPrice";


export default function CartItem({ product }: { product: Variant }) {
  const removeFromCart = useCartStore(state => state.removeFromCart)
  const addToCart = useCartStore(state => state.addToCart)
  const decreaseQuantity = useCartStore(state => state.decreaseQuantity)

  const displayName = product.product_name || `Producto #${product.product_id}`
  const displayImages = product.product_images || product.images
  const displayPrice = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0

  return (
    <li className='flex gap-4 pb-4 border-b border-gray-200 text-black'>
      {/* Product Image */}
      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-medium text-sm line-clamp-2 text-black leading-tight">
            {displayName}
          </h3>
          {product.combination_name && (
            <p className="text-xs text-gray-500 mt-0.5">{product.combination_name}</p>
          )}
          <p className="text-sm text-gray-800 font-medium mt-1">{formatCOP(displayPrice)}</p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            onClick={() => {
              decreaseQuantity(product.id)
            }}
          >
            <Minus size={12} className="cursor-pointer" />
          </button>
          <span className="text-sm font-medium w-8 text-center">{product.quantity || 1}</span>
          <button
            className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            onClick={() => addToCart(product)}
          >
            <Plus size={12} className="cursor-pointer"/>
          </button>
        </div>
      </div>

      {/* Remove Button */}
      <div className="flex flex-col justify-between items-end">
        <button
          title='Eliminar producto'
          className='text-gray-400 hover:text-red-500 transition-colors'
          onClick={() => removeFromCart(product.id)}
        >
          <Trash size={16}  className="cursor-pointer"/>
        </button>
        <p className="text-sm font-semibold">
          {formatCOP(displayPrice * (product.quantity || 1))}
        </p>
      </div>
    </li>
  )
}