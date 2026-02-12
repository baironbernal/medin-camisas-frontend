
'use client';

import { Funnel } from 'lucide-react';
import { useFiltersUI } from '../../providers/filters-ui';

export const Sort = () => {

const { setOpen } = useFiltersUI();

  return (
    <section className="flex justify-between items-center">
        <div>
            <p>Ver todo (100)</p>
        </div>        

        <div>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setOpen(true)}>
                <Funnel />
                <p>Mostrar Filtros</p>
            </div>
        </div>
    </section>
  )
}
