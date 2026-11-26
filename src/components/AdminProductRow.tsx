'use client';
import {useActionState,useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {setProductVisibility} from '@/app/admin/actions';
import type {AdminProduct} from '@/lib/admin-product-filters';
import {price} from '@/lib/formatters';

export default function AdminProductRow({product:p}:{product:AdminProduct}){
 const [state,action,pending]=useActionState(setProductVisibility,{message:'',ok:false});
 const router=useRouter();
 useEffect(()=>{if(state.ok)router.refresh()},[state,router]);
 return <div className="admin-product-row">
  <Link className="admin-product-edit" href={'/admin/products/'+p.id}>
   <div><strong>{p.title}</strong><small>{[p.cpu?.trim(),p.is_published?'Published':'Draft',p.is_featured?(p.is_published?'Featured selection':'Featured selection (draft)'):null,p.stock_status.replaceAll('_',' '),`${p.quantity} in inventory`].filter(Boolean).join(' · ')}</small></div>
   <span>{price(p.price_pkr)} &nbsp; →</span>
  </Link>
  <form action={action} className="admin-visibility-controls" aria-label={`Visibility for ${p.title}`}>
   <input type="hidden" name="id" value={p.id}/><input type="hidden" name="revision" value={p.revision||''}/>
   <button type="submit" name="change" value={p.is_featured?'featured_off':'featured_on'} aria-pressed={!!p.is_featured} aria-label={`Featured selection for ${p.title}: ${p.is_featured?'on':'off'}`} disabled={pending}>Featured: {p.is_featured?'On':'Off'}</button>
   <button type="submit" name="change" value={p.is_published?'shop_off':'shop_on'} aria-pressed={p.is_published} aria-label={`Shop visibility for ${p.title}: ${p.is_published?'on':'off'}`} disabled={pending}>Shop: {p.is_published?'On':'Off'}</button>
   <span role={state.message&&!state.ok?'alert':'status'} aria-live="polite">{pending?'Saving…':state.message}</span>
  </form>
 </div>;
}
