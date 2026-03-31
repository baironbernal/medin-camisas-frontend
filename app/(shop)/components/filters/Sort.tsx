'use client';

import { ChevronDownIcon, Funnel } from 'lucide-react';
import { useFiltersUI, SORT_OPTIONS } from '../../useContext/FiltersContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

// 💡 1. Lógica de URL centralizada fuera del componente (Pure Functions)
const getSortValueFromParams = (orderBy: string | null, orderDir: string | null) => {
  if (!orderBy) return 'newest';
  if (orderBy === 'created_at') return orderDir === 'asc' ? 'created_at' : 'newest';
  return `${orderBy}_${orderDir || 'asc'}`;
};

export default function Sort() {
  const { setOpen, sortBy, setSortBy } = useFiltersUI();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = SORT_OPTIONS.find((o) => o.value === sortBy);

  // 💡 2. URLSearchParams actualizado de forma limpia
  const handleSortChange = useCallback((value: string) => {
    setSortBy(value as typeof sortBy);
    setIsOpen(false);

    const params = new URLSearchParams(window.location.search); // Evita recrear el callback si searchParams cambia
    const [orderBy, orderDir] = value.split('_');

    if (value === 'created_at' || value === 'newest') {
      params.set('order_by', 'created_at');
      params.set('order_dir', value === 'newest' ? 'desc' : 'asc');
    } else {
      params.set('order_by', orderBy);
      params.set('order_dir', orderDir || 'asc');
    }

    router.push(`?${params.toString()}`, { scroll: false }); // scroll: false evita saltos de pantalla incómodos
  }, [router, setSortBy]);

  // 💡 3. Sincronización de URL -> Estado simplificada
  useEffect(() => {
    const orderBy = searchParams.get('order_by');
    const orderDir = searchParams.get('order_dir');
    const computedSort = getSortValueFromParams(orderBy, orderDir);

    if (computedSort !== sortBy) {
      setSortBy(computedSort as typeof sortBy);
    }
  }, [searchParams, sortBy, setSortBy]);

  // Manejo de clicks externos
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="flex lg:justify-end justify-center items-center py-6 bg-beige">
      <div>
      </div>

      <article className="flex gap-6 select-none text-sm lg:text-base">
        {/* 💡 4. El dropdown-ref ahora envuelve al botón correcto */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-tertiary transition-colors"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <p>
              Ordenar por: <span className="font-semibold">{currentOption?.label}</span>
            </p>
            <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl z-50 overflow-hidden">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                    ${sortBy === option.value 
                      ? 'bg-primary text-white font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-tertiary transition-colors"
        >
          <p>Filtros</p>
          <Funnel className="w-4 h-4" />
        </button>
      </article>
    </section>
  );
}