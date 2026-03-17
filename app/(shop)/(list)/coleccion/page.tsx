
export const dynamic = "force-dynamic";
import ProductItem from "@/app/components/home/products/productItem";
import { getProducts } from "@/app/services/products";
import { ApiError } from "@/app/services/fetcher";

interface SearchParams {
  category?: string | string[];
  subcategory?: string | string[];
  name?: string | string[];
  color?: string | string[];
  size?: string | string[];
  type?: string | string[];
  min_cost?: string | string[];
  max_cost?: string | string[];
  order_by?: string;
  order_dir?: string;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;

  const pick = (v?: string | string[]) =>
    Array.isArray(v) ? v[0] : v;

  const category  = pick(resolvedSearchParams.category);
  const subcategory = pick(resolvedSearchParams.subcategory);
  const name      = pick(resolvedSearchParams.name);
  const color     = pick(resolvedSearchParams.color);
  const size      = pick(resolvedSearchParams.size);
  const type      = pick(resolvedSearchParams.type);
  const min_cost  = pick(resolvedSearchParams.min_cost);
  const max_cost  = pick(resolvedSearchParams.max_cost);

  let productsResponse;

  try {
    productsResponse = await getProducts({
      category,
      subcategory,
      name,
      color,
      size,
      type,
      min_cost,
      max_cost,
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
    <main className="w-full mx-auto">
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
