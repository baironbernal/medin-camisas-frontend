'use client'
import { useAnimatedOpen } from '@/app/hooks/useAnimatedOpen'
import { useCartStore } from '@/app/hooks/useCartStore'
import { Product } from '@/types/product'

interface Props {
    product: Product
}

export const BtnAddToCart = ({product}: Props) => {
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
        addFromCart(product); 
        openCart;
      }} className="bg-primary text-white px-4 py-2 hover:bg-secondary text-okine rounded-full cursor-pointer w-full">Agregar al carrito</button>

     
    </div>
  )
}
