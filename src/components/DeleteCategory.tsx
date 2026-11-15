'use client';
import {deleteCategory} from '@/app/admin/actions';

export default function DeleteCategory({id,name}:{id:string;name:string}) {
 return <form action={deleteCategory} className="category-delete" onSubmit={event=>{
  if(!window.confirm(`Remove “${name}”? Categories containing products cannot be removed.`)) event.preventDefault();
 }}><input type="hidden" name="id" value={id}/><button type="submit" aria-label={`Remove category ${name}`}>Remove</button></form>;
}
