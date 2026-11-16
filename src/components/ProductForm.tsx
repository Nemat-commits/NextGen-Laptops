'use client';
import {useActionState,useEffect,useState} from 'react';
import PhotoInputs from './PhotoInputs';
import type {Category,Product} from '@/lib/inventory';
import {initialProductFormState,type ProductValues,type ProductField} from '@/lib/product-validation';
import {saveProduct} from '@/app/admin/actions';
import DeleteProduct from './DeleteProduct';

function initialValues(p?:Product):ProductValues{return {
 title:p?.title??'',slug:p?.slug??'',category_id:p?.category_id??'',brand:p?.brand??'',cpu:p?.cpu??'',ram_gb:p?.ram_gb?.toString()??'',storage_gb:p?.storage_gb?.toString()??'',price_pkr:p?.price_pkr?.toString()??'',discount_price_pkr:p?.discount_price_pkr?.toString()??'',quantity:p?.quantity?.toString()??'0',stock_status:p?.stock_status==='unconfirmed'?'unconfirmed':'automatic',condition:p?.condition??'',description:p?.description??'',image_url:p?.image_url??'',image_source:p?.image_source??'',is_published:p?.is_published??false,is_featured:p?.is_featured??false
}}
export default function ProductForm({product:p,categories}:{product?:Product,categories:Category[]}){
 const [values,setValues]=useState(()=>({...initialValues(p),category_id:p?.category_id??categories[0]?.id??''}));
 const [photoBusy,setPhotoBusy]=useState(false),[photoProblem,setPhotoProblem]=useState(false),[photoKey,setPhotoKey]=useState(0);
 const [state,action,pending]=useActionState(saveProduct,initialProductFormState);
 useEffect(()=>{if(state.message){setPhotoKey(n=>n+1);setPhotoBusy(false);setPhotoProblem(false)}},[state]);
 const set=(key:Exclude<keyof ProductValues,'is_published'|'is_featured'>,value:string)=>setValues(current=>({...current,[key]:key==='slug'?value.toLowerCase():value}));
 const error=(key:ProductField)=>state.errors[key];
 const attrs=(key:ProductField)=>({'aria-invalid':Boolean(error(key)),...(error(key)?{'aria-describedby':`${key}-error`}:{})});
 const fieldError=(key:ProductField)=>error(key)?<small id={`${key}-error`} className="field-error">{error(key)}</small>:null;
 const input=(key:Exclude<keyof ProductValues,'is_published'|'is_featured'>,label:string,type='text',wide=false)=>
  <label className={wide?'wide':undefined}>{label}<input name={key} type={type} value={values[key]} onChange={event=>set(key,event.target.value)} {...attrs(key)} {...(type==='number'?{min:0,step:1}: {})}/>{fieldError(key)}</label>;
 return <><form action={action} className="form product-form" noValidate onSubmit={event=>{if(photoBusy||photoProblem||pending)event.preventDefault()}}>
  <input type="hidden" name="id" value={p?.id||''}/>{p&&<input type="hidden" name="revision" value={p.revision||''}/>}
  {state.message&&<div className="form-error wide" role="alert">{state.message}</div>}
  {input('title','Product title')}
  <label>URL slug <small>{p?'Existing URL; changing it can break old links.':'Optional: leave blank to create a unique URL automatically.'}</small><input name="slug" value={values.slug} onChange={event=>set('slug',event.target.value)} {...attrs('slug')}/>{fieldError('slug')}</label>
  <label>Category<select name="category_id" value={values.category_id} onChange={event=>set('category_id',event.target.value)} {...attrs('category_id')}><option value="">Select a category</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>{fieldError('category_id')}{!categories.length&&<small>Create a category before adding a product.</small>}</label>
  {input('brand','Brand')}{input('cpu','Processor')}{input('ram_gb','RAM (GB)','number')}{input('storage_gb','Storage (GB)','number')}{input('price_pkr','Price (PKR)','number')}{input('discount_price_pkr','Discount price (PKR)','number')}{input('quantity','Quantity','number')}
  <label>Availability<select name="stock_status" value={values.stock_status} onChange={event=>set('stock_status',event.target.value)} {...attrs('stock_status')}><option value="automatic">Automatic from quantity</option><option value="unconfirmed">Unconfirmed</option></select><small>{values.stock_status==='unconfirmed'?'Availability will remain unconfirmed.':Number(values.quantity)>0?'In stock (quantity above zero).':'Out of stock (quantity is zero).'}</small>{fieldError('stock_status')}</label>
  {input('condition','Condition')}
  <label className="wide">Description<textarea name="description" rows={5} value={values.description} onChange={event=>set('description',event.target.value)} {...attrs('description')}/>{fieldError('description')}</label>
  {input('image_url','Image URL (HTTPS or an existing /products/ asset)','text',true)}
  {input('image_source','Manufacturer image source URL (HTTPS)','url',true)}
  <PhotoInputs key={photoKey} onBusyChange={setPhotoBusy} onErrorChange={setPhotoProblem}/>{error('image_file')&&<div className="wide field-error" role="alert">{error('image_file')}</div>}
  <label className="check wide"><input type="checkbox" name="is_featured" checked={values.is_featured} onChange={event=>setValues(current=>({...current,is_featured:event.target.checked}))}/> Feature on homepage (visible once published)</label>
  <label className="check wide"><input type="checkbox" name="is_published" checked={values.is_published} onChange={event=>setValues(current=>({...current,is_published:event.target.checked}))}/> Published in storefront</label>
  <div className="wide"><button className="primary-button" disabled={photoBusy||photoProblem||pending}>{photoBusy?'Preparing photo…':pending?'Saving…':'Save product →'}</button></div>
 </form>{p&&<DeleteProduct id={p.id} revision={p.revision||''}/>}</>;
}
