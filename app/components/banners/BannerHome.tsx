
import { ButtonDefault, Tag } from "@/app/components";
import { MessageCircle, Truck, Tag as TagIcon} from 'lucide-react';


const BannerSection = () => {
  return (
    <main className="p-4" 
    style={{backgroundImage: "url('/home/background.jpg')", 
    backgroundSize: "cover", 
    backgroundPosition: "center", backgroundRepeat: "no-repeat"}}>
      <section className="py-4 px-4 container mx-auto lg:flex items-center justify-between">
        {/* First Column */}
        <article className="animate__animated animate__fadeInLeft">
            {/* Main Title */}
            <div className="w-full text-6xl lg:text-90 font-bold">
              <h1 className="py-3 px-2 w-fit rounded-md lg:text-primary bg-accent">Camisas</h1>
              <span className=" text-accent">con estilo</span>
            </div>

            <p className="mt-8 text-white text-sm lg:text-20 lg:max-w-xl">Colecciones para hombre con fit moderno y precios competitivos. Compra al detal o surte tu negocio
            con la mejor calidad.</p>

            <div className="flex flex-col lg:flex-row gap-5 mt-8">
              <ButtonDefault title="Ver Catalogo" url="/coleccion"/>
              <ButtonDefault title="Soy Mayorista" url="/login"/>
            </div>
        </article>

        {/* Second Column */}
        <article className="w-full lg:w-1/2 lg:mt-0 mt-12">
        <video className="w-full lg:max-h-[40rem] rounded-xl  object-cover" controls preload="none" autoPlay muted loop>
            <source src="/home/video.mp4" type="video/mp4" />
            <track
              src="/home/captions.vtt"
              kind="subtitles"
              srcLang="en"
              label="English"
            />
            Your browser does not support the video tag.
          </video>
        </article>
      </section>

    </main>
  )
}

export default BannerSection
