'use client';
import Link from 'next/link';
import {Menu,X} from 'lucide-react';
import {useEffect,useRef,useState} from 'react';
import {usePathname} from 'next/navigation';
import {mainNavigation} from '@/lib/navigation';

export default function MobileNavigation(){
 const [open,setOpen]=useState(false);
 const button=useRef<HTMLButtonElement>(null), container=useRef<HTMLDivElement>(null);
 const pathname=usePathname();
 useEffect(()=>{setOpen(false)},[pathname]);
 useEffect(()=>{
  if(!open)return;
  const key=(event:KeyboardEvent)=>{if(event.key==='Escape'){setOpen(false);button.current?.focus()}};
  const outside=(event:PointerEvent)=>{if(!container.current?.contains(event.target as Node))setOpen(false)};
  const pop=()=>setOpen(false);
  const media=window.matchMedia('(min-width: 681px)');
  const resize=()=>{if(media.matches)setOpen(false)};
  document.addEventListener('keydown',key);document.addEventListener('pointerdown',outside);window.addEventListener('popstate',pop);media.addEventListener('change',resize);
  return()=>{document.removeEventListener('keydown',key);document.removeEventListener('pointerdown',outside);window.removeEventListener('popstate',pop);media.removeEventListener('change',resize)};
 },[open]);
 return <div className="mobile-navigation" ref={container}>
  <button className="mobile-menu" ref={button} type="button" aria-label={open?'Close navigation menu':'Open navigation menu'} aria-expanded={open} aria-controls="mobile-navigation-links" onClick={()=>setOpen(value=>!value)}>{open?<X size={23}/>:<Menu size={23}/>}</button>
  <nav id="mobile-navigation-links" className="mobile-nav-panel" aria-label="Mobile navigation" hidden={!open}>
   {mainNavigation.map(item=><Link href={item.href} key={item.href} onClick={()=>setOpen(false)}>{item.label}</Link>)}
  </nav>
 </div>;
}
