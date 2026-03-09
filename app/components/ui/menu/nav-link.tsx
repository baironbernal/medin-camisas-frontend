// components/NavLink.tsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useCallback } from 'react';

function NavLinkContent({ href, children, className }: 
    { href: string, children: React.ReactNode, className?: string }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const isActive = href.includes(pathname+ '?' + '='+ searchParams.get('category') || '');

    const activeStyle = 'text-beige font-semibold border-b-2 border-beige';

    return (
      <Link href={href} className={`${isActive ? activeStyle : ''} ${className}`}>
        {children}
      </Link>
    );
}

export default function NavLink({ href, children, className }: 
    { href: string, children: React.ReactNode, className?: string }) {
    return (
        <Suspense fallback={
            <Link href={href} className={className}>
                {children}
            </Link>
        }>
            <NavLinkContent href={href} children={children} className={className} />
        </Suspense>
    )
}
