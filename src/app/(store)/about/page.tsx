import type {Metadata} from 'next';
import {ArrowUpRight, Phone} from 'lucide-react';
import SocialLinks from '@/components/SocialLinks';

export const metadata:Metadata={title:'About us',description:'Meet Ashar Mehmood and learn about NextGen Laptops in Abbottabad.'};

export default function About(){return <main><section className="about-section wrap"><div className="about-copy" data-reveal><div className="eyebrow">THE PERSON BEHIND NEXTGEN</div><h1>Meet Ashar Mehmood<span className="accent">.</span></h1><p>A university student with around five years in the laptop business, Ashar combines his passion for technology with a commitment to helping customers find the right laptop at a great price.</p><p>From Abbottabad to customers across Pakistan, he has made deliveries nationwide and is always happy to help you explore your options.</p><a className="about-phone" href="tel:03215744034"><Phone size={17}/> Talk to Ashar · 0321 5744034 <ArrowUpRight size={16}/></a></div><div className="about-side" data-reveal><span className="about-number">05<span> / YEARS IN BUSINESS, APPROX.</span></span><p>Good tech. Honest conversation.<br/>A better fit for your everyday.</p><div className="about-social"><strong>FIND US ON SOCIAL</strong><SocialLinks/></div></div></section></main>}
