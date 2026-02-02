`use client`;

import { useState } from "react";
import Image from "next/image";
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
}

export default function NavbarMobile({
  categories,
  logoSrc = "/logos/logo-ite.png",
  logoAlt = "Medin Camisas",
  onClose,
}: Props) {
  // false = showing (enter), true = closing (exit)
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    // Play slide-out animation before unmounting
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

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

          <button onClick={handleClose} aria-label="Cerrar menú">
            <X size={28} />
          </button>
        </div>

        {/* Menu Items */}
        <ul className="flex flex-col gap-2 p-4 overflow-y-auto">
          {categories.map((category) => {
            const href = category.slug
              ? `/categoria/${category.slug}`
              : "#";

            return (
              <li key={category.id}>
                <Link
                  href={href}
                  onClick={handleClose}
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
        onClick={handleClose}
      />
    </div>
  );
}