'use client';

import { Loader2, ArrowRight } from 'lucide-react';
import { formatCOP } from '@/app/lib/formatPrice';
import { Input } from '@/app/components';

import { FormState } from '@/app/hooks/useCartSidebar';
import { Variant } from '@/types/variant';

interface CheckoutFormStepProps {
  error: string;
  loading: boolean;
  formState: FormState;
  setField: (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckout: (e: React.FormEvent) => void;
  cart: Variant[];
  getDiscountForQuantity: (quantity: number, basePrice: number) => { discount: number; discountedPrice: number } | null;
  total: number;
}

export default function CheckoutFormStep({
  error,
  loading,
  formState,
  setField,
  handleCheckout,
  cart,
  getDiscountForQuantity,
  total,
}: CheckoutFormStepProps) {
  const inputClass =
    'w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm';

  return (
    <div className="flex-1 px-6 py-4 overflow-y-auto">
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
        <Input
          label="Nombre completo *"
          id="checkout-name"
          type="text"
          required
          value={formState.customer_name}
          onChange={setField('customer_name')}
          placeholder="Ej: Juan Pérez"
          className="bg-white py-2.5 px-3"
        />

        <Input
          label="Correo electrónico *"
          id="checkout-email"
          type="email"
          required
          value={formState.customer_email}
          onChange={setField('customer_email')}
          placeholder="tucorreo@ejemplo.com"
          className="bg-white py-2.5 px-3"
        />

        <Input
          label="Celular"
          id="checkout-phone"
          type="tel"
          value={formState.customer_phone}
          onChange={setField('customer_phone')}
          placeholder="Ej: 3001234567"
          className="bg-white py-2.5 px-3"
        />

        <div>
          <label className="block text-sm font-medium text-primary mb-1">Notas adicionales</label>
          <textarea
            id="checkout-notes"
            rows={3}
            value={formState.notes}
            onChange={setField('notes')}
            placeholder="Instrucciones especiales, dirección, etc."
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-2 mt-2">
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
            Resumen del pedido
          </p>
          {cart.map((p) => {
            const basePrice = Number(p.price);
            const quantity = p.quantity ?? 1;
            const discountInfo = getDiscountForQuantity(quantity, basePrice);
            const finalPrice = discountInfo && discountInfo.discount > 0 
              ? discountInfo.discountedPrice 
              : basePrice;
            
            return (
              <div key={p.id} className="flex justify-between text-sm text-primary">
                <span className="truncate max-w-[160px]">
                  {p.product_name || `Variante #${p.id}`} × {quantity}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  {finalPrice < basePrice && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatCOP(basePrice * quantity)}
                    </span>
                  )}
                  <span className="font-medium">
                    {formatCOP(finalPrice * quantity)}
                  </span>
                </div>
              </div>
            );
          })}
          <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-primary">
            <span>Total</span>
            <span>{formatCOP(total)}</span>
          </div>
        </div>

        <button
          id="btn-confirm-order"
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-purple transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
          {loading ? 'Procesando…' : 'Confirmar pedido'}
        </button>
      </form>
    </div>
  );
}
