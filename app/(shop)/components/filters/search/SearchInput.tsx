'use client'

import { useQueryState } from 'nuqs'
import { Search, X } from 'lucide-react'

export default function SearchInput() {

  const [name, setName] = useQueryState('name', { shallow: false })
  
  return (
    <div className='relative w-full mb-4'>
      <div className="relative">
        <input 
          className='w-full pl-10 pr-10 py-2 border border-black rounded-lg focus:outline-none focus:ring-1 focus:ring-black transition-all bg-transparent placeholder:text-gray-500' 
          placeholder="Buscar..."
          value={name || ''} 
          onChange={e => setName(e.target.value || null)} 
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
        
        {name && (
          <button 
            onClick={() => setName(null)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}