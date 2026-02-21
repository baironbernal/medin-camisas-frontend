
export const dynamic = "force-dynamic";
import ProductItem from "@/app/components/home/products/productItem";
import { getProducts } from "@/app/services/products";

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const productsByCategory = await getProducts({
    category: params.slug,
    ...searchParams,
  });
  
  return (
    
      <main className="w-full mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center md:justify-start">
        {productsByCategory.data.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
      </main>
    
  );
}