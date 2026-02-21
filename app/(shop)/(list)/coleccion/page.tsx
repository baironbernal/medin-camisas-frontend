
export const dynamic = "force-dynamic";
import { SearchInput } from "@/app/(shop)/components/filters/search/search";
import ProductItem from "@/app/components/home/products/productItem";
import { getProducts } from "@/app/services/products";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;

  // Directly use searchParams for filtering
  const productsResponse = await getProducts({
    ...resolvedSearchParams,
  });

  const category = Array.isArray(resolvedSearchParams.category) ? resolvedSearchParams.category[0] : resolvedSearchParams.category;
  const subcategory = Array.isArray(resolvedSearchParams.subcategory) ? resolvedSearchParams.subcategory[0] : resolvedSearchParams.subcategory;

  return (
    <main className="w-full mx-auto ">
      {/* Title based on filters */}
      <h1 className="text-3xl font-heading mb-6 capitalize">
        {category ? `Colección: ${category}` : 
         subcategory ? `Subcategoría: ${subcategory}` : 
         "Todos los productos"}
      </h1>

      {productsResponse.data.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center md:justify-start">
          {productsResponse.data.map((product) => (
            <ProductItem key={product.id} product={product} />
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
