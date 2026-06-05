
import {
  BannerHome as BannerSection,
  Products as ProductSection,
  VisitUs,
  FadeIn,
} from "./components";
import { getProducts } from "./services/products";
import { TravelSection } from "./components/home/travel-section/TravelSection";
import HomeAdsTicker from "./components/home/HomeAdsTicker";

async function getBannerVideoUrl(): Promise<string | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/metadatos/banner-video`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.url ?? null;
  } catch {
    return null;
  }
}

export const revalidate = 60;
export default async function Home() {

  const [{ data: products }, bannerVideoUrl] = await Promise.all([
    getProducts(),
    getBannerVideoUrl(),
  ]);

  return (
    <main className="max-w-full">

      {/*Home Banner Section */}
      <FadeIn animation="fadeIn" duration={0.8}>
        <BannerSection videoUrl={bannerVideoUrl ?? undefined} />
      </FadeIn>

      {/*Products Swiper */}
      <section className="bg-beige w-full px-4 py-16">
        <FadeIn animation="fadeInUp" delay={0.2}>
          <ProductSection products={ products } />
        </FadeIn>
      </section>

      {/* Travel Section */}
      <TravelSection/>

      {/* Visit Us Section */}
      <section className="bg-dark w-full px-4 py-16 flex flex-col justify-between gap:10 lg:gap-20">
        <FadeIn animation="fadeInUp" delay={0.5}>
          <VisitUs/>
        </FadeIn>
      </section>
    </main>
  );
}
