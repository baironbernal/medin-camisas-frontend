'use client';

import { FadeIn } from "@/app/components";
import { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  title: string;
}

export function ProductGrid({ products, title }: ProductGridProps) {
  return (
    <main className="w-full mx-auto">
      <FadeIn animation="fadeInUp">
        <h1 className="text-3xl font-heading mb-6 capitalize">
          {title}
        </h1>
      </FadeIn>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 2xl:gap-14 justify-center md:justify-start">
          {products.map((product, index) => (
            <FadeIn 
              key={product.id} 
              animation="fadeInUp" 
              delay={index * 0.1}
            >
              <div className="group flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-1">
                <a href={`/producto/${product.slug}`} className="block">
                  <div className="relative aspect-square overflow-hidden rounded-lg shadow-xl">
                    <img
                      src={product.images?.[0] ? `/api/images/${product.images[0]}` : '/placeholder.jpg'}
                      alt={`Imagen de ${product.name}`}
                      className="object-cover transition-transform duration-500 group-hover:scale-105 w-full h-full"
                    />
                  </div>
                  
                  <section className='flex justify-between items-start pt-4 px-2'>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-semibold text-dark line-clamp-1">{product.name}</h3>
                      <p className="font-medium text-secondary">
                        ${typeof product.base_price === 'string' ? product.base_price : product.base_price}
                      </p>
                    </div>
                    {product.colors_count && product.colors_count > 1 && (
                      <span className='px-2 py-1 text-gray-500'>
                        {product.colors_count} colores
                      </span>
                    )}
                  </section>
                </a>
              </div>
            </FadeIn>
          ))}
        </div>
      ) : (
        <FadeIn animation="fadeIn">
          <div className="text-center py-10">
            <p className="text-lg text-muted">No se encontraron productos con estos filtros.</p>
          </div>
        </FadeIn>
      )}
    </main>
  );
}

export default ProductGrid;