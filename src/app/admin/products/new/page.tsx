import AdminNav from '@/components/AdminNav';
import ProductForm from '@/components/ProductForm';
import {requireAdmin} from '@/lib/admin';
export default async function NewProduct(){const db=await requireAdmin();const {data}=await db.from('categories').select('*').order('name');return <main className="wrap admin"><AdminNav/><div className="admin-heading"><h2>Add product</h2></div><ProductForm categories={data||[]}/></main>}
