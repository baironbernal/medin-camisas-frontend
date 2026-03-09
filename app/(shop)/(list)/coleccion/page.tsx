
export const dynamic = "force-dynamic";
import ProductItem from "@/app/components/home/products/productItem";
import { getProducts } from "@/app/services/products";
import { notFound } from "next/navigation";
import { ApiError } from "@/app/services/fetcher";

interface SearchParams {
  category?: string | string[];
  subcategory?: string | string[];
  order_by?: string;
  order_dir?: string;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;

  const category = Array.isArray(resolvedSearchParams.category) ? resolvedSearchParams.category[0] : resolvedSearchParams.category;
  const subcategory = Array.isArray(resolvedSearchParams.subcategory) ? resolvedSearchParams.subcategory[0] : resolvedSearchParams.subcategory;

  let productsResponse;
  
  try {
    productsResponse = await getProducts({
      category,
      subcategory,
      order_by: resolvedSearchParams.order_by,
      order_dir: resolvedSearchParams.order_dir as 'asc' | 'desc' | undefined,
    });
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 0) {
      return (
        <main className="w-full mx-auto">
          <div className="text-center py-10">
            <p className="text-lg text-red-600">No se pudo conectar con el servidor. Verifica tu conexión a internet.</p>
          </div>
        </main>
      );
    }
    throw error;
  }

  return (
    <main className="w-full mx-auto ">
      {/* Title based on filters */}
      <h1 className="text-3xl font-heading mb-6 capitalize">
        {category ? `Colección: ${category}` : 
         subcategory ? `Subcategoría: ${subcategory}` : 
         "Todos los productos"}
      </h1>

      {/* Products list */}
      {productsResponse.data.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 2xl:gap-14 justify-center md:justify-start">
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
