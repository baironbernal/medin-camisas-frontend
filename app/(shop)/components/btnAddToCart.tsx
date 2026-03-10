'use client'
import { useAnimatedOpen } from '@/app/hooks/useAnimatedOpen'
import { useCartStore } from '@/app/hooks/useCartStore'
import { Variant } from '@/types/variant'

interface Props {
    variant: Variant
    productName?: string
    productImages?: string[]
    combinationName?: string
}

export const BtnAddToCart = ({variant, productName, productImages, combinationName}: Props) => {
    const addFromCart = useCartStore(state => state.addToCart)
      const { 
        isOpen: isCartOpen, 
        isClosing: isCartClosing, 
        open: openCart, 
        close: closeCart 
      } = useAnimatedOpen();
      
  return (
    <div>
      <button onClick={() => {
        addFromCart({
          ...variant,
          product_name: productName,
          product_images: productImages,
          combination_name: combinationName
        }); 
        openCart();
      }} className="w-full bg-primary text-white font-medium py-3 rounded-full hover:bg-purple transition-colors duration-200">Agregar al carrito</button>

     
    </div>
  )
}
