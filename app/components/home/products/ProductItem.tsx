import Image from 'next/image';
import type { Product } from '@/types/product';
import { getImageUrl } from '@/app/lib/image';
import Link from 'next/link';
import { formatCOP } from '@/app/lib/formatPrice';

interface ProductItemProps {
  product: Product;
}

function ProductItem({ product }: ProductItemProps) {
  const hasSecondImage = product.images && product.images.length > 1;

  return (
    <div className="group flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-1 gap-6 lg:gap-20">
      <Link href={`/producto/${product.slug}`} className="block">
        <div className="relative w-full h-[16rem] lg:h-[25rem] overflow-hidden rounded-lg shadow-xl">
          <Image
            src={getImageUrl(product.images?.[0])}
            alt={`Imagen de ${product.name}`}
            fill
            className={`object-cover transition-all duration-500 ${
              hasSecondImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'
            }`}
          />
          {hasSecondImage && (
            <Image
              src={getImageUrl(product.images![1])}
              alt={`Imagen de ${product.name}`}
              fill
              className="object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
            />
          )}
        </div>
        
        <section className='flex lg:flex-row flex-col-reverse justify-between items-start pt-4 px-2'>
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-dark line-clamp-1">{product.name}</h3>
            <p className="font-medium text-secondary">
              {formatCOP(product.base_price)}
            </p>
          </div>
          {/* Badge dynamic colors */}
          {product.colors_count && product.colors_count > 1 && (
            <span className='lg:px-2 py-1 text-gray-500 text-xs lg:text-sm'>
              {product.colors_count} colores
            </span>
          )}
        </section>
      </Link>
    </div>
  );
}

export default ProductItem;