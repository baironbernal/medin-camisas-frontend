`use client`;

import Link from "next/link";
import { Category } from "@/types/category";
import { X } from "lucide-react";
import "animate.css";
import WhatsappButton from "../whatsappButton";
import Logo from "../logo";

interface Props {
  categories: Category[];
  logoSrc?: string;
  logoAlt?: string;
  onClose: () => void;
  isClosing: boolean;
}

export default function NavbarMobile({
  categories,
  logoSrc = "/logos/logo-ite.png",
  logoAlt = "Medin Camisas",
  onClose,
  isClosing,
}: Props) {

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black">
      {/* Sliding panel */}
      <div
        className={`
          flex
          h-full
          w-screen
          flex-col
          bg-dark
          text-white
          shadow-2xl
          transform
          animate__animated
          ${!isClosing ? "animate__slideInRight" : "animate__slideOutRight"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 ">
          <div className="flex items-center">
           <Logo logoSrc={logoSrc} />
          </div>

          <button onClick={onClose} aria-label="Cerrar menú">
            <X size={28} />
          </button>
        </div>

        {/* Menu Items */}
        <ul className="flex flex-col gap-2 p-4 overflow-y-auto">
            <li>
                <Link
                  href={'/who-are'}
                  onClick={onClose}
                  className="block rounded px-3 py-3 text-lg hover:bg-white/10"
                >
                  Nosotros
                </Link>
            </li>
          {categories.map((category) => {
            const href = category.slug
              ? `/coleccion?category=${category.slug}`
              : "#";

            return (
              <li key={category.id}>
                <Link
                  href={href}
                  onClick={onClose}
                  className="block rounded px-3 py-3 text-lg hover:bg-white/10"
                >
                  {category.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* WhatsApp Button */}
        <WhatsappButton/>
      </div>

      {/* Clickable backdrop to close */}
      <button
        type="button"
        className="flex-1"
        aria-label="Cerrar menú"
        onClick={onClose}
      />
    </div>
  );
}