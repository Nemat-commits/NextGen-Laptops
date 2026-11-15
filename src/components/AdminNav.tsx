'use client';
import Link from 'next/link';
import Image from 'next/image';
import {usePathname} from 'next/navigation';
import {logout} from '@/app/admin/actions';

const items=[{href:'/admin',label:'Overview'},{href:'/admin/products',label:'Products'},{href:'/admin/categories',label:'Categories'}];
export default function AdminNav(){
 const pathname=usePathname();
 return <header className="admin-bar">
  <div className="admin-bar-inner wrap">
   <Link href="/admin" className="admin-brand" aria-label="NextGen back office overview"><Image src="/brand/nextgen-logo.webp" width={148} height={51} alt="NextGen Laptops" priority/><span>BACK OFFICE</span></Link>
   <nav className="admin-bar-links" aria-label="Admin navigation">
    {items.map(item=>{const active=item.href==='/admin'?pathname===item.href:pathname===item.href||pathname.startsWith(item.href+'/');return <Link key={item.href} href={item.href} aria-current={active?'page':undefined}>{item.label}</Link>})}
   </nav>
   <div className="admin-bar-actions"><Link href="/" className="admin-view-store">View store</Link><form action={logout}><button type="submit">Sign out</button></form></div>
  </div>
 </header>;
}
