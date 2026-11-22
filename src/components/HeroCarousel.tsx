'use client';
import React, {useEffect,useRef,useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowRight,ArrowUpRight} from 'lucide-react';

const slides=[
 {theme:'everyday',kicker:'NEXTGEN LAPTOPS · ABBOTTABAD',title:'Find the laptop',accent:'that fits your life.',description:'From workdays to coursework, find your next laptop with a little help from our team.',image:'/products/dell-5420.webp',alt:'Dell Latitude laptop',label:'THE NEXTGEN COLLECTION',caption:'Work. Study. Create.'},
 {theme:'work',kicker:'NEXTGEN LAPTOPS · FOR WORK',title:'A better setup',accent:'for your workday.',description:'Explore laptops for your daily tasks, projects and everything in between.',image:'/products/hp-840-g8.webp',alt:'HP EliteBook laptop',label:'THE WORK EDIT',caption:'Get more done.'},
 {theme:'study',kicker:'NEXTGEN LAPTOPS · FOR STUDY',title:'Make room',accent:'for what’s next.',description:'Find a laptop for assignments, research and everyday browsing.',image:'/products/lenovo-l13-gen2.webp',alt:'Lenovo ThinkPad laptop',label:'THE STUDY EDIT',caption:'Ready to learn.'}
];
const SLIDE_INTERVAL=3000;
const SWIPE_DISTANCE=50;

export default function HeroCarousel(){
 const [index,setIndex]=useState(0);
 const [reducedMotion,setReducedMotion]=useState(false);
 const [focusPaused,setFocusPaused]=useState(false);
 const [interacting,setInteracting]=useState(false);
 const [announcement,setAnnouncement]=useState('');
 const start=useRef<{id:number;x:number;y:number}|null>(null);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const updateMotionPreference=()=>setReducedMotion(media.matches);
  updateMotionPreference();media.addEventListener('change',updateMotionPreference);
  return ()=>media.removeEventListener('change',updateMotionPreference);
 },[]);
 useEffect(()=>{
  if(reducedMotion||focusPaused||interacting)return;
  const timer=window.setInterval(()=>{if(document.visibilityState==='visible')setIndex(i=>(i+1)%slides.length)},SLIDE_INTERVAL);
  return ()=>window.clearInterval(timer);
 },[reducedMotion,focusPaused,interacting,index]);
 const select=(next:number)=>{const target=(next+slides.length)%slides.length;setIndex(target);setAnnouncement(`Slide ${target+1} of ${slides.length}: ${slides[target].title} ${slides[target].accent}`)};
 const slide=slides[index];
 return <section className="hero wrap" data-theme={slide.theme} aria-label="Featured laptop collection" aria-roledescription="carousel"
  onFocusCapture={e=>setFocusPaused((e.target as HTMLElement).matches(':focus-visible'))}
  onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node|null))setFocusPaused(false)}}
  onPointerDown={e=>{if(!e.isPrimary||(e.pointerType==='mouse'&&e.button!==0)||(e.target as HTMLElement).closest('a,button,input,select,textarea'))return;start.current={id:e.pointerId,x:e.clientX,y:e.clientY};setInteracting(true);e.currentTarget.setPointerCapture(e.pointerId)}}
  onPointerMove={e=>{const origin=start.current;if(!origin||origin.id!==e.pointerId)return;const dx=e.clientX-origin.x,dy=e.clientY-origin.y;if(Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy)*1.2){const limit=e.currentTarget.clientWidth*.18;e.currentTarget.classList.add('is-dragging');e.currentTarget.style.setProperty('--hero-drag',`${Math.max(-limit,Math.min(limit,dx*.45))}px`)}}}
  onPointerUp={e=>{const origin=start.current;start.current=null;setInteracting(false);e.currentTarget.classList.remove('is-dragging');e.currentTarget.style.removeProperty('--hero-drag');if(!origin||origin.id!==e.pointerId)return;const dx=e.clientX-origin.x,dy=e.clientY-origin.y;if(Math.abs(dx)>=SWIPE_DISTANCE&&Math.abs(dx)>Math.abs(dy)*1.2)select(index+(dx<0?1:-1));if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId)}}
  onPointerCancel={e=>{start.current=null;setInteracting(false);e.currentTarget.classList.remove('is-dragging');e.currentTarget.style.removeProperty('--hero-drag')}}
  onLostPointerCapture={e=>{if(start.current?.id===e.pointerId){start.current=null;setInteracting(false);e.currentTarget.classList.remove('is-dragging');e.currentTarget.style.removeProperty('--hero-drag')}}}
  onDragStart={e=>e.preventDefault()}
  onKeyDown={e=>{if(!(e.target as HTMLElement).closest('.hero-art'))return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();select(index+(e.key==='ArrowRight'?1:-1))}}}>
  <div className="hero-copy">
   <div className="hero-slide-words-stack">
    {slides.map((item,i)=><div key={item.theme} className={`hero-slide-words${i===index?' is-active':''}`} data-theme={item.theme} aria-hidden={i!==index}>
     <div className="hero-label"><span className="dot"/> {item.kicker}</div>
     {i===index?<h1>{item.title}<br/><span>{item.accent}</span></h1>:<div className="hero-heading">{item.title}<br/><span>{item.accent}</span></div>}
     <p>{item.description}</p>
    </div>)}
   </div>
   <div className="hero-actions"><Link className="primary-button" href="/shop">Explore laptops <ArrowRight size={18} aria-hidden="true"/></Link><a className="hero-contact" href="https://wa.me/923215744034" target="_blank" rel="noreferrer">Chat with us <ArrowUpRight size={15} aria-hidden="true"/></a></div>
  </div>
  <div className="hero-art" role="group" aria-roledescription="slide" aria-label={`${index+1} of ${slides.length}. Use left and right arrow keys to change slide`} tabIndex={0}>
   {slides.map((item,i)=><div key={item.image} className={`hero-slide-visual hero-slide-visual--${item.theme}${i===index?' is-active':''}`} aria-hidden={i!==index}>
    <div className="hero-image-label">{item.label} <span aria-hidden="true">{String(i+1).padStart(2,'0')} / {String(slides.length).padStart(2,'0')}</span></div>
    <Image className="hero-product" src={item.image} alt={item.alt} fill priority={i===0} loading={i===0?undefined:'eager'} sizes="(max-width:680px) 100vw, 50vw"/>
    <div className="hero-art-caption"><span>READY FOR WHAT'S NEXT</span><strong>{item.caption}</strong></div>
   </div>)}
   <div className="hero-pagination" role="group" aria-label="Choose slide">
    <span className="hero-swipe-hint" aria-hidden="true"><span className="hero-hint-desktop">DRAG TO EXPLORE</span><span className="hero-hint-touch">SWIPE TO EXPLORE</span></span>
    <div className="hero-dots">{slides.map((item,i)=><button key={item.image} type="button" aria-label={`Go to slide ${i+1}: ${item.title} ${item.accent}`} aria-current={index===i?'true':undefined} onClick={()=>select(i)}><span/></button>)}</div>
   </div>
  </div>
  <span className="visually-hidden" aria-live="polite" aria-atomic="true">{announcement}</span>
 </section>;
}
