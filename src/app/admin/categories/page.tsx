import AdminNav from '@/components/AdminNav';
import DeleteCategory from '@/components/DeleteCategory';
import {requireAdmin} from '@/lib/admin';
import {createCategory} from '../actions';

export default async function Categories({searchParams}:{searchParams:Promise<{error?:string}>}) {
 const db=await requireAdmin();
 const {data,error}=await db.from('categories').select('*').order('name');
 const params=await searchParams;
 const message=params.error==='in-use'?'This category still contains products, including drafts. Move or delete those products before removing it.':params.error==='delete'?'Could not remove the category. Please try again.':'Could not save or load categories. Check the name and try again.';
 return <main className="wrap admin"><AdminNav/><div className="admin-heading"><div><div className="eyebrow">ORGANISE YOUR STORE</div><h2>Categories</h2><p>Add categories and assign products to them. Empty categories can be removed.</p></div></div>
 {(error||params.error)&&<p className="form-error" role="alert">{message}</p>}
 <form action={createCategory} className="inline-form"><label>New category name<input name="name" required maxLength={100} placeholder="e.g. Accessories"/></label><button className="primary-button">Create category →</button></form>
 <div className="admin-list">{data?.map(c=><div key={c.id} className="category-row"><div><strong>{c.name}</strong><small>{c.slug}</small></div><DeleteCategory id={c.id} name={c.name}/></div>)}{!data?.length&&!error&&<p>No categories yet.</p>}</div></main>;
}
