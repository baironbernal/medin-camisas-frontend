'use client'
import { useAnimatedOpen } from '@/app/hooks/useAnimatedOpen'
import { useCartStore } from '@/app/hooks/useCartStore'
import { Variant } from '@/types/variant'

interface Props {
    variant: Variant
    productName?: string
    productImages?: string[]
}

export const BtnAddToCart = ({variant, productName, productImages}: Props) => {
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
          product_images: productImages
        }); 
        openCart;
      }} className="bg-primary text-white px-4 py-2 hover:bg-secondary text-okine rounded-full cursor-pointer w-full">Agregar al carrito</button>

     
    </div>
  )
}
