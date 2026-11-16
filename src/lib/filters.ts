import type {Product,Category} from './inventory';
import {availableBrands,normalizeBrand} from './brands';
export type Filters={q:string;brand:string[];category:string[];cpu:string[];generation:string[];ram:string[];storage:string[];condition:string[];stock:string[];min:string;max:string;deals:boolean;sort:string};
export const emptyFilters=():Filters=>({q:'',brand:[],category:[],cpu:[],generation:[],ram:[],storage:[],condition:[],stock:[],min:'',max:'',deals:false,sort:'featured'});
const groups=['brand','category','cpu','generation','ram','storage','condition','stock'] as const;
export function readFilters(search:string):Filters{const p=new URLSearchParams(search);const f=emptyFilters();for(const key of groups)f[key]=p.getAll(key).filter(Boolean);f.q=p.get('q')||'';f.min=p.get('min')||'';f.max=p.get('max')||'';f.deals=p.get('deals')==='true';f.sort=p.get('sort')||'featured';return f}
export function writeFilters(f:Filters):string{const p=new URLSearchParams();if(f.q.trim())p.set('q',f.q);for(const key of groups)f[key].forEach(v=>p.append(key,v));if(f.min)p.set('min',f.min);if(f.max)p.set('max',f.max);if(f.deals)p.set('deals','true');if(f.sort!=='featured')p.set('sort',f.sort);return p.toString()}
export const cpuFamily=(cpu:string)=>cpu.match(/\b(?:i[3579]|ryzen\s*[3579]|core\s+ultra\s*\d|m[1-9])\b/i)?.[0]?.replace(/\s+/g,' ').toLowerCase()||cpu.trim().toLowerCase();
export const generation=(cpu:string)=>cpu.match(/\b\d+(?:st|nd|rd|th)\s*gen\b/i)?.[0]?.toLowerCase()||'';
export function matchesFilters(p:Product,f:Filters){const effective=p.discount_price_pkr??p.price_pkr;const min=f.min===''?null:Number(f.min);const max=f.max===''?null:Number(f.max);return (!f.brand.length||f.brand.some(value=>normalizeBrand(value)===normalizeBrand(p.brand)))&&(!f.category.length||f.category.includes(p.category_id))&&(!f.cpu.length||f.cpu.includes(cpuFamily(p.cpu)))&&(!f.generation.length||f.generation.includes(generation(p.cpu)))&&(!f.ram.length||f.ram.includes(String(p.ram_gb)))&&(!f.storage.length||f.storage.includes(String(p.storage_gb)))&&(!f.condition.length||f.condition.includes((p.condition||'').trim()))&&(!f.stock.length||f.stock.includes(p.stock_status))&&(!f.deals||p.discount_price_pkr!==null)&&(!(min!==null&&Number.isFinite(min))||(effective!==null&&effective>=min))&&(!(max!==null&&Number.isFinite(max))||(effective!==null&&effective<=max))}

// Categories are admin-defined even when empty; other facets reflect published products.
export function filterOptions(products:Product[],categories:Category[]){
 const values=(fn:(p:Product)=>string)=>Array.from(new Set(products.map(fn).map(v=>v.trim()).filter(Boolean))).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
 return {category:categories.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(c=>c.id),brand:availableBrands(products),cpu:values(p=>cpuFamily(p.cpu)),generation:values(p=>generation(p.cpu)),ram:values(p=>p.ram_gb?.toString()||''),storage:values(p=>p.storage_gb?.toString()||''),condition:values(p=>p.condition||''),stock:values(p=>p.stock_status)};
}
