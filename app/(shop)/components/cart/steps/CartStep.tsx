'use client';

import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatCOP } from '@/app/lib/formatPrice';
import CartItem from '../CartItem';

import { Variant } from '@/types/variant';

interface CartStepProps {
  cart: Variant[];
  total: number;
  originalTotal: number;
  isLoggedIn: boolean;
  handleProceed: () => void;
}

export default function CartStep({
  cart,
  total,
  originalTotal,
  isLoggedIn,
  handleProceed,
}: CartStepProps) {
  return (
    <>
      <div className="flex-1 px-6 py-4 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3">
            <ShoppingBag size={48} className="text-gray-300" />
            <p className="text-primary font-medium">Tu carrito está vacío</p>
            <p className="text-sm text-secondary">Agrega productos para comenzar</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="bg-green-50 border  text-green-800 px-4 py-2 rounded-lg text-xs text-center shadow-sm">
              Despues de <b>6</b> unidades precio emprendedor (LLEVA MÁS DE 11 PARA PRECIO MAYORISTA)
            </div>
            <ul className="space-y-4">
              {cart.map((product) => (
                <CartItem key={product.id} product={product} />
              ))}
            </ul>
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="sticky bottom-0 bg-accent-light border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-base font-medium text-primary">Total</span>
            <div className="text-right">
              {total < originalTotal && (
                <span className="text-sm text-gray-400 line-through block">
                  {formatCOP(originalTotal)}
                </span>
              )}
              <span className="text-xl font-bold text-primary">
                {formatCOP(total)}
              </span>
            </div>
          </div>
          <button
            id="btn-proceed-checkout"
            onClick={handleProceed}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-purple transition-colors flex items-center justify-center gap-2"
          >
            {isLoggedIn ? 'Proceder al pago' : 'Inicia sesión para comprar'}
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </>
  );
}
