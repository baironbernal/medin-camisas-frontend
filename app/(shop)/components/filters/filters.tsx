"use client";

import { Filter } from "@/types/filters";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDownIcon } from "lucide-react";
import { X } from 'lucide-react';
import { useFiltersUI } from "../../providers/filters-ui";


export interface FiltersSidebarProps {
  availableFilters: Filter[];
}
export function FiltersSidebar({ availableFilters }: FiltersSidebarProps) {
  const { isOpen, setOpen } = useFiltersUI();

  return (
    <>
      {/* Filters  */}
      {isOpen && (
        <section className="mx-auto w-full max-w-sm fixed left-0 h-screen bg-beige z-20 top-0 p-8">
      <div className="flex justify-between items-center">
        <h2 className="font-utendo font-bold text-2xl">Filtros</h2>
         <X onClick={() => {
          setOpen(false);
         }} className="cursor-pointer" />
      </div>
      {availableFilters.map((filter) => (
        <Collapsible key={filter.id} className="data-[state=open]:bg-transparent rounded-md">
          <CollapsibleTrigger asChild>
            <button className="group w-full text-left">
              {filter.name}
              <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
            <div>
              {filter.values.map((value) => (
                <div key={value.id}>
                  <input type="checkbox" id={value.value} />
                  <label htmlFor={value.value}>{value.value}</label>
                </div>
              ))} 
            </div>
            
          </CollapsibleContent>
        </Collapsible>
      ))}
    </section>
      )}
    </>
  );
}