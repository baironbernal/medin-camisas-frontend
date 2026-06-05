'use client';

import { motion, AnimatePresence } from 'framer-motion';
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
  const canShow =
    isOpen &&
    !!activeCategory &&
    !!activeCategory.children_recursive &&
    activeCategory.children_recursive.length > 0;

  return (
    <AnimatePresence>
      {canShow && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="lg:block absolute left-0 top-full w-full bg-dark shadow-xl overflow-hidden z-10 pointer-events-auto"
          onMouseLeave={onMouseLeave}
        >
          <div className="container mx-auto px-6 py-10">
            <div className="flex justify-between gap-8">
              {activeCategory!.children_recursive!.map((child) => (
                <div key={child.id} className="flex flex-col gap-2 px-3">
                  <NavLink href={`/coleccion?category=${activeCategory!.slug}&subcategory=${child.slug}`} className="text-beige">
                    <b className="uppercase text-md text-accent hover:underline tracking-widest">{child.name}</b>
                  </NavLink>
                  {child.children_recursive?.map((subChild) => (
                    <NavLink
                      key={subChild.id}
                      href={`/coleccion?category=${activeCategory!.slug}&subcategory=${child.slug}&subsubcategory=${subChild.slug}`}
                      className="text-beige"
                    >
                      {subChild.name}
                    </NavLink>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
