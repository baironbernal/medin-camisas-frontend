
'use client';

import { ChevronDownIcon, Funnel } from 'lucide-react';
import { useFiltersUI } from '../../providers/filters-ui';

export const Sort = () => {

const { setOpen } = useFiltersUI();

  return (
    <section className="flex justify-between items-center py-6">
        <div>
            <p>Ver todo (100)</p>
        </div>        
        <article className="flex gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setOpen(true)}>
                <p>Mostrar Filtros</p>
                <Funnel />
            </div>
            <div className="flex items-center gap-2 cursor-pointer">
                <p>Ordenar por</p>
                <ChevronDownIcon />
            </div>
        </article>
    </section>
  )
}
