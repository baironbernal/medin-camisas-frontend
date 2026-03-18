'use client'

import { useQueryState } from "nuqs"

export default function MinAndMax() {
    const [min, setMin] = useQueryState('min_cost', { shallow: false })
    const [max, setMax] = useQueryState('max_cost', { shallow: false })
    
  return (
    <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-600">Precio mínimo</label>
            <input 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black transition-all bg-transparent placeholder:text-gray-400" 
                type="number" 
                placeholder="$0"
                value={min || ''} 
                onChange={(e) => setMin(e.target.value || null)} 
            />
        </div>
        <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-600">Precio máximo</label>
            <input 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black transition-all bg-transparent placeholder:text-gray-400" 
                type="number" 
                placeholder="$999"
                value={max || ''} 
                onChange={(e) => setMax(e.target.value || null)} 
            />
        </div>
    </div>
  )
}

