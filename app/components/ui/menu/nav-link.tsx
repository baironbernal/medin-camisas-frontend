// components/NavLink.tsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useCallback, useMemo } from 'react';

function NavLinkContent({ href, children, className, onClick }: 
    { href: string, children: React.ReactNode, className?: string, onClick?: () => void }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const isActive = useMemo(() => {
        const category = searchParams.get('category');
        const currentPath = category ? `${pathname}?category=${category}` : pathname;
        return href === currentPath;
    }, [pathname, searchParams, href]);

    const activeStyle = 'text-beige relative after:content-[""] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-beige active-link';

    return (
      <Link href={href} onClick={onClick} className={`${isActive ? activeStyle : ''} ${className}`}>
        {children}
      </Link>
    );
}

export default function NavLink({ href, children, className, onClick }: 
    { href: string, children: React.ReactNode, className?: string, onClick?: () => void }) {
    return (
        <Suspense fallback={
            <Link href={href} onClick={onClick} className={className}>
                {children}
            </Link>
        }>
            <NavLinkContent href={href} children={children} className={className} onClick={onClick} />
        </Suspense>
    )
}
