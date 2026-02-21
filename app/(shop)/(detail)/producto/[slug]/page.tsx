import { BtnAddToCart } from "@/app/(shop)/components/btnAddToCart";
import { GalleryDetail } from "@/app/(shop)/components/gallery/gallery";
import { getProduct } from "@/app/services/products";
import { notFound } from "next/navigation";

export default async function Page ({params}: {params: { slug: string }}) {
    const { slug } = await params;

    const product = await getProduct(slug);

    console.log('Estas son mis imagenes de Laravel',product.variants?.[0].sku)
    console.log('Estas son mis imagenes de Laravel',product.variants?.[0].images)

    if (!product) {
      notFound()
    }
    
  return (
    <main className="flex items-justify justify-center container mx-auto py-12">
      <section className="w-full">
        {product.variants && <GalleryDetail images={product.variants[0].images || []} />}
      </section>
        
        <section className="w-full">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p>{product.description}</p>
          <BtnAddToCart product={product} />
        </section>
    </main> 
  )
}
