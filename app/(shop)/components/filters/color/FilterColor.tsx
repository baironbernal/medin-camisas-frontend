'use client'

import { useQueryState } from "nuqs"
import { Value } from "@/types/filters"

export default function FilterColor({colors}: {colors: Value[]}) {
  const [selectedColor, setSelectedColor] = useQueryState('color', { shallow: false })
  
  return (
    <div className="flex flex-wrap gap-4 w-full">
      {colors.map((color) => {
        const isSelected = selectedColor === color.value
        
        return (
          <button
            key={color.id}
            onClick={() => setSelectedColor(isSelected ? null : color.value)}
            className="flex flex-col items-center gap-2 group"
          >
            <div 
              className={`w-12 h-12 rounded-lg transition-all ${
                isSelected 
                  ? 'ring-2 ring-black ring-offset-2' 
                  : 'hover:scale-110'
              } ${color.hex_color === '#FFFFFF' || color.hex_color === '#ffffff' ? 'border border-gray-300' : ''}`}
              style={{ backgroundColor: color.hex_color || '#CCCCCC' }}
            />
            <span className={`text-xs ${isSelected ? 'font-semibold' : ''}`}>
              {color.value}
            </span>
          </button>
        )
      })}
    </div>
  )
}
