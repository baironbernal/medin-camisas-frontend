'use client'

import { useQueryState } from 'nuqs'

export function SearchInput() {

  const [name, setName] = useQueryState('name', { shallow: false })
  return (
    <div className='p-8 flex flex-col gap-2'>
      <input className=' border border-gray-300 rounded shadow-xl' value={name || ''} onChange={e => setName(e.target.value)} />
      <button onClick={() => setName(null)}>Clear</button>
      <p>Hello, {name || 'anonymous visitor'}!</p>
    </div>
  )
}