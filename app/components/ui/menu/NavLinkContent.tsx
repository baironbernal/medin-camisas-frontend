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

    const baseStyle = "relative text-white/70 transition-colors duration-300 hover:text-beige";

    // 2. La línea mágica (se expande al hacer Hover Y se queda fija si está activo)
    const lineStyle = `
        after:absolute after:bottom-[-6px] after:left-0 after:h-[2px] after:w-full 
        after:bg-beige after:transition-transform after:duration-300 after:origin-center
    `;

    // 3. Controlamos si se expande por Hover o si ya está expandida por estar activo
    const stateStyle = isActive 
        ? "text-beige after:scale-x-100" // Activo: Se queda la línea expandida y texto beige
        : "after:scale-x-0 hover:after:scale-x-100"; // Inactivo: Animación clásica de Hover
    

    return (
      <Link href={href} onClick={onClick} className={`${baseStyle} ${lineStyle} ${stateStyle} ${className}`}>
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
