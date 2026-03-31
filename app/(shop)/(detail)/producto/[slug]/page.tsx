import { getProduct } from "@/app/services/products";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/types/product-detail";
import ProductDetailWithDiscount from "@/app/(shop)/components/detail/ProductDetailWithDiscount";


export default async function Page ({params}: {params: { slug: string }}) {
    const { slug } = await params;

    const product = await getProduct<ProductDetail>(slug);

    if (!product) {
      notFound()
    }
    
  return (
    <main className="flex items-justify justify-center py-2 lg:py-12 bg-beige">
      <ProductDetailWithDiscount data={product.data} />
    </main> 
  )
}
