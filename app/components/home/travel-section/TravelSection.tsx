
import ButtonDefault from '../../ui/commons/Button'
import FadeIn from '../../ui/commons/FadeIn'


export const TravelSection = () => {
  return (
      <section className="w-full">
        <FadeIn animation="fadeInRight" delay={0.4} className="flex flex-nowrap">
          {/* Image 1 */}
          <div className="relative w-1/2 group overflow-hidden cursor-pointer">
            <img
              src='/us/main.webp'
              alt="Man in London City"
              width={300}
              height={300}
              className="w-full h-auto transition-all duration-500 brightness-100 group-hover:brightness-[0.45]"
            />
            <div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-transparent shadow-2xl text-dark px-6 py-2.5 text-sm font-bold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 whitespace-nowrap"
            >
               <ButtonDefault title="Ver Catalogo" url="/coleccion" />
            </div>
          </div>

          {/* Image 2 */}
          <div className="relative w-1/2 group overflow-hidden cursor-pointer">
            <img
              src='/us/main2.webp'
              alt="Man in London"
              width={300}
              height={300}
              className="w-full h-auto transition-all duration-500 brightness-100 group-hover:brightness-[0.45]"
            />
            <img
              src="/logos/logo-ite.png"
              alt="Logo Medin Camisas"
              width={12}
              height={12}
              className="absolute bottom-2 right-2 w-40 h-auto shadow-2xl"
            />
            <div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-transparent shadow-2xl text-dark px-6 py-2.5 text-sm font-bold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 whitespace-nowrap"
            >
               <ButtonDefault title="Ver Catalogo" url="/coleccion" />
            </div>
          </div>
        </FadeIn>

        {/* Title & Subtitle */}
        <div className="bg-beige text-dark text-center py-20 px-4">
          <h2 className="text-dark lg:text-60 text-30">
            MedinCamisas en todos lados
          </h2>
          <p className="mt-3 text-muted text-sm lg:text-20 tracking-widest uppercase">
            Medin Camisas — #HechaParaTi
          </p>
        </div>
      </section>
  )
}
