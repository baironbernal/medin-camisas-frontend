// components/NavLink.tsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function NavLink({ href, children, className }: 
    { href: string, children: React.ReactNode, className?: string }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()


    console.log(href )
    const isActive = href.includes(pathname+ '?' + '='+ searchParams.get('category') || '');

  const activeStyle = 'text-beige font-semibold border-b-2 border-beige';

  return (
    <Link href={href} className={`${isActive ? activeStyle : ''} ${className}`}>
      {children}
    </Link>
  );
}
