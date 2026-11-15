import {writeFileSync} from 'node:fs';
import {inventory} from '../src/lib/inventory';
const quote=(v:unknown):string=>v===null?'NULL':typeof v==='number'?String(v):typeof v==='boolean'?(v?'true':'false'):Array.isArray(v)?`ARRAY[${v.join(',')}]`:"'"+String(v).replaceAll("'","''")+"'";
const fields=['id','slug','title','brand','category_id','cpu','ram_gb','storage_gb','quantity','source_rows','price_pkr','discount_price_pkr','stock_status','is_published','description','image_url','image_source','condition'] as const;
const values=inventory.map(p=>'('+fields.map(k=>quote(p[k])).join(', ')+')').join(',\n');
writeFileSync('supabase/seed.sql',`-- Imported from the 95 numbered source rows. Reruns do not overwrite admin edits.\ninsert into public.products (${fields.join(', ')}) values\n${values}\non conflict (id) do nothing;\n`);
console.log(`${inventory.length} configurations; ${inventory.reduce((n,p)=>n+p.quantity,0)} source rows`);
