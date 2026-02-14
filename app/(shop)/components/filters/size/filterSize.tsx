'use client'

import { useQueryState } from "nuqs"


export const FilterSize = ({sizes}: {sizes: string[]}) => {
    const [selectedSize, setSelectedSize] = useQueryState('size', { shallow: false })
    
  return (
    <div className="grid grid-cols-3 gap-3 w-full">
        {sizes.map((sizeOption) => (
            <button 
                key={sizeOption} 
                onClick={() => setSelectedSize(selectedSize === sizeOption ? null : sizeOption)} 
                className={`py-3 border rounded-lg transition-all font-medium ${
                  selectedSize === sizeOption 
                    ? 'bg-black text-white border-black' 
                    : 'border-gray-300 hover:border-black'
                }`}
            >
                {sizeOption}
            </button>
        ))}
    </div>
  )
}

