'use client';
import Image from 'next/image';
import React, {useState} from 'react';

/** Images load near the viewport; the shimmer represents a real pending image request. */
export default function LazyProductImage({src,alt}:{src:string|null;alt:string}){
 const [loaded,setLoaded]=useState(false);
 const [failed,setFailed]=useState(false);
 return <>
  {!loaded&&!failed&&<span className="product-image-skeleton" aria-hidden="true"/>}
  <Image src={failed?'/laptop-placeholder.svg':src||'/laptop-placeholder.svg'} alt={failed?'Product image unavailable':alt} fill sizes="(max-width:640px) 50vw, (max-width:1100px) 33vw, 25vw" loading="lazy" unoptimized={!!src&&!failed} onLoad={()=>setLoaded(true)} onError={()=>{setFailed(true);setLoaded(true)}}/>
 </>;
}
