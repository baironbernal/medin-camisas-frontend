import { formatCOP } from '@/app/lib/formatPrice';

interface ProductInfoProps {
  name: string;
  price: number;
  discount: { discount: number; discountedPrice: number } | null;
}

export default function ProductInfo({ name, price, discount }: ProductInfoProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-semibold text-primary">{name}</h1>
      {discount && discount.discount > 0 ? (
        <p className="text-lg text-gray-400 line-through">{formatCOP(price)}</p>
      ) : (
        <p className="text-2xl font-medium text-primary">{formatCOP(price)}</p>
      )}
    </div>
  );
}
