import {notFound} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {ArrowLeft,ArrowRight,ArrowUpRight,MessageCircle} from 'lucide-react';
import type {Metadata} from 'next';
import ProductCard from '@/components/ProductCard';
import {catalog} from '@/lib/catalog';
import ProductPrice from '@/components/ProductPrice';
import {modelReference} from '@/lib/model-specs';
import {relatedProducts} from '@/lib/related';
import {manufacturerDetails} from '@/lib/manufacturer-details';

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;const {products}=await catalog();const p=products.find(x=>x.slug===slug);
 return p?{title:p.title,description:p.description,openGraph:{title:p.title,description:p.description,...(p.image_url?{images:[p.image_url]}:{})}}:{title:'Product not found'};
}
export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const {products,categories}=await catalog();const p=products.find(x=>x.slug===slug);if(!p)notFound();
 const reference=modelReference(p), manufacturerSpecs=manufacturerDetails(p), related=relatedProducts(p,products);
 const imageSource=p.image_source?.trim();
 const wa=(process.env.NEXT_PUBLIC_SHOP_WHATSAPP || '923215744034').replace(/\D/g,'');
 const specs:[string,string][]=[['Brand',p.brand||'Not confirmed'],['Processor',p.cpu||'Not confirmed'],['Memory',p.ram_gb?`${p.ram_gb} GB`:'Not confirmed'],['Storage capacity',p.storage_gb?`${p.storage_gb} GB`:'Not confirmed'],['Condition',p.condition||'Not confirmed'],...Object.entries(p.extra_specs||{})];
 const message=[p.title,p.cpu,p.ram_gb?`${p.ram_gb} GB RAM`:null,p.storage_gb?`${p.storage_gb} GB storage`:null].filter(Boolean).join(', ');
 return <main className="wrap detail">
  <Link href="/shop" className="back"><ArrowLeft size={16}/> Back to collection</Link>
  <div className="detail-layout"><div className="detail-image"><Image src={p.image_url||'/laptop-placeholder.svg'} alt={p.image_url?p.title:'Product photo pending'} fill sizes="(max-width:800px) 100vw, 50vw" unoptimized={!!p.image_url}/></div>
   <div className="detail-copy"><div className="eyebrow">{p.brand} / {categories.find(c=>c.id===p.category_id)?.name||'PRODUCT'}</div><h1>{p.title}</h1><p className="detail-sub">{[p.cpu,p.ram_gb&&`${p.ram_gb} GB RAM`,p.storage_gb&&`${p.storage_gb} GB storage`].filter(Boolean).join(' · ')}</p><div className="detail-price"><ProductPrice original={p.price_pkr} discount={p.discount_price_pkr}/></div><p className="stock">{p.stock_status==='unconfirmed'?'Availability to be confirmed':p.stock_status.replaceAll('_',' ')}</p><p className="description">{p.description}</p>
    {wa?<a className="primary-button" href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hello, I'm interested in ${message}. Please share price and availability.`)}`} target="_blank" rel="noreferrer"><MessageCircle size={18}/> Enquire on WhatsApp <ArrowUpRight size={17}/></a>:<p className="notice-inline">Contact the shop to confirm price and availability.</p>}
    {imageSource&&<p className="source"><a href={imageSource} target="_blank" rel="noreferrer">Manufacturer image source ↗</a> · Image may not represent the exact configuration.</p>}
   </div></div>
  <section className="spec-section" data-reveal><div><div className="eyebrow">THE DETAILS</div><h2>Specifications<span className="accent">.</span></h2><p>Details listed for this item. Ask the shop to confirm its exact configuration and condition.</p></div><dl>{specs.map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></section>
  {imageSource&&<section className="reference-section" data-reveal><div><div className="eyebrow">MANUFACTURER REFERENCE</div><h2>More about this model<span className="accent">.</span></h2><p>Manufacturers offered different configurations. These are model-family details, not a guarantee of the features on this particular unit.</p>{reference?.note&&<p>{reference.note}</p>}{reference&&<a href={reference.source} target="_blank" rel="noreferrer" className="text-link">View model reference <ArrowUpRight size={16}/></a>}</div><dl>{reference?<><div><dt>Display size</dt><dd>{reference.display}</dd></div><div><dt>Display options</dt><dd>{reference.options}</dd></div></>:<div><dt>Display</dt><dd>Exact model or display details need confirmation</dd></div>}{manufacturerSpecs.map(({label,value,source})=><div key={label}><dt>{label}</dt><dd>{value} <a className="spec-source" href={source} target="_blank" rel="noreferrer" aria-label={`Manufacturer source for ${label}`}>Source ↗</a></dd></div>)}<div><dt>Installed components, battery health &amp; warranty</dt><dd>Confirm with the shop</dd></div>{manufacturerSpecs.length<6&&<div><dt>Further details</dt><dd>Additional model specifications are still being researched. Consult the linked manufacturer documentation and confirm the exact unit with the shop.</dd></div>}</dl></section>}
  {related.length>0&&<section className="related-section"><div className="section-heading" data-reveal><div><div className="eyebrow">KEEP EXPLORING</div><h2>You might also like.</h2><p>More from the NextGen collection.</p></div><Link href="/shop" className="text-link">Browse all laptops <ArrowRight size={17}/></Link></div><div className="featured-grid">{related.map(item=><ProductCard key={item.id} product={item} categories={categories}/>)}</div></section>}
  <div className="detail-home" data-reveal><Link className="outline-button" href="/"><ArrowLeft size={17}/> Back to home</Link></div>
 </main>;
}
