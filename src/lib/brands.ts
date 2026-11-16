import type {Product} from './inventory';
export const normalizeBrand=(value:string)=>value.trim().replace(/\s+/g,' ').toLocaleLowerCase('en');
/** Brands are taken from published products; case and extra spaces do not create duplicates. */
export function availableBrands(products:Product[]):string[]{
 const unique=new Map<string,string>();
 for(const p of products){if(!p.is_published)continue;const label=p.brand.trim().replace(/\s+/g,' '),key=normalizeBrand(label);if(key&&!unique.has(key))unique.set(key,label)}
 return [...unique.values()].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
}
