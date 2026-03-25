import Image from 'next/image';
import type { Product } from '@/types/product';
import { getImageUrl } from '@/app/lib/image';
import Link from 'next/link';
import { formatCOP } from '@/app/lib/formatPrice';

interface ProductItemProps {
  product: Product;
}

function ProductItem({ product }: ProductItemProps) {
  // 1. Pre-calculamos el precio para evitar lógica pesada en el JSX
  const price = typeof product.base_price === 'string' 
    ? parseInt(product.base_price, 10) 
    : product.base_price;

  return (
    <div className="group flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-1 gap-20">
      <Link href={`/producto/${product.slug}`} className="block">
        <div className="relative w-full h-[25rem] overflow-hidden rounded-lg shadow-xl">
          <Image
            unoptimized
            src={getImageUrl(product.images?.[0])}
            alt={`Imagen de ${product.name}`}
            fill // Usar fill + aspect-square es más flexible en Next.js
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        <section className='flex justify-between items-start pt-4 px-2'>
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-dark line-clamp-1">{product.name}</h3>
            <p className="font-medium text-secondary">
              {formatCOP(price)}
            </p>
          </div>
          {/* Badge dynamic colors */}
          {product.colors_count && product.colors_count > 1 && (
            <span className='px-2 py-1 text-gray-500'>
              {product.colors_count} colores
            </span>
          )}
        </section>
      </Link>
    </div>
  );
}

export default ProductItem;