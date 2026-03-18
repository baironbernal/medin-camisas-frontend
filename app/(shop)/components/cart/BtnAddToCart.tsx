'use client'
import { useCartStore } from '@/app/hooks/useCartStore'
import { Variant } from '@/types/variant'
import { useAnimatedOpen } from '@/app/hooks/useAnimatedOpen'
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

interface Props {
  variant: Variant
  productName?: string
  productImages?: string[]
  combinationName?: string
  quantitySelected: number
  remainingStock: number
}

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
  }).showToast()
}

export default function BtnAddToCart({
  variant,
  productName,
  productImages,
  combinationName,
  quantitySelected,
  remainingStock,
}: Props) {
  const addToCart = useCartStore(state => state.addToCart)
  const { open: openCart } = useAnimatedOpen()

  const handleAdd = () => {
    if (quantitySelected > remainingStock) {
      toast(
        `Solo puedes agregar ${remainingStock} unidad${remainingStock !== 1 ? 'es' : ''} más de este producto.`,
        'error'
      )
      return
    }

    if (remainingStock <= 0) {
      toast('No hay stock disponible para agregar al carrito.', 'error')
      return
    }

    addToCart({
      ...variant,
      product_name: productName,
      product_images: productImages,
      combination_name: combinationName,
      quantity: quantitySelected,
    })

    toast(
      `✓ ${quantitySelected} unidad${quantitySelected !== 1 ? 'es' : ''} de "${productName}" agregada${quantitySelected !== 1 ? 's' : ''} al carrito.`,
      'success'
    )

    openCart()
  }

  return (
    <div>
      <button
        onClick={handleAdd}
        className="w-full bg-primary text-white font-medium py-3 rounded-full hover:bg-purple transition-colors duration-200"
      >
        Agregar al carrito
      </button>
    </div>
  )
}
