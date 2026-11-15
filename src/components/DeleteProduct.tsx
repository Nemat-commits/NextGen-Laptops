'use client';
import {deleteProduct} from '@/app/admin/actions';
export default function DeleteProduct({id}:{id:string}){return <form action={deleteProduct} className="delete-form" onSubmit={e=>{if(!window.confirm('Permanently delete this product? This cannot be undone.'))e.preventDefault()}}><input type="hidden" name="id" value={id}/><button>Delete this product</button></form>}
