export const dynamic = "force-dynamic";
import { ProductGrid } from "@/app/components";
import { getProducts } from "@/app/services/products";
import { ApiError } from "@/app/services/fetcher";
import { Banner, Sort } from "../../components";
import { Suspense } from "react";

interface SearchParams {
  category?: string | string[];
  subcategory?: string | string[];
  subsubcategory?: string | string[];
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
  const subsubcategory = pick(resolvedSearchParams.subsubcategory);
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
      subsubcategory,
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

  const title = category ? `${category}` :
   subcategory ? `${subcategory}` :
   "Todos los productos";

  return (
    <>
      {/* Banner */}
      <Banner name={title} image="/shop/background.png" /> 
      <section className="container mx-auto px-4">
        {/* Products */}
            {/* Sort to show the filters */}
            <Suspense fallback={<div className="h-14" />}>
              <Sort/>
            </Suspense>
            
            <ProductGrid products={productsResponse.data} title={title} />
      </section>
    </>
  );
}