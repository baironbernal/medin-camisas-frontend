'use client';

import { Category } from "@/types/category";
import { useState, useEffect } from "react";
import { Menu, ShoppingBag, CircleUserRound } from "lucide-react";
import { useAnimatedOpen } from "@/app/hooks/useAnimatedOpen";
import { useQueryState } from "nuqs";

import { useAuth } from "@/app/useContext/AuthContext";
import { LogIn } from "lucide-react";
import { CartSidebar } from "@/app/(shop)/components";
import HoverPanel from "./HoverPanel";
import NavLink from "./NavLinkContent";
import NavbarMobile from "./NavbarMobile";
import Logo from "../commons/Logo";
import { useCartStore } from "@/app/store/useCartStore";


interface Props {
  categories: Category[];
  logoSrc?: string;
  logoAlt?: string;
}

export default function Navbar({
  categories,
  logoSrc = "/logos/logo-ite.png",
  logoAlt = "Medin Camisas",
}: Props) {
  const { isLoggedIn } = useAuth();
  const { 
    isOpen: isMenuOpen, 
    isClosing: isMenuClosing, 
    open: openMenu, 
    close: closeMenu 
  } = useAnimatedOpen();
  
  const isCartOpen = useCartStore(state => state.isOpen)
  const isCartClosing = useCartStore(state => state.isClosing)
  const openCart = useCartStore(state => state.openCart)
  const closeCart = useCartStore(state => state.closeCart)
  
  const totalItems = useCartStore(state => state.totalItems)
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  const [openCartParam, setOpenCartParam] = useQueryState('openCart');

  useEffect(() => {
    if (openCartParam === 'true') {
      openCart();
      setOpenCartParam(null); // Borra el parámetro de la URL
    }
  }, [openCartParam, openCart, setOpenCartParam]);

  return (
    <header className="sticky top-0 z-10 bg-dark font-utendo text-white">
      <nav className="container mx-auto px-4 ">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Logo logoSrc={logoSrc} />

          {/* ================= Desktop Menu ================= */}
          <div
            className="hidden lg:flex flex-1 justify-center">
            <ul className="flex gap-2 relative">

              {/* Ver todo */}
              <li className="relative flex flex-col items-center text-lg">
                <NavLink href={'/coleccion'} className="inline-flex justify-center px-3 text-accent">Ver todo</NavLink>
              </li>

              {categories.map((category) => {
                const hasChildren =
                  category.children_recursive &&
                  category.children_recursive.length > 0;

                const href = category.slug
                  ? `/coleccion?category=${category.slug}`
                  : "#";

                return (
                  <li
                    key={category.id}
                    onMouseEnter={() => {
                      if (hasChildren) {
                        setActiveCategory(category);
                        setIsPanelOpen(true);
                      } else {
                        setIsPanelOpen(false);
                        setActiveCategory(null);
                      }
                    }}
                    className="relative flex flex-col items-center"
                  >
                    {/* Main Category */}
                    <NavLink
                      href={href}
                      className="inline-flex justify-center text-accent px-3 text-lg ">
                      {category.name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ================= Login and Cart ================= */}
          <div className="hidden lg:flex items-center gap-4">
            <button onClick={openCart} className="relative cursor-pointer">
              <ShoppingBag size={30} color="beige" strokeWidth={1} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 
                                bg-red-500 text-white 
                                text-xs font-bold 
                                rounded-full 
                                w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <NavLink href={isLoggedIn ? "/profile" : "/login"}>
                {isLoggedIn ? (
                  <CircleUserRound size={30} color="beige" strokeWidth={1} />
                ) : (
                  <LogIn size={26} color="beige" strokeWidth={1.5} />
                )}
            </NavLink>
          </div>

          {/* ================= Mobile Button ================= */}
          <button
            onClick={openMenu}
            className="lg:hidden text-white"
          >
            <Menu size={28} />
          </button>

        </div>
      </nav>

      {/* ================= Desktop Full Width Hover Panel ================= */}
      {isPanelOpen &&
        activeCategory &&
        activeCategory.children_recursive &&
        activeCategory.children_recursive.length > 0 && (
          <HoverPanel 
            activeCategory={activeCategory} 
            isOpen={isPanelOpen} 
            onMouseLeave={() => {
              setIsPanelOpen(false);
              setActiveCategory(null);
            }} 
          />
        )}

      {/* ================= Mobile Menu ================= */}
      {isMenuOpen && (
        <NavbarMobile
          categories={categories}
          logoSrc={logoSrc}
          logoAlt={logoAlt}
          onClose={closeMenu}
          isClosing={isMenuClosing}
        />
      )}

      {/* ================= Cart Sidebar ================= */}
      {isCartOpen && (
        <CartSidebar
          onClose={closeCart}
          isClosing={isCartClosing}
        />
      )}

    </header>
  );
}