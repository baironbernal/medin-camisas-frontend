'use client'

import { Checkbox } from "@/app/components/ui";
import { useQueryState } from "nuqs"


export const FilterType = ({types}: {types: string[]}) => {
  const [selectedType, setSelectedType] = useQueryState('type', { shallow: false })
  return (
    <div className="flex flex-col w-full gap-3">
      {types.map((type) => (
        <div key={type} className="flex items-center gap-3">
          <Checkbox 
            id={type} 
            name={type} 
            className="rounded-sm" 
            checked={selectedType === type} 
            onCheckedChange={(checked) => setSelectedType(checked ? type : null)} 
          />
          <label 
            htmlFor={type} 
            className="text-sm font-normal leading-none cursor-pointer select-none"
          >
            {type}
          </label>
        </div>
      ))}
    </div>
  )
}



