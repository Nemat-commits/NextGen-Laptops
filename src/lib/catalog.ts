import {defaultCategories, inventory, type Category, type Product} from './inventory';
import {configured,supabase} from './supabase';
export async function catalog():Promise<{products:Product[],categories:Category[],demo:boolean,error:boolean}> {if(!configured()) return {products:inventory,categories:defaultCategories,demo:true,error:false}; const db=await supabase(); const [p,c]=await Promise.all([db.from('products').select('*').eq('is_published',true).order('title'),db.from('categories').select('*').order('name')]); if(p.error||c.error)return {products:[],categories:[],demo:false,error:true}; return {products:p.data as Product[],categories:c.data as Category[],demo:false,error:false};}
export const price=(n:number|null)=>n==null?'Price on request':`Rs. ${n.toLocaleString('en-PK')}`;
