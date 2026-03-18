'use client';

import { CheckCircle2 } from 'lucide-react';
import { formatCOP } from '@/app/lib/formatPrice';

interface SuccessStepProps {
  orderNumber: string;
  orderTotal: string;
  onClose: () => void;
}

export function SuccessStep({
  orderNumber,
  orderTotal,
  onClose,
}: SuccessStepProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle2 size={36} className="text-green-600" />
      </div>
      <h3 className="font-heading text-xl font-bold text-primary">
        ¡Pedido confirmado!
      </h3>
      <p className="text-secondary text-sm">
        Tu pedido <span className="font-semibold text-primary">{orderNumber}</span> fue registrado correctamente.
      </p>
      {orderTotal && (
        <p className="text-sm text-secondary">
          Total: <span className="font-semibold text-primary">{formatCOP(Number(orderTotal))}</span>
        </p>
      )}
      <p className="text-secondary text-xs mt-1">
        Nos pondremos en contacto contigo pronto para coordinar la entrega.
      </p>
      <button
        id="btn-close-success"
        onClick={onClose}
        className="mt-4 w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-purple transition-colors"
      >
        Cerrar
      </button>
    </div>
  );
}
