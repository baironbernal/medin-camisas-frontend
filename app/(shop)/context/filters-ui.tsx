"use client";

import { createContext, useContext, useState } from "react";

export type SortOption = 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'created_at' | 'newest';

type FiltersUIContextType = {
  open: boolean;
  setOpen: (v: boolean) => void;
  sortBy: SortOption;
  setSortBy: (v: SortOption) => void;
};

const FiltersUIContext = createContext<FiltersUIContextType | null>(null);

export function FiltersUIProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('created_at');

  return (
    <FiltersUIContext.Provider value={{ open, setOpen, sortBy, setSortBy }}>
      {children}
    </FiltersUIContext.Provider>
  );
}

export function useFiltersUI() {
  const ctx = useContext(FiltersUIContext);
  if (!ctx) throw new Error("useFiltersUI must be used inside FiltersUIProvider");
  return ctx;
}

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'created_at', label: 'Más antiguo' },
  { value: 'newest', label: 'Más reciente' },
  { value: 'name_asc', label: 'A-Z' },
  { value: 'name_desc', label: 'Z-A' },
  { value: 'price_asc', label: 'Precio menor' },
  { value: 'price_desc', label: 'Precio mayor' },
];