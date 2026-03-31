"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Filter } from "@/types/filters";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/components"
import { ChevronDownIcon } from "lucide-react";
import { X } from 'lucide-react';
import { useFiltersUI } from "../../useContext/FiltersContext";
import SearchInput from "./search/SearchInput";
import FilterColor from "./color/FilterColor";
import FilterSize from "./size/FilterSize";
import MinAndMax from "./price/MinAndMax";
import { FilterMaterial } from "./material/FilterMaterial";


export interface FiltersSidebarProps {
  availableFilters: Filter[];
}

export default function FiltersSidebar({ availableFilters }: FiltersSidebarProps) {
  const { open, setOpen } = useFiltersUI();

  return (
    <>
      {/* Backdrop Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="filters-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 z-10"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Filters Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.section
            key="filters-sidebar"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="mx-auto backdrop-filter backdrop-blur-md bg-white/80 max-w-sm fixed left-0 h-screen z-20 top-0 overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="font-utendo font-bold text-xl">Filtros</h2>
              <button onClick={() => setOpen(false)} className="cursor-pointer p-2">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-4 space-y-1">
              {/* Search Input */}
              <Collapsible defaultOpen={true} className="border-b border-gray-200 pb-4">
                <CollapsibleTrigger asChild>
                  <button className="group w-full text-left flex items-center justify-between py-3 hover:text-black transition-colors">
                    <span className="">Nombre del producto</span>
                    <ChevronDownIcon className="w-5 h-5 transition-transform group-data-[state=open]:rotate-180" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <SearchInput />
                </CollapsibleContent>
              </Collapsible>

              {/* Dynamic Filters */}
              {availableFilters.map((filter) => (
                <Collapsible key={filter.id} defaultOpen={true} className="border-b border-gray-200 pb-4">
                  <CollapsibleTrigger asChild>
                    <button className="group w-full text-left flex items-center justify-between py-3 hover:text-black transition-colors">
                      <span className="">{filter.name}</span>
                      <ChevronDownIcon className="w-5 h-5 transition-transform group-data-[state=open]:rotate-180" />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-3">

                    {/* Filter Size (Talla) */}
                    {filter.code === 'SIZE' && (
                      <FilterSize sizes={filter.values.map((value) => value.value)} />
                    )}

                    {/* Filter Color */}
                    {filter.code === 'COLOR' && (
                      <FilterColor colors={filter.values} />
                    )}

                    {/* Filter Material */}
                    {filter.code === 'MATERIAL' && (
                      <FilterMaterial materials={filter.values} />
                    )}
                  </CollapsibleContent>
                </Collapsible>
              ))}

              {/* Price Filter */}
              <Collapsible defaultOpen={true} className="border-b border-gray-200 pb-4">
                <CollapsibleTrigger asChild>
                  <button className="group w-full text-left flex items-center justify-between py-3 hover:text-black transition-colors">
                    <span className="">Precio</span>
                    <ChevronDownIcon className="w-5 h-5 transition-transform group-data-[state=open]:rotate-180" />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <MinAndMax />
                </CollapsibleContent>
              </Collapsible>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
