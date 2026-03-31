import { getProduct } from "@/app/services/products";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/types/product-detail";
import { WrapperDetail } from "@/app/(shop)/components/detail/WrapperDetail";


export default async function Page ({params}: {params: { slug: string }}) {
    const { slug } = await params;

    const product = await getProduct<ProductDetail>(slug);

    if (!product) {
      notFound()
    }
    
  return (
    <main className="flex items-justify justify-center py-2 lg:py-12 bg-beige">
      <WrapperDetail data={product.data} />
    </main> 
  )
}
