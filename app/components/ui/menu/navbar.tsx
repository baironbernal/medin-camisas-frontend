'use client';

import { Category } from "@/types/category";
import { useState } from "react";
import NavbarMobile from "./navbarMobile";
import { Menu, ShoppingBag, CircleUserRound } from "lucide-react";
import Logo from "../logo";
import HoverPanel from "./HoverPanel";
import { useAnimatedOpen } from "@/app/hooks/useAnimatedOpen";
import NavLink from "./nav-link";


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
  const { 
    isOpen: isMenuOpen, 
    isClosing: isMenuClosing, 
    open: openMenu, 
    close: closeMenu 
  } = useAnimatedOpen();
  
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);


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
              <li className="relative flex flex-col items-center">
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
                      className="inline-flex justify-center text-accent px-3 ">
                      {category.name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ================= Login and Cart ================= */}
          <div className="hidden lg:flex items-center gap-4">
            <NavLink href="/cart">
              <CircleUserRound size={30} color="beige" strokeWidth={1} />
            </NavLink>
            <NavLink href="/cart">
              <ShoppingBag size={30} color="beige" strokeWidth={1} />
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

    </header>
  );
}