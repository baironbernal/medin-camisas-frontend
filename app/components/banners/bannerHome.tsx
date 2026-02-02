import ButtonDefault from "../ui/button"
import Image from "next/image";
import Tag from "../ui/tag";
import { MessageCircle, Truck, Tag as TagIcon} from 'lucide-react';


const BannerSection = () => {
  return (
    <main className="bg-dark p-4">
      <section className="py-4 px-4 container mx-auto lg:flex items-center justify-between">
        {/* First Column */}
        <article>
            {/* Main Title */}
            <div className="w-full text-6xl lg:text-60 font-bold">
              <h1 className="py-3 px-2 w-fit rounded-md lg:text-primary bg-accent">Camisas</h1>
              <span className=" text-accent">con estilo</span>
            </div>

            <p className="mt-8 text-white text-sm lg:text-20 lg:max-w-xl">Colecciones para hombre con fit moderno y precios competitivos. Compra al detal o surte tu negocio
            con la mejor calidad.</p>

            <div className="flex gap-5 mt-8">
              <ButtonDefault title="Ver Catalogo" url="Update"/>
              <ButtonDefault title="Soy Mayorista" url="Update"/>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center gap-3 lg:gap-2 mt-8">
              <Tag icon={<MessageCircle size={16} />} title="Atención por whatsapp" />
              <Tag icon={<TagIcon size={16} />} title="Nuevas Referencias" />
              <Tag icon={<Truck size={16} />} title="Envios Nacionales" />
            </div>
        </article>

        {/* Second Column */}
        <article>
        <Image
                src='/home/man.png'
                alt="Man"
                width={1600}
                height={1600}
                priority
                className="w-auto object-contain"
              />
        </article>
      </section>

    </main>
  )
}

export default BannerSection
