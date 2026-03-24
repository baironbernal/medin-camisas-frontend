'use client';

import { FadeIn, ProductItem } from "@/app/components";
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
      

      {/* Products list */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 2xl:gap-14 justify-center md:justify-start">
          {products.map((product, index) => (
            <FadeIn 
              key={product.id} 
              animation="fadeInUp" 
              delay={index * 0.1}
            >
              <ProductItem key={product.id} product={product} />
            </FadeIn>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-lg text-muted">No se encontraron productos con estos filtros.</p>
        </div>
      )}
    </main>
  );
}

export default ProductGrid;