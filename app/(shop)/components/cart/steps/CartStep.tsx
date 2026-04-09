'use client';

import { ShoppingBag, ArrowRight, MessageCircle, AlertTriangle } from 'lucide-react';
import { formatCOP } from '@/app/lib/formatPrice';
import CartItem from '../CartItem';
import { Variant } from '@/types/variant';
import { CartCalculationResult, LargeSizeAnalysis } from '@/app/services/cart';

interface CartStepProps {
  cart: Variant[];
  total: number;
  originalTotal: number;
  isLoggedIn: boolean;
  handleProceed: () => void;
  largeSizeAnalysis: LargeSizeAnalysis;
  calculatedData: CartCalculationResult | null;
  handleWhatsAppOrder: () => void;
  whatsappLoading: boolean;
  error: string;
}

export default function CartStep({
  cart,
  total,
  originalTotal,
  isLoggedIn,
  handleProceed,
  largeSizeAnalysis,
  calculatedData,
  handleWhatsAppOrder,
  whatsappLoading,
  error,
}: CartStepProps) {
  // Build a map for O(1) lookup of calculated item by variant id
  const calculatedItemsMap = new Map(
    (calculatedData?.items ?? []).map(item => [item.product_variant_id, item])
  );

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
            <div className="bg-green-50 border text-green-800 px-4 py-2 rounded-lg text-xs text-center shadow-sm">
              Despues de <b>6</b> unidades precio emprendedor (LLEVA MÁS DE 11 PARA PRECIO MAYORISTA)
            </div>

            {largeSizeAnalysis.triggers && (
              <div className="bg-amber-50 border border-amber-300 text-amber-800 px-4 py-3 rounded-lg text-xs shadow-sm flex gap-2 items-start">
                <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 text-amber-500" />
                <span>
                  <b>Recargo tallas grandes activo</b> — el {Math.round(largeSizeAnalysis.proportion * 100)}% de tu
                  pedido son tallas grandes (XL, XXL, 2XL o superiores). Se aplica un recargo de{' '}
                  <b>{formatCOP(largeSizeAnalysis.surcharge_per_item)}</b> por cada prenda de talla grande.
                  Combina con tallas más pequeñas para evitar el recargo.
                </span>
              </div>
            )}

            <ul className="space-y-4">
              {cart.map((product) => (
                <CartItem
                  key={product.id}
                  product={product}
                  calculatedItem={calculatedItemsMap.get(product.id) ?? null}
                />
              ))}
            </ul>
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="sticky bottom-0 bg-accent-light border-t border-gray-200 px-6 py-4 flex flex-col gap-3">
          {error && (
            <p className="text-xs text-red-600 text-center">{error}</p>
          )}
          <div className="flex justify-between items-center">
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
          <button
            onClick={handleWhatsAppOrder}
            disabled={whatsappLoading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {whatsappLoading ? (
              'Creando pedido...'
            ) : (
              <>
                <MessageCircle size={16} />
                Crear pedido en WhatsApp
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}
