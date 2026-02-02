import Image from "next/image"
import { SocialNetworks } from "./social-networks"

const Footer = ({ styles }: { styles?: string }) => {
  return (
    <div className={`${styles}`}>
        <section className='p-4 flex container mx-auto flex flex-col lg:flex-row justify-between items-center gap-2 lg:gap-0'>
            {/* Logo Section */}
            <article className="w-full flex justify-center lg:justify-start lg:w-2/3">
                <Image
                    src="/logos/footer.png"
                    alt="Medin Camisas Logo"
                    width={200}
                    height={80}
                    className="w-60 h-auto"
                />
            </article>

            <section className="w-full flex justify-start lg:justify-between items-start lg:mx-auto gap-10 flex-col lg:flex-row">
                    {/* Catalogo Section */}
                <article className="w-full lg:w-1/4 flex flex-col items-center lg:items-start gap-1">
                    <h3 className="text-22 font-bold mb-2">Catálogo</h3>
                    <ul className="flex flex-col items-center lg:items-start gap-2 text-dark/80">
                        <li className="hover:text-dark cursor-pointer transition">Nuevos</li>
                        <li className="hover:text-dark cursor-pointer transition">Camisas</li>
                        <li className="hover:text-dark cursor-pointer transition">Pantalones</li>
                        <li className="hover:text-dark cursor-pointer transition">Ofertas</li>
                    </ul>
                </article>

                {/* Empresa Section */}
                <article className="w-full lg:w-1/4 flex flex-col items-center lg:items-start gap-1">
                    <h3 className="text-22 font-bold mb-2">Empresa</h3>
                    <ul className="flex flex-col items-center lg:items-start gap-2 text-dark/80">
                        <li className="hover:text-dark cursor-pointer transition">Nosotros</li>
                        <li className="hover:text-dark cursor-pointer transition">Mayoristas</li>
                        <li className="hover:text-dark cursor-pointer transition">Contacto</li>
                    </ul>
                </article>

                {/* Socials Section */}
                <article className="w-full lg:w-1/4 flex flex-col items-center lg:items-start gap-1">
                    <h3 className="text-22 font-bold mb-2">Síguenos</h3>
                    <SocialNetworks />
                </article>
            </section>
        </section>
    </div>
  )
}

export default Footer