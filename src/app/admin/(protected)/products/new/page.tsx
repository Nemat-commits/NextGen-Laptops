import Link from 'next/link';
import ProductForm from '@/components/ProductForm';
import {requireAdmin} from '@/lib/admin';
export default async function NewProduct(){
 const db=await requireAdmin();const {data,error}=await db.from('categories').select('*').order('name');
 return <main className="wrap admin"><div className="admin-heading"><h2>Add product</h2></div>{error?<p className="form-error" role="alert">Categories could not be loaded. Please refresh this page before adding a product.</p>:!data?.length?<p className="form-error">Create a <Link href="/admin/categories">category</Link> before adding a product.</p>:<ProductForm categories={data}/>}</main>;
}
