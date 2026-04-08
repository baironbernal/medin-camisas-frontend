'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NavbarSearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavbarSearchBar({ isOpen, onClose }: NavbarSearchBarProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    } else {
      setValue('');
    }
  }, [isOpen]);

  const handleSearch = () => {
    const q = value.trim();
    if (!q) return;
    router.push(`/coleccion?name=${encodeURIComponent(q)}`);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
    if (e.key === 'Escape') onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="navbar-search"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          className="overflow-hidden border-t border-white/10"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2">

              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-accent pointer-events-none"
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Buscar productos..."
                  className="
                    w-full bg-white/5 border border-white/15 rounded-full
                    pl-10 pr-9 py-2.5 text-sm text-white
                    placeholder:text-white/35
                    focus:outline-none focus:border-accent/60
                    transition-all duration-200
                  "
                />
                {value && (
                  <button
                    onClick={() => { setValue(''); inputRef.current?.focus(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    aria-label="Limpiar"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <button
                onClick={handleSearch}
                className="
                  shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full
                  bg-accent/15 border border-accent/30 text-accent text-sm
                  hover:bg-accent/25 hover:border-accent/50
                  transition-all duration-200
                "
                aria-label="Buscar"
              >
                <Search size={15} />
                <span className="hidden sm:inline">Buscar</span>
              </button>

              <button
                onClick={onClose}
                className="shrink-0 text-white/40 hover:text-white/70 transition-colors p-1"
                aria-label="Cerrar búsqueda"
              >
                <X size={18} />
              </button>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
