'use client'

import { useCartStore } from "@/app/hooks/useCartStore"
import { Product } from "@/types/product"
import { Trash, Plus, Minus } from 'lucide-react';
import Image from "next/image";


export default function CartItem({ product }: { product: Product }) {
  const removeFromCart = useCartStore(state => state.removeFromCart)
  const addToCart = useCartStore(state => state.addToCart)

  return (
    <li className='flex gap-4 pb-4 border-b border-gray-200 text-black'>
      {/* Product Image */}
      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            width={80}
            height={80}
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
          <h3 className="font-medium text-sm line-clamp-2 text-black">{product.name}</h3>
          <p className="text-sm text-gray-600 mt-1">${parseInt(product.cost).toLocaleString()}</p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            onClick={() => {
              removeFromCart(product.id)
            }}
          >
            <Minus size={12} />
          </button>
          <span className="text-sm font-medium w-8 text-center">{product.quantity || 1}</span>
          <button
            className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            onClick={() => addToCart(product)}
          >
            <Plus size={12} />
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
          <Trash size={16} />
        </button>
        <p className="text-sm font-semibold">
          ${(parseInt(product.cost) * (product.quantity || 1)).toLocaleString()}
        </p>
      </div>
    </li>
  )
}