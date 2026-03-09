
import { getProduct } from "@/app/services/products";
import { notFound } from "next/navigation";
import { WrapperDetail } from "@/app/(shop)/components/detail/wrapperDetail";
import { ProductDetail } from "@/types/product-detail";

export default async function Page ({params}: {params: { slug: string }}) {
    const { slug } = await params;

    const product = await getProduct<ProductDetail>(slug);


    if (!product) {
      notFound()
    }
    
  return (
    <main className="flex items-justify justify-center container mx-auto py-12">
      <WrapperDetail data={product.data} />
    </main> 
  )
}
