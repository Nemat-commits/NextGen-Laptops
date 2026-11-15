import {notFound} from 'next/navigation';
import ProductForm from '@/components/ProductForm';
import {requireAdmin} from '@/lib/admin';
export default async function EditProduct({params}:{params:Promise<{id:string}>}){
 const db=await requireAdmin();const {id}=await params;
 const [product,categories]=await Promise.all([db.from('products').select('*').eq('id',id).maybeSingle(),db.from('categories').select('*').order('name')]);
 if(product.error||categories.error)return <main className="wrap admin"><div className="admin-heading"><h2>Edit product</h2></div><p className="form-error" role="alert">The product or its categories could not be loaded. Please refresh this page and try again.</p></main>;
 if(!product.data)notFound();
 return <main className="wrap admin"><div className="admin-heading"><h2>Edit product</h2></div><ProductForm product={product.data} categories={categories.data||[]}/></main>;
}
