'use client';

import Link from "next/link";
import { Category } from "@/types/category";
import { X } from "lucide-react";

interface Props {
  categories: Category[];
  onClose: () => void;
}

export default function NavbarMobile({ categories, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-dark text-white">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">

        <span className="text-lg font-semibold">
          Menu
        </span>

        <button onClick={onClose}>
          <X size={28} />
        </button>

      </div>

      {/* Menu Items */}
      <ul className="flex flex-col gap-2 p-4">

        {categories.map((category) => {
          const href = category.slug
            ? `/categoria/${category.slug}`
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
      <div className="p-4 border-t border-white/10">
        <a
          href="https://wa.me/"
          target="_blank"
          className="block text-center rounded-full bg-accent text-dark py-3 font-medium"
        >
          WhatsApp
        </a>
      </div>

    </div>
  );
}