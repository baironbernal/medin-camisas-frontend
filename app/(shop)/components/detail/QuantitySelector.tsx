import { AlertCircle } from 'lucide-react';
import { formatCOP } from '@/app/lib/formatPrice';

interface QuantitySelectorProps {
  quantityAvailable: number;
  remainingStock: number;
  inCartQuantity: number;
  quantitySelected: number;
  onChange: (qty: number) => void;
  nextTierDiscount: { discount: number; discountedPrice: number } | null;
  nextTierQuantity: number;
}

export default function QuantitySelector({
  quantityAvailable,
  remainingStock,
  inCartQuantity,
  quantitySelected,
  onChange,
  nextTierDiscount,
  nextTierQuantity,
}: QuantitySelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      {quantityAvailable > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <p className="font-medium tracking-wide text-primary">
            Quedan <span className="text-secondary font-bold">{quantityAvailable}</span> unidades
          </p>
          {inCartQuantity > 0 && (
            <span className="text-xs text-gray-500">({inCartQuantity} ya en tu carrito)</span>
          )}
        </div>
      )}

      {quantityAvailable <= 0 ? (
        <p className="text-sm text-red-500 font-medium">Producto agotado.</p>
      ) : remainingStock > 0 ? (
        <select
          value={quantitySelected}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full border border-gray-300 rounded px-4 py-2"
        >
          {Array.from({ length: remainingStock }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      ) : (
        <p className="text-sm text-red-500 font-medium">Ya tienes el máximo disponible en tu carrito.</p>
      )}

      {nextTierDiscount && nextTierDiscount.discount > 0 && (
        <div className="bg-green-50 p-3 flex items-start gap-2">
          <AlertCircle size={18} className="text-green-600 mt-0.5 shrink-0" />
          <p className="text-sm text-green-800 font-medium">
            ¡Añade {nextTierQuantity - quantitySelected} unidad más por {formatCOP(nextTierDiscount.discountedPrice)}
          </p>
        </div>
      )}
    </div>
  );
}
