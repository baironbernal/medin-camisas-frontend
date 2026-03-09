'use client';

import { ChevronDownIcon, Funnel } from 'lucide-react';
import { useFiltersUI, SORT_OPTIONS } from '../../context/filters-ui';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

export const Sort = () => {
  const { setOpen, sortBy, setSortBy } = useFiltersUI();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = SORT_OPTIONS.find(o => o.value === sortBy);

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value as typeof sortBy);
    setIsOpen(false);
    
    const params = new URLSearchParams(searchParams.toString());
    const [orderBy, orderDir] = value.split('_');
    
    if (value === 'created_at' || value === 'newest') {
      params.set('order_by', 'created_at');
      params.set('order_dir', value === 'newest' ? 'desc' : 'asc');
    } else if (orderBy === 'name' || orderBy === 'price') {
      params.set('order_by', orderBy);
      params.set('order_dir', orderDir);
    }
    
    router.push(`?${params.toString()}`);
  }, [searchParams, router, setSortBy]);

  useEffect(() => {
    const orderBy = searchParams.get('order_by');
    const orderDir = searchParams.get('order_dir');
    
    if (orderBy === 'name' && orderDir === 'asc') setSortBy('name_asc');
    else if (orderBy === 'name' && orderDir === 'desc') setSortBy('name_desc');
    else if (orderBy === 'price' && orderDir === 'asc') setSortBy('price_asc');
    else if (orderBy === 'price' && orderDir === 'desc') setSortBy('price_desc');
    else if (orderBy === 'created_at' && orderDir === 'desc') setSortBy('newest');
    else if (orderBy === 'created_at') setSortBy('created_at');
  }, [searchParams, setSortBy]);

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
    <section className="flex justify-between items-center py-6">
      <div>
        <p>Ver todo</p>
      </div>        
      <article className="flex gap-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setOpen(true)}>
          <p>Mostrar Filtros</p>
          <Funnel />
        </div>
        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <p>Ordenar por: <span className="font-medium">{currentOption?.label}</span></p>
            <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg
                    ${sortBy === option.value ? 'bg-primary text-white hover:bg-primary' : ''}
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </article>
    </section>
  );
};
