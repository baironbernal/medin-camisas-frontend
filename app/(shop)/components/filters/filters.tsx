"use client";

import { Filter } from "@/types/filters";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDownIcon } from "lucide-react";
import { X } from 'lucide-react';
import { useFiltersUI } from "../../context/filters-ui";
import { SearchInput } from "./search/search";
import { MinAndMax } from "./price/minAndMax";
import { FilterSize } from "./size/filterSize";
import { FilterType } from "./clothing-type/filterType";
import { FilterColor } from "./color/FilterColor";


export interface FiltersSidebarProps {
  availableFilters: Filter[];
}
export function FiltersSidebar({ availableFilters }: FiltersSidebarProps) {
  const { open, setOpen } = useFiltersUI();

  return (
    <>
      {/* Backdrop Overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/30 z-10 transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Filters Sidebar */}
      {open && (
        <section className="mx-auto w-full bg-accent-light max-w-sm fixed left-0 h-screen z-20 top-0 overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 bg-accent-light border-b border-gray-200 px-6 py-4 flex justify-between items-center">
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
                  {/* Filter Type (Categoria) */}
                  {filter.code === 'TYPE' && (
                    <FilterType types={filter.values.map((value) => value.value)} />
                  )}
                  
                  {/* Filter Size (Talla) */}
                  {filter.code === 'SIZE' && (
                    <FilterSize sizes={filter.values.map((value) => value.value)} />
                  )}

                  {/* Filter Color */}
                  {filter.code === 'COLOR' && (
                    <FilterColor colors={filter.values} />
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