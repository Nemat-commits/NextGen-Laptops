import type {Product} from './inventory';
/** Prefer a diverse set of available brands before adding another model from any brand. */
export function featuredProducts(products:Product[],limit=4):Product[]{
 const selected=products.filter(p=>p.is_published && p.is_featured);
 if(selected.length)return selected;
 const eligible=products.filter(p=>p.is_published && p.image_url);
 const result:Product[]=[], brands=new Set<string>(), titles=new Set<string>();
 for(const p of eligible){const brand=p.brand.trim().toLowerCase();const title=p.title.trim().toLowerCase();if(!brand||brands.has(brand)||titles.has(title))continue;result.push(p);brands.add(brand);titles.add(title);if(result.length===limit)return result;}
 for(const p of eligible){const title=p.title.trim().toLowerCase();if(titles.has(title))continue;result.push(p);titles.add(title);if(result.length===limit)break;}
 return result.slice(0,limit);
}
