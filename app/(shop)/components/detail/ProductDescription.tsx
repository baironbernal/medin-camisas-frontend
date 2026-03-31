import { Truck, Percent, Package } from 'lucide-react';

interface ProductDescriptionProps {
  description?: string;
}

const DEFAULT_DESCRIPTION =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';

export default function ProductDescription({ description }: ProductDescriptionProps) {
  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-semibold text-primary">Descripción:</h3>
        <p className="text-secondary text-sm leading-relaxed whitespace-pre-wrap">
          {description || DEFAULT_DESCRIPTION}
        </p>
      </div>

      <div className="bg-accent-light/50 border border-gray-200 rounded-xl p-6 mt-4 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Truck size={24} className="text-primary shrink-0" />
          <p className="text-sm text-primary">Tiempo de entrega de <span className="font-bold">2-4 días</span></p>
        </div>
        <div className="h-px bg-gray-200 border-t border-dashed w-full" />
        <div className="flex items-center gap-4">
          <Percent size={24} className="text-primary shrink-0" />
          <p className="text-sm text-primary">Regístrate y <span className="font-bold">conviértete en mayorista</span> para acceder a mejores precios</p>
        </div>
        <div className="h-px bg-gray-200 border-t border-dashed w-full" />
        <div className="flex items-center gap-4">
          <Package size={24} className="text-primary shrink-0" />
          <p className="text-sm text-primary font-medium tracking-tight">Envíos a Nivel Nacional</p>
        </div>
      </div>
    </div>
  );
}
