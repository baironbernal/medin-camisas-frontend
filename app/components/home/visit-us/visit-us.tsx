import { CircleCheck, MessageCircle } from 'lucide-react';
import Tag from '../../ui/tag';
import Map from '../../ui/map';

const VisitUs = () => {
  return (
    <section className="container mx-auto flex flex-col lg:flex-row h-full w-full gap-8 ">
     {/* First Column */}
      <div className='w-full'>
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
         <div className='w-full h-full mt-20'>
            <Map/>
         </div>
    </section>
  )
}

export default VisitUs








