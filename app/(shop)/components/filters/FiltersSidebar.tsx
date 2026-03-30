"use client";

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

   const animClass = !open
    ? 'animate__animated animate__slideOutLeft animate__faster'
    : 'animate__animated animate__slideInLeft animate__faster';

  const backdropClass = !open
    ? 'animate__animated animate__fadeOut animate__faster'
    : 'animate__animated animate__fadeIn animate__faster';

  return (
    <>
      {/* Backdrop Overlay */}
      {open && (
        <div 
          className={`fixed inset-0 bg-black/70 z-10 transition-opacity ${backdropClass}`}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Filters Sidebar */}
      {open && (
        <section className={`mx-auto fade-in backdrop-filter backdrop-blur-md bg-white/80 w-full-\0[poir e] max-w-sm fixed left-0 h-screen z-20 top-0 overflow-y-auto shadow-2xl ${animClass}`}>
          {/* Header */}
          <div className="sticky top-0 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="font-utendo font-bold text-xl">Filtros</h2>
            <button onClick={() => setOpen(false)} className="cursor-pointer p-2 ">
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
        </section>
      )}
    </>
  );
}