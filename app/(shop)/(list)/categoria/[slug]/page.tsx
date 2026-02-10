
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
    
      <main className="w-full max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-4">
        {productsByCategory.data.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
      </main>
    
  );
}