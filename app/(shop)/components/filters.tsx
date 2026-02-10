"use client";

import { useState, useCallback, useEffect } from "react";
import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter } from "@/types/filters";

export interface FiltersSidebarProps {
  availableFilters: Filter[];
}
export function FiltersSidebar({ availableFilters }: FiltersSidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    price: true,
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Helper to create a new query string
  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  /**
   * Abrir secciones por defecto
   */
  useEffect(() => {
    const initialState: Record<string, boolean> = { price: true };
    availableFilters?.forEach((filter) => {
      initialState[filter.code] = true;
    });
    setOpenSections((prev) => ({ ...prev, ...initialState }));
  }, [availableFilters]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  /**
   * Helpers de filtros
   */
  const isValueSelected = (code: string, value: string) => {
    const param = searchParams.get(code);
    if (!param) return false;
    return param.split(",").includes(value);
  };

  const toggleFilter = (code: string, value: string) => {
    const currentParam = searchParams.get(code);
    const currentValues = currentParam ? currentParam.split(",") : [];

    let nextValues: string[];
    if (currentValues.includes(value)) {
      nextValues = currentValues.filter((v) => v !== value);
    } else {
      nextValues = [...currentValues, value];
    }

    const nextValueString = nextValues.length > 0 ? nextValues.join(",") : null;
    
    router.push(pathname + "?" + createQueryString(code, nextValueString), {
      scroll: false,
    });
  };

  const updatePrice = (type: "min_cost" | "max_cost", value: string) => {
    router.push(pathname + "?" + createQueryString(type, value || null), {
      scroll: false,
    });
  };

  const clearAll = () => {
    router.push(pathname, { scroll: false });
  };

  const activeCount = Array.from(searchParams.entries()).length;

  // ... rest of render ...
  const sidebarContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-primary" />
          <span className="font-semibold text-primary font-heading">
            Filtros
          </span>
          {activeCount > 0 && (
            <span className="text-xs bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center font-sans">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-muted hover:text-primary underline font-sans"
          >
            Limpiar todo
          </button>
        )}
      </div>

      <div className="h-px bg-gray-200" />

      {/* Price */}
      <div>
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-sm font-medium text-primary font-heading"
        >
          Precio
          {openSections.price ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {openSections.price && (
          <div className="mt-3 space-y-3 font-sans">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-xs text-muted mb-1 block">Min</label>
                <input
                  type="number"
                  value={searchParams.get("min_cost") ?? ""}
                  onChange={(e) =>
                    updatePrice("min_cost", e.target.value)
                  }
                  className="h-9 text-sm w-full border border-gray-300 rounded-md px-2"
                  min={0}
                />
              </div>

              <span className="text-muted mt-5">-</span>

              <div className="flex-1">
                <label className="text-xs text-muted mb-1 block">Max</label>
                <input
                  type="number"
                  value={searchParams.get("max_cost") ?? ""}
                  onChange={(e) =>
                    updatePrice("max_cost", e.target.value)
                  }
                  className="h-9 text-sm w-full border border-gray-300 rounded-md px-2"
                  min={0}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-gray-200" />

      {/* Dynamic Filters */}
      {availableFilters.map((filter) => (
        <div key={filter.id}>
          <button
            onClick={() => toggleSection(filter.code)}
            className="flex items-center justify-between w-full text-sm font-medium text-primary font-heading py-2"
          >
            {filter.name}
            {openSections[filter.code] ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>

          {openSections[filter.code] && (
            <div className="mt-3">
              {filter.code === "color" ||
              filter.code === "color_primario" ? (
                <div className="grid grid-cols-2 gap-2">
                  {filter.values.map((val) => {
                    const isSelected = isValueSelected(
                      filter.code,
                      val.code
                    );

                    return (
                      <button
                        key={val.id}
                        onClick={() =>
                          toggleFilter(filter.code, val.code)
                        }
                        className={`px-2.5 py-2 rounded-md text-xs border ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-200 text-muted"
                        }`}
                      >
                        {val.value}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {filter.values.map((val) => {
                    const isSelected = isValueSelected(
                      filter.code,
                      val.code
                    );

                    return (
                      <button
                        key={val.id}
                        onClick={() =>
                          toggleFilter(filter.code, val.code)
                        }
                        className={`px-3 py-1.5 rounded-md text-xs border ${
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-gray-200 text-muted"
                        }`}
                      >
                        {val.value}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="h-px bg-gray-200 mt-4" />
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex justify-between px-4 py-2 border rounded-md"
        >
          <span className="flex gap-2">
            <SlidersHorizontal size={16} />
            Filtros
            {activeCount > 0 && (
              <span className="bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {activeCount}
              </span>
            )}
          </span>
          {mobileOpen ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>

        {mobileOpen && (
          <div className="mt-3 p-4 border rounded-lg bg-white">
            {sidebarContent}
            <button
              onClick={() => setMobileOpen(false)}
              className="w-full mt-4 bg-primary text-white py-2 rounded-md"
            >
              Aplicar filtros
            </button>
          </div>
        )}
      </div>

      {/* Desktop */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 p-5 border rounded-lg bg-white">
          {sidebarContent}
        </div>
      </aside>
    </>
  );
}