import {notFound} from 'next/navigation';
import AdminNav from '@/components/AdminNav';
import ProductForm from '@/components/ProductForm';
import {requireAdmin} from '@/lib/admin';
export default async function EditProduct({params}:{params:Promise<{id:string}>}){const db=await requireAdmin();const {id}=await params;const [{data:p},{data:c}]=await Promise.all([db.from('products').select('*').eq('id',id).maybeSingle(),db.from('categories').select('*').order('name')]);if(!p)notFound();return <main className="wrap admin"><AdminNav/><div className="admin-heading"><h2>Edit product</h2></div><ProductForm product={p} categories={c||[]}/></main>}
