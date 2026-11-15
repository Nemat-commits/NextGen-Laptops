import Fuse from 'fuse.js';
import type {Product} from './inventory';
import {matchesFilters, type Filters} from './filters';

type SearchEntry={product:Product;search:string;title:string;order:number};
const compact=(text:string)=>text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'');

export function createSearchIndex(products:Product[]){
 const entries:SearchEntry[]=products.map((product,order)=>({product,order,title:compact(product.title),search:compact(`${product.title} ${product.brand} ${product.cpu} ${product.description} ${product.ram_gb||''}gb ${product.storage_gb||''}gb ${product.condition||''}`)}));
 const fuse=new Fuse(entries,{keys:['search'],ignoreLocation:true,threshold:.28,includeScore:true});
 return {entries,fuse};
}

export function searchProducts(index:ReturnType<typeof createSearchIndex>,filters:Filters):Product[]{
 const tokens=filters.q.trim().split(/\s+/).map(compact).filter(Boolean);
 const fuzzy=tokens.map(token=>new Map(index.fuse.search(token).map(match=>[match.item.product.id,match.score??1])));
 // An explicitly named brand is a constraint, not a fuzzy match against another brand.
 const brands=new Set(index.entries.map(entry=>compact(entry.product.brand)).filter(Boolean));
 const requestedBrands=tokens.filter(token=>brands.has(token));
 const matches=index.entries.flatMap(entry=>{
  if(!matchesFilters(entry.product,filters)||!requestedBrands.every(brand=>compact(entry.product.brand)===brand))return [];
  const exact=tokens.map(token=>entry.search.includes(token));
  if(!tokens.every((_,i)=>exact[i]||fuzzy[i].has(entry.product.id)))return [];
  const allExact=exact.every(Boolean);
  const titleMatches=tokens.filter(token=>entry.title.includes(token)).length;
  const modelMatches=tokens.filter(token=>/\d/.test(token)&&entry.title.includes(token)).length;
  const exactCount=exact.filter(Boolean).length;
  const fuzzyScore=tokens.reduce((sum,_,i)=>sum+(exact[i]?0:(fuzzy[i].get(entry.product.id)??1)),0);
  return [{...entry,allExact,titleMatches,modelMatches,exactCount,fuzzyScore}];
 });
 matches.sort((a,b)=>{
  const ap=a.product.discount_price_pkr??a.product.price_pkr,bp=b.product.discount_price_pkr??b.product.price_pkr;
  if(filters.sort==='name')return a.product.title.localeCompare(b.product.title)||a.order-b.order;
  if(filters.sort==='price-low'||filters.sort==='price-high'){
   if(ap==null)return bp==null?a.order-b.order:1;
   if(bp==null)return -1;
   return (filters.sort==='price-low'?ap-bp:bp-ap)||a.order-b.order;
  }
  if(!tokens.length)return a.order-b.order;
  return Number(b.allExact)-Number(a.allExact)||b.modelMatches-a.modelMatches||b.exactCount-a.exactCount||b.titleMatches-a.titleMatches||a.fuzzyScore-b.fuzzyScore||a.order-b.order;
 });
 return matches.map(match=>match.product);
}
