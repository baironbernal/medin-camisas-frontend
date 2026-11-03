import type { Metadata } from "next";
import { getProduct } from "@/app/services/products";
import { notFound } from "next/navigation";
import { getImageUrl } from "@/app/lib/image";
import { CURRENCY } from "@/app/lib/metaPixel";
import { ProductDetail } from "@/types/product-detail";
import { Product } from "@/types/product";
import { WrapperDetail } from "@/app/(shop)/components/detail/WrapperDetail";

interface ProductDetailResponse {
  product: ProductDetail;
  interested_products: Product[];
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.camisasmedin.com';

function productImages(product: ProductDetail) {
  return [...new Set(product.variants.flatMap(variant => variant.images ?? []))].map(getImageUrl);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProduct<ProductDetailResponse>(slug).catch(() => null);

  if (!data) return {};

  const { product } = data;

  return {
    title: `${product.name.trim()} | Medin Camisas`,
    description: product.description,
    openGraph: {
      title: product.name.trim(),
      description: product.description,
      url: `${SITE_URL}/producto/${product.slug}`,
      images: productImages(product).slice(0, 1),
    },
  };
}

export default async function Page ({params}: {params: { slug: string }}) {
    const { slug } = await params;

    const data = await getProduct<ProductDetailResponse>(slug);

    if (!data) {
      notFound()
    }

    const { product } = data;

    // Structured data read by the Meta Pixel; sku is the ID sent in content_ids
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      sku: String(product.id),
      productID: String(product.id),
      name: product.name.trim(),
      description: product.description,
      image: productImages(product),
      brand: { '@type': 'Brand', name: 'Medin Camisas' },
      offers: {
        '@type': 'Offer',
        url: `${SITE_URL}/producto/${product.slug}`,
        price: Number(product.base_price),
        priceCurrency: CURRENCY,
        availability: `https://schema.org/${product.variants.length > 0 ? 'InStock' : 'OutOfStock'}`,
        itemCondition: 'https://schema.org/NewCondition',
      },
    };

  return (
    <main className="flex items-justify justify-center py-2 lg:py-12 bg-beige">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <WrapperDetail product={data.product} interestedProducts={data.interested_products} />
    </main>
  )
}
