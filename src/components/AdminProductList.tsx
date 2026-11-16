'use client';
import {useMemo,useState} from 'react';
import Link from 'next/link';
import type {Category} from '@/lib/inventory';
import {adminBrands,emptyAdminFilters,filterAdminProducts,type AdminFilters,type AdminProduct} from '@/lib/admin-product-filters';
import {price} from '@/lib/formatters';

export default function AdminProductList({products,categories}:{products:AdminProduct[],categories:Category[]}){
 const [filters,setFilters]=useState(emptyAdminFilters);
 const update=(key:keyof AdminFilters,value:string)=>setFilters(f=>({...f,[key]:value}));
 const brands=useMemo(()=>adminBrands(products),[products]);
 const results=useMemo(()=>filterAdminProducts(products,categories,filters),[products,categories,filters]);
 const active=Object.values(filters).some(Boolean);
 return <section aria-label="Find inventory products">
  <div className="admin-product-tools">
   <label className="admin-product-search">Search inventory<input type="search" placeholder="Name, brand, model or specs" value={filters.query} onChange={e=>update('query',e.target.value)}/></label>
   <div className="admin-product-filters">
    <label>Category<select value={filters.category} onChange={e=>update('category',e.target.value)}><option value="">All categories</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
    <label>Brand<select value={filters.brand} onChange={e=>update('brand',e.target.value)}><option value="">All brands</option>{brands.map(b=><option key={b} value={b}>{b}</option>)}</select></label>
    <label>Publication<select value={filters.publication} onChange={e=>update('publication',e.target.value)}><option value="">All products</option><option value="published">Published</option><option value="draft">Draft</option></select></label>
    <label>Availability<select value={filters.stock} onChange={e=>update('stock',e.target.value)}><option value="">All availability</option><option value="in_stock">In stock</option><option value="out_of_stock">Out of stock</option><option value="unconfirmed">Unconfirmed</option>{products.some(p=>p.stock_status==='low_stock')&&<option value="low_stock">Low stock</option>}</select></label>
    <label>Homepage<select value={filters.featured} onChange={e=>update('featured',e.target.value)}><option value="">All products</option><option value="featured">Featured</option><option value="not_featured">Not featured</option></select></label>
   </div>
   <div className="admin-results-bar"><p role="status" aria-live="polite">{results.length} of {products.length} {products.length===1?'product':'products'}</p><button type="button" disabled={!active} onClick={()=>setFilters(emptyAdminFilters())}>Clear search and filters</button></div>
  </div>
  <div className="admin-list">{results.map(p=><Link key={p.id} href={'/admin/products/'+p.id}><div><strong>{p.title}</strong><small>{[p.cpu?.trim(),p.is_published?'Published':'Draft',p.is_featured?'Featured on homepage':null,p.stock_status.replaceAll('_',' '),`${p.quantity} in inventory`].filter(Boolean).join(' · ')}</small></div><span>{price(p.price_pkr)} &nbsp; →</span></Link>)}{!products.length?<p>No products yet. Add one or run the inventory seed.</p>:!results.length&&<p>No products match. Try a different search or clear the filters.</p>}</div>
 </section>;
}
