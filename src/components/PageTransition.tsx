'use client';
import {usePathname} from 'next/navigation';
import type {ReactNode} from 'react';

/** Remount only the page wrapper on pathname changes, not on filter/query changes. */
export default function PageTransition({children}:{children:ReactNode}){
 const pathname=usePathname();
 return <div className="page-transition" key={pathname}>{children}</div>;
}
