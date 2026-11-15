'use client';
import {deleteProduct} from '@/app/admin/actions';
export default function DeleteProduct({id,revision}:{id:string;revision:string}){return <form action={deleteProduct} className="delete-form" onSubmit={e=>{if(!window.confirm('Permanently delete this product? This cannot be undone.'))e.preventDefault()}}><input type="hidden" name="id" value={id}/><input type="hidden" name="revision" value={revision}/><button>Delete this product</button></form>}
