import Image from "next/image";

export default function WhoAre() {

    return (
      <main className="w-full bg-accent px-4 py-8 lg:py-20 bg-beige  flex flex-col gap-20">
        <section className="container mx-auto flex flex-col lg:flex-row gap-10 items-center">
            {/*  Us Section */}
            <section className="w-full lg:w-1/2">
              <article className='mb-10 flex flex-col gap-5 justify-center '>
                    <span className="font-bold text-muted">NUESTRA ESENCIA</span>
                    <h2 className="text-dark lg:text-60 text-30 max-w-lg">Tradición y Visión Moderna.</h2>
                    <p className="text-muted font-okine text-sm lg:text-20 ">
                      MEDIN no es solo una marca de ropa; es una declaración de intenciones. Fundada en el corazón de la industria textil, nuestra misión ha sido siempre elevar el estándar de la moda masculina, fusionando técnicas artesanales con cortes vanguardistas. 
                  </p>
                  <p className="text-muted font-okine text-sm lg:text-20 ">Creemos que cada hombre merece una prenda que no solo le quede bien, sino que cuente una historia de calidad y dedicación. Por eso, cada costura, cada botón y cada tejido es seleccionado con un rigor que roza la obsesión.</p>
                  
                  <div className="flex flex-col gap-8 lg:flex-row lg:justify-between mt-8">
                    <div>
                      <h3 className="text-22 font-bold mb-2">Sostenibilidad</h3>
                      <p className="text-secondary font-okine">Procesos responsables que respetan el medio ambiente y a nuestra comunidad.</p>
                    </div>

                    <div>
                      <h3 className="text-22 font-bold mb-2">Invasion</h3>
                      <p className="text-secondary font-okine">Materiales para un confort superior durante todo el día.</p>
                    </div>
                    
                  </div>
                </article>
            </section>

            {/* Image Section */} 
            <article className="w-full lg:w-1/2 flex justify-center">
              <Image
                      src='/us/main.png'
                      alt="Man"
                      width={300}
                      height={300}
                      priority
                      className="w-full h-auto rounded-xl shadow-2xl shadow-dark/40"
                    />
              </article>
      
          </section>


          {/*  Cards Section */}
          <section className="container mx-auto flex flex-col lg:flex-row gap-4 lg:gap-8">
            <article className="w-full bg-white rounded-xl p-8">
              <span className="text-30 font-bold text-description">01</span>
              <h3 className="text-22 text-dark mt-4">Calidad Premium</h3>
              <p className="mt-4 text-secondary">Telas seleccionadas de los mejores provedores
                globales para segurar una textura unica.
              </p>
            </article>
            <article className="w-full bg-white rounded-xl p-8">
              <span className="text-30 font-bold text-description">01</span>
              <h3 className="text-22 text-dark mt-4">Diseno Local</h3>
              <p className="mt-4 text-secondary">Telas seleccionadas de los mejores provedores
                globales para segurar una textura unica.
              </p>
            </article>
            <article className="w-full bg-white rounded-xl p-8">
              <span className="text-30 font-bold text-description">01</span>
              <h3 className="text-22 text-dark mt-4">Compromosio</h3>
              <p className="mt-4 text-secondary">Telas seleccionadas de los mejores provedores
                globales para segurar una textura unica.
              </p>
            </article>
          </section>


      </main>
    );
  }