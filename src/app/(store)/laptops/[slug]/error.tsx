'use client';
import {startTransition} from 'react';
import {useRouter} from 'next/navigation';
export default function ProductError({reset}:{error:Error & {digest?:string};reset:()=>void}) {
 const router=useRouter();
 return <main className="wrap detail"><h1>Product temporarily unavailable</h1><p>We couldn’t load this product right now. Please try again or contact the shop.</p><button className="primary-button" onClick={()=>startTransition(()=>{router.refresh();reset()})}>Try again</button></main>;
}
