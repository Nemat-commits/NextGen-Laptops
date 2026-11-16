import type {Category,Product} from './inventory';
import {normalizeBrand} from './brands';

export type AdminProduct=Pick<Product,'id'|'slug'|'title'|'brand'|'category_id'|'cpu'|'ram_gb'|'storage_gb'|'quantity'|'price_pkr'|'stock_status'|'is_published'|'is_featured'>;
export type AdminFilters={query:string;category:string;brand:string;publication:string;stock:string;featured:string};
export const emptyAdminFilters=():AdminFilters=>({query:'',category:'',brand:'',publication:'',stock:'',featured:''});
const normalize=(value:string)=>value.toLocaleLowerCase('en').trim().replace(/\s+/g,' ');
export function adminBrands(products:AdminProduct[]):string[]{
 const brands=new Map<string,string>();
 for(const p of products){const label=(p.brand||'').trim().replace(/\s+/g,' '),key=normalizeBrand(label);if(key&&!brands.has(key))brands.set(key,label)}
 return [...brands.values()].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
}
export function filterAdminProducts(products:AdminProduct[],categories:Category[],f:AdminFilters):AdminProduct[]{
 const tokens=normalize(f.query).split(' ').filter(Boolean);
 const names=new Map(categories.map(c=>[c.id,c.name]));
 return products.filter(p=>{
  const search=normalize([p.title,p.slug,p.brand,p.cpu,names.get(p.category_id),p.ram_gb!=null?`${p.ram_gb} GB RAM`:null,p.storage_gb!=null?`${p.storage_gb} GB storage`:null].filter(Boolean).join(' '));
  return tokens.every(t=>search.includes(t))&&(!f.category||p.category_id===f.category)&&(!f.brand||normalizeBrand(p.brand||'')===normalizeBrand(f.brand))&&(!f.publication||(f.publication==='published'?p.is_published:!p.is_published))&&(!f.stock||p.stock_status===f.stock)&&(!f.featured||(f.featured==='featured'?!!p.is_featured:!p.is_featured));
 });
}
