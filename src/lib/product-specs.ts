import type {Product} from './inventory';

// Only show details actually supplied for this product; empty fields can be
// irrelevant (for example, processor and RAM on a mouse or charger).
export function productSpecs(p:Product):[string,string][] {
 const specs:[string,string][]=[];
 const add=(label:string,value:string|null|undefined)=>{if(value?.trim())specs.push([label,value.trim()])};
 add('Brand',p.brand);
 add('Processor',p.cpu);
 if(p.ram_gb!=null)add('Memory',`${p.ram_gb} GB`);
 if(p.storage_gb!=null)add('Storage capacity',`${p.storage_gb} GB`);
 add('Condition',p.condition);
 for(const [label,value] of Object.entries(p.extra_specs||{}))if(label.trim()&&typeof value==='string')add(label.trim(),value);
 return specs;
}
