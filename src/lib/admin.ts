import {redirect} from 'next/navigation';
import {configured,supabase} from './supabase';
export async function requireAdmin(){if(!configured())redirect('/admin/login?error=configuration');const db=await supabase();const {data:{user}}=await db.auth.getUser();if(!user)redirect('/admin/login');const {data,error}=await db.from('admin_users').select('user_id').eq('user_id',user.id).maybeSingle();if(error||!data)redirect('/admin/login?error=permission');return db}
