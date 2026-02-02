import { CircleCheck, MessageCircle } from 'lucide-react';
import Tag from '../../ui/tag';
import Image from 'next/image';


const MayoristaSection = () => {
  return (
    <section className="container mx-auto flex flex-col lg:flex-row gap-6">
     {/* First Column */}
        <div>
            <span className="font-bold text-accent">MAYORISTA</span>
            <h2 className="mt-4 lg:mt-8 text-white lg:text-60 text-30 leading-16">Surte tu negocio con Medin</h2>
            

            <p className="mt-4 lg:mt-8 text-white text-sm lg:text-20 lg:max-w-xl">
                Accede a precios exclusivos, soporte personalizado y un catálogo diseñado para vender. Únete a nuestra red de distribuidores.
            </p>

            <article className="mt-4 lg:mt-8 text-white flex flex-col gap-3">
                <div className="flex gap-2 items-center justify-start">
                    <CircleCheck size={16}/>
                    <span>Precios competitivos al por mayor  </span>
                </div>
                <div className="flex gap-2 items-center justify-start">
                    <CircleCheck size={16}/>
                    <span>Packs iniciales para emprendedores </span>
                </div>
                <div className="flex gap-2 items-center justify-start">
                    <CircleCheck size={16}/>
                    <span>Catálogo actualizado mensualmente  </span>
                </div>
                <div className="flex gap-2 items-center justify-start">
                    <CircleCheck size={16}/>
                    <span>Atención prioritaria por WhatsApp </span>
                </div>
            </article>

            <div className='mt-4 lg:mt-8 '>
                <Tag icon={<MessageCircle size={16} />} title="Solicitar catalogo mayorista" />
            </div>
        </div>

        {/* Second Column */}
        <Image
                src='/home/mayorista.png'
                alt="Mayorista Prendas"
                width={6000}
                height={6000}
                priority
                className="w-auto object-contain"
              />
    </section>
  )
}

export default MayoristaSection








