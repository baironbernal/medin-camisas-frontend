'use client'
import { useCartStore } from '@/app/hooks/useCartStore'
import { Variant } from '@/types/variant'
import { useAnimatedOpen } from '@/app/hooks/useAnimatedOpen'
import { toast } from '@/app/lib/toast'

interface Props {
  variant: Variant
  productName?: string
  productImages?: string[]
  combinationName?: string
  quantitySelected: number
  remainingStock: number
  totalStock: number
}



export default function BtnAddToCart({
  variant,
  productName,
  productImages,
  combinationName,
  quantitySelected,
  remainingStock,
  totalStock,
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
      stock: totalStock,
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
