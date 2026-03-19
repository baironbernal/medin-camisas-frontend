'use client';

import { CheckCircle2, Tag } from 'lucide-react';
import { formatCOP } from '@/app/lib/formatPrice';

interface OrderItemData {
  product_name: string;
  variant_sku: string;
  quantity: number;
  discount_rule_id: number | null;
  discount_percentage: number;
  unit_price: string;
  discounted_unit_price: string;
  total_price: string;
  discounted_total_price: string;
}

interface OrderData {
  total: string;
  subtotal_original: string;
  subtotal_discounted: string;
  total_discount: string;
  items: OrderItemData[];
}

interface SuccessStepProps {
  orderNumber: string;
  orderData: OrderData;
  onClose: () => void;
}

export default function SuccessStep({
  orderNumber,
  orderData,
  onClose,
}: SuccessStepProps) {
  const hasDiscounts = orderData.items.some(item => item.discount_percentage > 0);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="flex flex-col items-center justify-center px-6 py-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={36} className="text-green-600" />
        </div>
        <h3 className="font-heading text-xl font-bold text-primary mt-4">
          ¡Pedido confirmado!
        </h3>
        <p className="text-secondary text-sm">
          Tu pedido <span className="font-semibold text-primary">{orderNumber}</span> fue registrado correctamente.
        </p>
      </div>

      {/* Order Summary */}
      <div className="px-6 pb-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
          <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider">
            Resumen del pedido
          </h4>
          
          {orderData.items.map((item, index) => (
            <div key={index} className="space-y-1 pb-2 border-b border-gray-50 last:border-0">
              <div className="flex justify-between text-sm">
                <span className="text-primary truncate max-w-[180px]">
                  {item.product_name}
                </span>
                <span className="font-medium shrink-0 ml-2">
                  {formatCOP(Number(item.discounted_total_price))}
                </span>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>{item.quantity} × {formatCOP(Number(item.discounted_unit_price))}</span>
                {item.discount_percentage > 0 && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Tag size={10} />
                    <span>-{item.discount_percentage}%</span>
                  </div>
                )}
              </div>
              
              {item.discount_percentage > 0 && (
                <div className="text-xs text-gray-400 line-through">
                  {formatCOP(Number(item.total_price))}
                </div>
              )}
            </div>
          ))}

          <div className="border-t border-gray-200 pt-2 space-y-1">
            {hasDiscounts && (
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span className="line-through">{formatCOP(Number(orderData.subtotal_original))}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>Descuento</span>
              <span className="text-green-600">-{formatCOP(Number(orderData.total_discount))}</span>
            </div>
            <div className="flex justify-between font-bold text-primary pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{formatCOP(Number(orderData.total))}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <p className="text-secondary text-xs text-center mb-4">
          Nos pondremos en contacto contigo pronto para coordinar la entrega.
        </p>
        <button
          id="btn-close-success"
          onClick={onClose}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-purple transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
