import { CircleCheck, MessageCircle } from 'lucide-react';
import Tag from '../../ui/tag';
import Image from 'next/image';

const VisitUs = () => {
  return (
    <section className="container mx-auto flex flex-col lg:flex-row gap-6">
     {/* First Column */}
        <div>
            <h2 className="mt-4 lg:mt-8 text-white lg:text-60 text-30">Visitanos</h2>
            
            <p className="mt-4 lg:mt-8 text-white text-sm lg:text-20 lg:max-w-xl">
            Estamos ubicados en Bogotá, en una de las zonas más comerciales de la moda. Ven a conocer nuestras telas y diseños en persona.
            </p>

            <article className="mt-4 lg:mt-8 text-white flex flex-col gap-3">
                <div className="flex gap-2 items-center justify-start">
                    <CircleCheck size={16}/>
                    <span>Bodega mayorista San Martín, 2 piso local 233-234 </span>
                </div>
                <div className="flex gap-2 items-center justify-start">
                    <CircleCheck size={16}/>
                    <span>Centro comercial Punto Once,local 6017 </span>
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

export default VisitUs








