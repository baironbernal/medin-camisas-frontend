'use client'

import { useCartStore } from "@/app/hooks/useCartStore";
import CartItem from "./cartItem";
import { X } from 'lucide-react';

interface CartSidebarProps {
  onClose: () => void;
  isClosing: boolean;
}

export default function CartSidebar({ onClose, isClosing }: CartSidebarProps) {
  const cart = useCartStore(state => state.cart);
  
  // Calculate the total price of the products in the cart
  const total = cart.reduce((acc, product) => acc + parseInt(product.cost) * (product.quantity as number), 0);

  return (
    <>
      {/* Backdrop Overlay */}
      <div 
        className={`fixed inset-0 text-black bg-black/30 z-10 transition-opacity ${
          isClosing ? 'animate__animated animate__fadeOut animate__faster' : 'animate__animated animate__fadeIn animate__faster'
        }`}
        onClick={onClose}
      />

      {/* Cart Sidebar */}
      <section className={`mx-auto w-full bg-accent-light max-w-sm fixed right-0 h-screen z-20 top-0 overflow-y-auto shadow-2xl flex flex-col ${
        isClosing ? 'animate__animated animate__slideOutRight animate__faster' : 'animate__animated animate__slideInRight animate__faster'
      }`}>
        {/* Header */}
        <div className="sticky top-0 bg-accent-light border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="font-utendo font-bold text-xl text-black">Filtros</h2>
            <button onClick={() => onClose()} className="cursor-pointer p-2 ">
              <X size={20} color="black" />
            </button>
          </div>
    
        {/* Cart Items */}
        <div className="flex-1 px-6 py-4 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-gray-500 mb-2 text-black">Tu carrito está vacío</p>
              <p className="text-sm text-gray-400">Agrega productos para comenzar</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.map(product => (
                <CartItem key={product.id} product={product} />
              ))}
            </ul>
          )}
        </div>

        {/* Footer with Total */}
        {cart.length > 0 && (
          <div className="sticky bottom-0 bg-accent-light border-t border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold">${total.toLocaleString()}</span>
            </div>
            <button className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Proceder al pago
            </button>
          </div>
        )}
      </section>
    </>
  );
}