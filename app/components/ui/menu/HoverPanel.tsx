'use client';

import { Category } from "@/types/category";
import NavLink from "./NavLinkContent";

interface HoverPanelProps {
  activeCategory: Category | null;
  isOpen: boolean;
  onMouseLeave: () => void;
}

export default function HoverPanel({
  activeCategory,
  isOpen,
  onMouseLeave,
}: HoverPanelProps) {
  if (
    !isOpen ||
    !activeCategory ||
    !activeCategory.children_recursive ||
    activeCategory.children_recursive.length === 0
  ) {
    return null;
  }

  return (
    <div
      className="
        lg:block
        fixed
        left-0
        top-[67px]
        w-full
        bg-dark
        shadow-xl
        overflow-hidden
        z-40
        pointer-events-auto
        animate__fadeInDown
      "
      style={{
        animationDuration: "0.3s",
      }}
      onMouseLeave={onMouseLeave}
    >
      <div className="container mx-auto px-6 py-6">
        <div className="flex justify-between gap-8">
          {activeCategory.children_recursive.map((child) => (
            <div key={child.id} >
                <NavLink href={`/coleccion?category=${activeCategory.slug}&subcategory=${child.slug}`} className="text-beige px-3 ">
                  <div className="flex flex-col gap-2">
                    <b className="uppercase text-md text-accent hover:underline tracking-widest">{child.name}</b>

                  {child.children_recursive?.map((subChild) => (
                    <NavLink key={subChild.id} href={`/coleccion?category=${activeCategory.slug}&subcategory=${child.slug}&subsubcategory=${subChild.slug}`} 
                    className="text-beige px-3 ">
                      {subChild.name}
                    </NavLink>
                  ))}
                  </div>
                </NavLink>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
