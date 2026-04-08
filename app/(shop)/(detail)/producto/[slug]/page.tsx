import { getProduct } from "@/app/services/products";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/types/product-detail";
import { Product } from "@/types/product";
import { WrapperDetail } from "@/app/(shop)/components/detail/WrapperDetail";

interface ProductDetailResponse {
  product: ProductDetail;
  interested_products: Product[];
}

export default async function Page ({params}: {params: { slug: string }}) {
    const { slug } = await params;

    const data = await getProduct<ProductDetailResponse>(slug);

    if (!data) {
      notFound()
    }

  return (
    <main className="flex items-justify justify-center py-2 lg:py-12 bg-beige">
      <WrapperDetail product={data.product} interestedProducts={data.interested_products} />
    </main>
  )
}
