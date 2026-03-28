'use client'

import { useQueryState } from "nuqs"

export default function FilterSize({sizes}: {sizes: string[]}) {
    const [selectedSize, setSelectedSize] = useQueryState('size', { shallow: false })
    
    return (
        <div className="flex flex-wrap gap-3 w-full">
            {sizes.map((sizeOption) => {
                const isSelected = selectedSize === sizeOption;
                
                return (
                    <button 
                        key={sizeOption} 
                        onClick={() => setSelectedSize(isSelected ? null : sizeOption)} 
                        className={`
                            py-2 px-4 rounded-full border-gray-400 transition-all cursor-pointer font-medium 
                            border-1 border-black
                            ${isSelected 
                                ? 'bg-black text-white' 
                                : 'bg-transparent text-gray-600 hover:bg-black/5'
                            }
                        `}
                    >
                        {sizeOption}
                    </button>
                )
            })}
        </div>
    )
}