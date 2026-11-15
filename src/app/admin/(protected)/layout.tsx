import AdminNav from '@/components/AdminNav';
import {requireAdmin} from '@/lib/admin';

export default async function AdminLayout({children}:{children:React.ReactNode}) {
 await requireAdmin();
 return <><AdminNav/>{children}</>;
}
