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

      {productsByCategory.data.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
        </div>
      ))}
    </main>
  );
}