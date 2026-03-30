import { Value } from '@/types/filters'
import { useQueryState } from "nuqs"

export const FilterMaterial = ({ materials }: { materials: Value[] }) => {
  const [selectedMaterial, setSelectedMaterial] = useQueryState('material', { shallow: false })

  return (
    <div className="flex flex-col gap-2">
      {materials.map((material) => {
        const isSelected = selectedMaterial === material.value
        
        return (
          <label 
            key={material.id} 
            className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer hover:bg-gray-50 ${
              isSelected ? 'bg-gray-100' : ''
            }`}
          >
            {/* Custom Checkbox/Radio */}
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => setSelectedMaterial(isSelected ? null : material.value)}
              className="w-3 h-3 rounded border-gray-300 transition-all cursor-pointer"
              // This dynamically sets the checkmark/fill color to the material color
              style={{ accentColor: material.hex_color || '#000000' }}
            />

            {/* Material Label */}
            <span className={`text-sm ${isSelected ? 'font-bold text-black' : 'text-gray-700'}`}>
              {material.value}
            </span>

            {/* Optional: Small color dot at the end for confirmation */}
            <div 
              className="ml-auto w-3 h-3 rounded-full border border-gray-200" 
              style={{ backgroundColor: material.hex_color }} 
            />
          </label>
        )
      })}
    </div>
  )
}