import React from 'react';
import Link from 'next/link';
import LazyProductImage from './LazyProductImage';
import {ArrowUpRight,Cpu,HardDrive,MemoryStick} from 'lucide-react';
import type {Product,Category} from '@/lib/inventory';
import ProductPrice from './ProductPrice';

export default function ProductCard({product:p,categories}:{product:Product,categories:Category[]}){
 const kind=categories.find(c=>c.id===p.category_id)?.name||'Product';
 const availability=p.stock_status==='in_stock'?'In stock':p.stock_status==='out_of_stock'?'Out of stock':p.stock_status==='low_stock'?'Low stock':'Availability unconfirmed';
 const status=p.stock_status==='in_stock'?'in':p.stock_status==='out_of_stock'?'out':'other';
 const hasSpecs=!!p.cpu?.trim()||p.ram_gb!=null||p.storage_gb!=null;
 return <Link href={'/laptops/'+p.slug} className="card" data-reveal>
  <div className="card-img">
   <span className={`card-availability card-availability--${status}`}><span aria-hidden="true"/> {availability}</span>
   <LazyProductImage key={p.image_url||'placeholder'} src={p.image_url} alt={p.image_url?p.title:'Product image not yet available'}/>
  </div>
  <div className="card-content">
   <div className="card-kicker">{p.brand?.trim()||kind}{p.brand?.trim()&&<> <span>/</span> {kind}</>}</div>
   <h3>{p.title}</h3>
   {hasSpecs&&<div className="card-specs" aria-label="Product specifications">
    {p.cpu?.trim()&&<span className="card-spec card-spec--cpu"><Cpu size={14} aria-hidden="true"/>{p.cpu.trim()}</span>}
    {p.ram_gb!=null&&<span className="card-spec"><MemoryStick size={14} aria-hidden="true"/>{p.ram_gb} GB RAM</span>}
    {p.storage_gb!=null&&<span className="card-spec"><HardDrive size={14} aria-hidden="true"/>{p.storage_gb} GB storage</span>}
   </div>}
   <div className="card-bottom"><div className="card-price"><span className="card-price-label">PRICE</span><ProductPrice original={p.price_pkr} discount={p.discount_price_pkr}/></div><span className="card-details">View details <ArrowUpRight size={15} aria-hidden="true"/></span></div>
  </div>
 </Link>;
}
