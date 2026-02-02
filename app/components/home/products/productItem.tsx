import Image from 'next/image';
import type { Product } from '@/types/product';
import { getImageUrl } from '@/app/lib/image';

interface ProductItemProps {
  product: Product;
}

function ProductItem({ product }: ProductItemProps) {
  
  return (
    <div className="flex flex-col rounded-full">
      
        <Image
          unoptimized
          src={getImageUrl(product.images?.[0])}
          alt={product.name}
          width={300}
          height={300}
          className="aspect-square object-cover rounded-lg w-full"
        />
      
      <section className='flex justify-between items-start p-4'>
        <div>
          <h3 className="font-semibold text-dark">{product.name}</h3>
          <p className="text-sm text-secondary">{product.base_price}</p>
        </div>
        <p className='text-xs'>3 colores</p>
      </section>
    </div>
  );
}

export default ProductItem;
