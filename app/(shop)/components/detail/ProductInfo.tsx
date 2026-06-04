import { formatCOP } from '@/app/lib/formatPrice';

interface ProductInfoProps {
  name: string;
  price: number;
  discount: { discount: number; discountedPrice: number } | null;
  wholesalerPrice?: string | null;
}

export default function ProductInfo({ name, price, discount, wholesalerPrice }: ProductInfoProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="hidden lg:block text-3xl font-semibold text-primary">{name}</h1>
      {discount && discount.discount > 0 ? (
        <p className="text-lg text-gray-400 line-through">{formatCOP(price)}</p>
      ) : (
        <p className="text-2xl font-medium text-primary">{formatCOP(price)}</p>
      )}
      {wholesalerPrice && (
        <p className="text-sm font-medium text-primary">
          Precio mayorista: {formatCOP(wholesalerPrice)}
        </p>
      )}
    </div>
  );
}
