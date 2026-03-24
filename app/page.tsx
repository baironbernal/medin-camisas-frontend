import { 
  BannerHome as BannerSection, 
  MayoristaSection, 
  Products as ProductSection, 
  VisitUs, 
  Us,
  FadeIn
} from "./components";
import { getProducts } from "./services/products";


export const dynamic = 'force-dynamic';
export default async function Home() {


  const { data: products } = await getProducts();

  return (
    <main className="max-w-full">
      
      {/*Home Banner Section */}
      <FadeIn animation="fadeIn" duration={0.8}>
        <BannerSection/>
      </FadeIn>

      {/*Products Swiper */}
      <section className="bg-beige w-full px-4 py-16">
        <FadeIn animation="fadeInUp" delay={0.2}>
          <ProductSection products={ products } />
        </FadeIn>
      </section>

      {/* Mayorista Section */}
      <section className="bg-dark w-full px-4 py-16 flex flex-col justify-between gap:10 lg:gap-20">
        <FadeIn animation="fadeInLeft" delay={0.3}>
          <MayoristaSection/>
        </FadeIn>
      </section>

      {/* Us Section */}
      <section className="bg-beige w-full px-4 py-16">
        <FadeIn animation="fadeInRight" delay={0.4}>
          <Us/>
        </FadeIn>
      </section>

      {/* Visit Us Section */}
      <section className="bg-dark w-full px-4 py-16 flex flex-col justify-between gap:10 lg:gap-20">
        <FadeIn animation="fadeInUp" delay={0.5}>
          <VisitUs/>
        </FadeIn>
      </section>
      

    </main>
  );
}