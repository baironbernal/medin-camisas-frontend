'use client';

import { Category } from "@/types/category";
import RecursiveCategoryItem from "../RecursiveDropdown";

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
        top-[72px]
        w-full
        bg-dark
        shadow-xl
        overflow-hidden
        z-40
        pointer-events-auto
        animate__animated 
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
            <div key={child.id} className="flex-1">
                <RecursiveCategoryItem category={child} level={0} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
