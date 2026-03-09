export const dynamic = "force-dynamic";
import { getProducts } from "@/app/services/products";
import { ApiError, NotFoundError } from "@/app/services/fetcher";
import { notFound } from "next/navigation";
import ProductItem from "@/app/components/home/products/productItem";

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  let productsByCategory;
  
  try {
    productsByCategory = await getProducts({
      subcategory: params.slug,
      ...searchParams,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
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

  if (!productsByCategory.data || productsByCategory.data.length === 0) {
    notFound();
  }

  return (
    <main>
      <h1>Categoría: {params.slug}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center md:justify-start" >
      {productsByCategory.data.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
      </div>
    </main>
  );
}