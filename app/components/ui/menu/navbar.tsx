'use client';

import Link from "next/link";
import { Category } from "@/types/category";
import { useState } from "react";
import NavbarMobile from "./navbarMobile";
import { Menu } from "lucide-react";
import WhatsappButton from "../whatsappButton";
import Logo from "../logo";
import HoverPanel from "./HoverPanel";


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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);


  return (
    <header className="sticky top-0 z-50 bg-dark font-utendo text-white">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Logo logoSrc={logoSrc} />

          {/* ================= Desktop Menu ================= */}
          <div
            className="hidden lg:flex flex-1 justify-center">
            <ul className="flex gap-2 relative">

              <li className="relative flex flex-col items-center">
                <Link href={'/who-are'} className="inline-flex justify-center rounded px-3 py-2 text-17 transition hover:bg-white/10 hover:text-accent">Nosotros</Link>
              </li>

              {categories.map((category) => {
                const hasChildren =
                  category.children_recursive &&
                  category.children_recursive.length > 0;

                const href = category.slug
                  ? `/categoria/${category.slug}`
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
                    <Link
                      href={href}
                      className="inline-flex justify-center rounded px-3 py-2 text-17 transition hover:bg-white/10 hover:text-accent">
                      {category.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ================= Desktop WhatsApp ================= */}
          <WhatsappButton/>

          {/* ================= Mobile Button ================= */}
          <button
            onClick={() => setIsMenuOpen(true)}
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
          onClose={() => setIsMenuOpen(false)}
        />
      )}

    </header>
  );
}