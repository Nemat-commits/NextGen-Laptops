'use server';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {supabase,configured} from '@/lib/supabase';
import {requireAdmin} from '@/lib/admin';
import {validateProduct,type ProductFormState} from '@/lib/product-validation';

export async function login(form:FormData){
 if(!configured())redirect('/admin/login?error=configuration');
 const db=await supabase();
 const {error}=await db.auth.signInWithPassword({email:String(form.get('email')||'').trim(),password:String(form.get('password')||'')});
 if(error)redirect(error.status===429?'/admin/login?error=rate-limit':'/admin/login?error=login');
 redirect('/admin');
}
export async function logout(){const db=await supabase();await db.auth.signOut();redirect('/admin/login')}
export async function createCategory(form:FormData){
 const db=await requireAdmin();const name=String(form.get('name')||'').trim();const slug=name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 if(!name||!slug||name.length>100)redirect('/admin/categories?error=invalid');
 const {error}=await db.from('categories').insert({name,slug});
 if(error)redirect(error.code==='23505'?'/admin/categories?error=duplicate':'/admin/categories?error=save');
 revalidatePath('/');revalidatePath('/shop');redirect('/admin/categories');
}
export async function deleteCategory(form:FormData){
 const db=await requireAdmin();const id=String(form.get('id')||'').trim();if(!id)redirect('/admin/categories?error=delete');
 const {data,error}=await db.from('categories').delete().eq('id',id).select('id');
 if(error)redirect(error.code==='23503'?'/admin/categories?error=in-use':'/admin/categories?error=delete');
 if(!data?.length)redirect('/admin/categories?error=missing');
 revalidatePath('/');revalidatePath('/shop');redirect('/admin/categories');
}
function failure(message:string,errors:ProductFormState['errors']={}):ProductFormState{return {message,errors}}
export async function saveProduct(_previous:ProductFormState,form:FormData):Promise<ProductFormState>{
 const db=await requireAdmin();const id=String(form.get('id')||'').trim();
 const {values:v,numbers:n,errors,file}=validateProduct(form);
 if(Object.keys(errors).length)return failure('Please correct the highlighted fields. If you selected a photo, select it again before saving.',errors);
 const fail=(message:string,fieldErrors:ProductFormState['errors']={})=>failure(message+(file?' Please select the photo again before saving.':''),fieldErrors);
 let oldSlug:string|undefined;
 if(id){
  const {data,error}=await db.from('products').select('id,slug').eq('id',id).maybeSingle();
  if(error)return fail('Could not load the product. Please try again.');
  if(!data)return fail('This product no longer exists. Return to Products and refresh the list.');
  oldSlug=data.slug;
 }
 let image=v.image_url||null,uploadedPath:string|undefined;
 if(file){
  const ext=file.type==='image/webp'?'webp':file.type==='image/png'?'png':'jpg';uploadedPath=`${crypto.randomUUID()}.${ext}`;
  const {error}=await db.storage.from('product-images').upload(uploadedPath,file,{contentType:file.type,upsert:false});
  if(error)return fail('The photo could not be uploaded. Check your connection and try again; select the photo again.',{image_file:'Photo upload failed.'});
  image=db.storage.from('product-images').getPublicUrl(uploadedPath).data.publicUrl;
 }
 const item={title:v.title,slug:v.slug,category_id:v.category_id,brand:v.brand,cpu:v.cpu,ram_gb:n.ram_gb,storage_gb:n.storage_gb,quantity:n.quantity??0,price_pkr:n.price_pkr,discount_price_pkr:n.discount_price_pkr,stock_status:v.stock_status,is_published:v.is_published,description:v.description,condition:v.condition||null,image_url:image,image_source:v.image_source||null};
 const query=id?db.from('products').update(item).eq('id',id):db.from('products').insert(item);
 const {data,error}=await query.select('id');
 if(error){
  // A database constraint error guarantees the write was rejected. Never remove
  // a file on an ambiguous network failure: the product might have been saved.
  if(uploadedPath&&error.code?.startsWith('23')){const cleanup=await db.storage.from('product-images').remove([uploadedPath]);if(cleanup.error)console.error('Could not clean up rejected upload');}
  const detail=`${error.message||''} ${error.details||''}`;
  if(error.code==='23505'&&/products_unique_configuration/i.test(detail))return fail('This product configuration already exists. Edit the existing listing and update its quantity instead.',{title:'This name, processor, RAM and storage combination is already listed.'});
  if(error.code==='23505'&&/slug/i.test(detail))return fail('This URL slug is already used by another product. Choose a different slug.',{slug:'This URL slug is already in use.'});
  if(error.code==='23505')return fail('A product with the same URL or configuration already exists. Check the existing listings before trying again.');
  if(error.code==='23503')return fail('The selected category is no longer available. Refresh this page and choose another category.',{category_id:'This category no longer exists.'});
  if(error.code==='23514'||error.code==='22003'||error.code==='22P02')return fail('Some values could not be saved. Check the price, quantity and specifications and try again.');
  return fail('The product could not be confirmed as saved. Check the product list before retrying; if you selected a photo, select it again.');
 }
 if(!data?.length){if(uploadedPath){const cleanup=await db.storage.from('product-images').remove([uploadedPath]);if(cleanup.error)console.error('Could not clean up unused upload')}return fail('This product could not be found or updated. Refresh the product list before retrying.')}
 revalidatePath('/');revalidatePath('/shop');revalidatePath('/laptops/'+v.slug);if(oldSlug&&oldSlug!==v.slug)revalidatePath('/laptops/'+oldSlug);redirect('/admin/products');
}
export async function deleteProduct(form:FormData){
 const db=await requireAdmin();const id=String(form.get('id')||'').trim();if(!id)redirect('/admin/products?error=delete');
 const {data,error}=await db.from('products').delete().eq('id',id).select('id,slug');
 if(error)redirect('/admin/products?error=delete');if(!data?.length)redirect('/admin/products?error=missing');
 revalidatePath('/');revalidatePath('/shop');if(data[0].slug)revalidatePath('/laptops/'+data[0].slug);redirect('/admin/products');
}
