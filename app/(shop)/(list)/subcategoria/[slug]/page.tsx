export const dynamic = "force-dynamic";
import { getProducts } from "@/app/services/products";

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const productsByCategory = await getProducts({
    subcategory: params.slug,
    ...searchParams,
  });

  return (
    <main>
      <h1>Categoría: {params.slug}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center md:justify-start" >
      {productsByCategory.data.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
        </div>
      ))}
      </div>
    </main>
  );
}