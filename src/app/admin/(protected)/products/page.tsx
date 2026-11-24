import Link from 'next/link';
import {requireAdmin} from '@/lib/admin';
import AdminProductList from '@/components/AdminProductList';
import type {AdminProduct} from '@/lib/admin-product-filters';
import type {Category} from '@/lib/inventory';

export default async function Products({searchParams}:{searchParams:Promise<{error?:string}>}){
 const db=await requireAdmin();
 // Supabase limits each response; fetch every page so search includes all inventory.
 // Categories are independent and can load while the product pages are fetched.
 const loadProducts=async()=>{
  const products:AdminProduct[]=[];const pageSize=1000;let loadError=false;
  for(let offset=0;;offset+=pageSize){
   const {data,error}=await db.from('products').select('id,slug,title,brand,category_id,cpu,ram_gb,storage_gb,quantity,price_pkr,stock_status,is_published,is_featured').order('title').order('id').range(offset,offset+pageSize-1);
   if(error){loadError=true;break}products.push(...(data as AdminProduct[]));if(data.length<pageSize)break;
  }
  return {products,loadError};
 };
 const [{products,loadError},{data:categories,error:categoryError}]=await Promise.all([
  loadProducts(),db.from('categories').select('id,name,slug').order('name')
 ]);
 const params=await searchParams;
 return <main className="wrap admin"><div className="admin-heading"><div><div className="eyebrow">MANAGE THE COLLECTION</div><h2>Products</h2></div><Link className="primary-button" href="/admin/products/new">Add product →</Link></div>{(loadError||categoryError||params.error)&&<p className="form-error" role="alert">{loadError||categoryError?'Could not load products or categories. Please refresh the page and try again.':params.error==='stale'?'The product changed or was removed. Refresh the list and review it before deleting.':params.error==='missing'?'This product no longer exists. The list has been refreshed.':params.error==='delete'?'Could not delete the product. Please try again.':'Could not load products. Please refresh the page and try again.'}</p>}{!loadError&&!categoryError&&<AdminProductList products={products} categories={categories as Category[]}/>}</main>;
}
