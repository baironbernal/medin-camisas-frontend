"use client";

import { createContext, useContext, useState } from "react";

type FiltersUIContextType = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const FiltersUIContext = createContext<FiltersUIContextType | null>(null);

export function FiltersUIProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <FiltersUIContext.Provider value={{ open, setOpen }}>
      {children}
    </FiltersUIContext.Provider>
  );
}

export function useFiltersUI() {
  const ctx = useContext(FiltersUIContext);
  if (!ctx) throw new Error("useFiltersUI must be used inside FiltersUIProvider");
  return ctx;
}