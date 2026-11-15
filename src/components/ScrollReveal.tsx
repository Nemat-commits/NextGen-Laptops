'use client';
import {useEffect} from 'react';

/** Enhances visible content only when observers and motion are available. */
export default function ScrollReveal(){
 useEffect(()=>{
  if(typeof IntersectionObserver==='undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const observed=new WeakSet<Element>();
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(entry.isIntersecting){entry.target.classList.remove('reveal-pending');entry.target.classList.add('reveal-visible');observer.unobserve(entry.target)}
   }
  },{rootMargin:'0px 0px -40px 0px',threshold:0});
  const register=(root:ParentNode,initial=false)=>{
   const targets:Element[]=[];
   if(root instanceof Element && root.matches('[data-reveal]'))targets.push(root);
   targets.push(...root.querySelectorAll('[data-reveal]'));
   for(const el of targets){
    if(observed.has(el))continue;
    observed.add(el);
    // Never hide content already visible when hydration occurs, or content above the viewport.
    const rect=el.getBoundingClientRect();
    if(initial && rect.top<window.innerHeight && rect.bottom>0)continue;
    if(rect.bottom<=0)continue;
    el.classList.add('reveal-pending');
    observer.observe(el);
   }
  };
  register(document,true);
  const mutations=new MutationObserver(records=>{
   for(const record of records)for(const node of record.addedNodes)if(node instanceof Element)register(node);
  });
  mutations.observe(document.body,{childList:true,subtree:true});
  return ()=>{mutations.disconnect();observer.disconnect();document.querySelectorAll('.reveal-pending').forEach(el=>el.classList.remove('reveal-pending'))};
 },[]);
 return null;
}
