import type {Product} from './inventory';
export function relatedProducts(product:Product, products:Product[], limit=4):Product[] {
 const score=(p:Product)=>(p.title===product.title?5:0)+(p.brand && p.brand.toLowerCase()===product.brand?.toLowerCase()?4:0)+(p.category_id===product.category_id?2:0)+(p.ram_gb!=null && p.ram_gb===product.ram_gb?1:0);
 const candidates=products.filter(p=>p.id!==product.id && p.slug!==product.slug && p.is_published).sort((a,b)=>score(b)-score(a));
 // Prefer a variety of models, then fill remaining spaces with other configurations.
 const unique:Product[]=[]; const deferred:Product[]=[];const titles=new Set<string>();
 for(const candidate of candidates){const key=candidate.title.toLowerCase();if(titles.has(key))deferred.push(candidate);else{titles.add(key);unique.push(candidate)}}
 return [...unique,...deferred].slice(0,limit);
}
