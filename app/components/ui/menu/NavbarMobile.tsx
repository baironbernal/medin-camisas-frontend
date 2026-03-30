'use client';

import { useState } from "react";
import { Category } from "@/types/category";
import { X, CircleUserRound, ChevronDown, ChevronRight, ShoppingBag } from "lucide-react";
import "animate.css";
import { useAuth } from "@/app/useContext/AuthContext";
import { LogIn } from "lucide-react";
import NavLink from "./NavLinkContent";
import WhatsappButton from "../commons/WhatsappButton";
import Logo from "../commons/Logo";
import { useCartStore } from "@/app/store/useCartStore";

interface MobileMenuItemProps {
  category: Category;
  level: number;
  onNavigate: () => void;
}

function MobileMenuItem({ category, level, onNavigate }: MobileMenuItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.children_recursive && category.children_recursive.length > 0;
  const href = category.slug ? `/coleccion?category=${category.slug}` : "#";
  const paddingLeft = level === 0 ? "pl-3" : `pl-${3 + level * 3}`;

  return (
    <li className="w-full">
      <div className="flex items-center justify-between">
        <NavLink
          href={href}
          onClick={onNavigate}
          className={`block rounded px-3 py-3 text-lg hover:bg-white/10 ${
            level === 1 ? "text-gray-300 text-sm ml-2" : level === 2 ? "text-gray-300 text-xs ml-4" : "text-white"
          } ${paddingLeft}`}
        >
          {category.name}
        </NavLink>
        {hasChildren && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }}
            className="p-3 text-sm rounded-full hover:bg-white/10 transition-colors"
            aria-label={isExpanded ? `Collapsar ${category.name}` : `Expandir ${category.name}`}
          >
            {isExpanded ? (
              <ChevronDown size={20} className="text-white/70" />
            ) : (
              <ChevronRight size={20} className="text-white/70" />
            )}
          </button>
        )}
      </div>
      
      {hasChildren && isExpanded && (
        <ul className="flex flex-col gap-1 mt-1">
          {category.children_recursive!.map((child) => (
            <MobileMenuItem
              key={child.id}
              category={child}
              level={level + 1}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  );
}


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
  const openCart = useCartStore(state => state.openCart)
  const cartCount = useCartStore(state => state.totalItems)

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

          <li className="w-full">
            <button
              onClick={() => {
                onClose();
                openCart();
              }}
              className="flex items-center justify-between w-full rounded px-3 py-3 text-lg hover:bg-white/10 text-white"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={24} />
                <span>Carrito</span>
              </div>
              {cartCount > 0 && (
                <span className="bg-accent text-white text-sm font-medium px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </li>
          
          <div className="h-px w-full bg-white/10 my-2" />
          
          {categories.map((category) => (
            <MobileMenuItem
              key={category.id}
              category={category}
              level={0}
              onNavigate={onClose}
            />
          ))}
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