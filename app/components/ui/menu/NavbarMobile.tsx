`use client`;

import { Category } from "@/types/category";
import { X, CircleUserRound } from "lucide-react";
import "animate.css";
import { useAuth } from "@/app/useContext/AuthContext";
import { LogIn } from "lucide-react";
import NavLink from "./NavLinkContent";
import WhatsappButton from "../commons/WhatsappButton";
import Logo from "../commons/Logo";


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
  const { isLoggedIn, user } = useAuth();

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
        <ul className="flex flex-col items-start gap-4 p-6 overflow-y-auto">
          {/* Auth Item */}
          <li className="w-full">
            {isLoggedIn ? (
              <NavLink
                href="/perfil"
                onClick={onClose}
                className="flex items-center gap-3 rounded px-3 py-3 text-lg hover:bg-white/10 text-accent font-medium w-fit"
              >
                <CircleUserRound size={24} />
                <span className="truncate">Hola, {user?.name.split(' ')[0] || 'Mi Perfil'}</span>
              </NavLink>
            ) : (
              <NavLink
                href="/login"
                onClick={onClose}
                className="flex items-center gap-3 rounded px-3 py-3 text-lg hover:bg-white/10 text-accent font-medium w-fit"
              >
                <LogIn size={24} />
                Iniciar Sesión
              </NavLink>
            )}
          </li>
          
          <div className="h-px w-full bg-white/10 my-2" />
          
          {categories.map((category) => {
            const href = category.slug
              ? `/coleccion?category=${category.slug}`
              : "#";

            return (
              <li key={category.id} className="w-full">
                <NavLink
                  href={href}
                  onClick={onClose}
                  className="block rounded px-3 py-3 text-lg hover:bg-white/10 w-fit"
                >
                  {category.name}
                </NavLink>
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