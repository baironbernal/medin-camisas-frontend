'use client';

import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types/category";
import { useState } from "react";
import NavbarMobile from "./navbarMobile";
import { Menu } from "lucide-react";

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

  return (
    <header className="sticky top-0 z-50 bg-dark font-utendo text-white">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={63}
              height={63}
              priority
              className="w-auto object-contain"
            />
          </Link>

          {/* ================= Desktop Menu ================= */}
          <ul className="hidden lg:flex flex-1 justify-center gap-2 relative">

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
                  className="group relative flex flex-col items-center"
                >

                  {/* Main Category */}
                  <Link
                    href={href}
                    className="
                      inline-flex
                      justify-center
                      rounded
                      px-3
                      py-2
                      text-17
                      transition
                      hover:bg-white/10
                      hover:text-accent
                    "
                  >
                    {category.name}
                  </Link>

                  {/* ================= Full Width Hover Panel ================= */}
        {hasChildren && (
          <div
            className="
              fixed
              left-0
              top-[72px]
              w-full
              bg-dark
              shadow-xl
              overflow-hidden
              z-40

              opacity-0
              

              transition-all
              duration-500

              group-hover:opacity-100
              group-hover:translate-x-0
            "
          >
            <div className="container mx-auto px-6 py-6">

              <ul className="grid grid-cols-4 gap-6">

                {category.children_recursive && category.children_recursive.map((child) => {
                  const childHref = child.slug
                    ? `/categoria/${child.slug}`
                    : "#";

                  return (
                    <li key={child.id}>
                      <Link
                        href={childHref}
                        className="
                          block
                          text-base
                          font-medium
                          transition
                          hover:text-accent
                        "
                      >
                        {child.name}
                      </Link>
                    </li>
                  );
                })}

              </ul>

            </div>
          </div>
        )}

                </li>
              );
            })}

          </ul>

          {/* ================= Desktop WhatsApp ================= */}
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              hidden
              lg:flex
              items-center
              rounded-full
              bg-accent
              text-dark
              px-4
              py-2
              font-medium
              transition
              hover:bg-green-400
            "
          >
            WhatsApp
          </a>

          {/* ================= Mobile Button ================= */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden text-white"
          >
            <Menu size={28} />
          </button>

        </div>
      </nav>

      {/* ================= Mobile Menu ================= */}
      {isMenuOpen && (
        <NavbarMobile
          categories={categories}
          onClose={() => setIsMenuOpen(false)}
        />
      )}

    </header>
  );
}