import BannerSection from "./components/banners/bannerHome";
import MayoristaSection from "./components/home/mayorista/mayorista";
import ProductSection from "./components/home/products/products";
import VisitUs from "./components/home/visit-us/visit-us";
import Us from "./components/home/who-are/us";
import { getProducts } from "./services/products";


export const dynamic = 'force-dynamic';
export default async function Home() {


  const { data: products } = await getProducts();

  return (
    <main className="max-w-full">
     
     {/*Home Banner Section */}
     <BannerSection/>

     {/*Products Swiper */}
     <section className="bg-beige w-full px-4 py-16">
        <ProductSection products={ products } />
     </section>

     {/* Mayorista Section */}
     <section className="bg-dark w-full px-4 py-16 flex flex-col justify-between gap:10 lg:gap-20">
        <MayoristaSection/>
     </section>

     {/* Us Section */}
     <section className="bg-beige w-full px-4 py-16">
        <Us/>
     </section>

     {/* Visit Us Section */}
     <section className="bg-dark w-full px-4 py-16 flex flex-col justify-between gap:10 lg:gap-20">
        <VisitUs/>
     </section>
     

    </main>
  );
}
