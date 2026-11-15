import Link from 'next/link';
import {logout} from '@/app/admin/actions';
export default function AdminNav(){return <div className="admin-nav"><div><span className="eyebrow">STORE MANAGEMENT</span><h1>Back office<span className="accent">.</span></h1></div><nav><Link href="/admin">Overview</Link><Link href="/admin/products">Products</Link><Link href="/admin/categories">Categories</Link><form action={logout}><button>Sign out</button></form></nav></div>}
