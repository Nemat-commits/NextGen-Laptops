import {createClient} from '@supabase/supabase-js';
import {unstable_cache} from 'next/cache';
import {defaultCategories, inventory, type Category, type Product} from './inventory';
import {PUBLIC_CATALOG_TAG} from './cache-tags';

/**
 * Public, anonymous data only. Never pass a user session or admin client here.
 * Cache successful results; an error is thrown before it can be cached.
 * Include the URL/key in the cache key so separate projects cannot share data.
 */
const readPublicCatalog=unstable_cache(async (url:string,anonKey:string)=>{
 const db=createClient(url,anonKey,{
  auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},
  // Only the outer catalogue cache should store results; avoid a second fetch cache.
  global:{fetch:(input,init)=>fetch(input,{...init,cache:'no-store'})},
 });
 const [products,categories]=await Promise.all([
  db.from('products').select('*').eq('is_published',true).order('title'),
  db.from('categories').select('*').order('name'),
 ]);
 if(products.error||categories.error)throw new Error('Public catalogue query failed');
 return {products:products.data as Product[],categories:categories.data as Category[]};
},['public-catalog-v1'],{tags:[PUBLIC_CATALOG_TAG],revalidate:300});

export async function catalog():Promise<{products:Product[],categories:Category[],demo:boolean,error:boolean}>{
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return {products:inventory,categories:defaultCategories,demo:true,error:false};
 try{return {...await readPublicCatalog(url,key),demo:false,error:false}}
 catch{console.error('Public catalogue could not be loaded');return {products:[],categories:[],demo:false,error:true}}
}
export const price=(n:number|null)=>n==null?'Price on request':`Rs. ${n.toLocaleString('en-PK')}`;
