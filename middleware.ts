import {createServerClient, type CookieOptions} from '@supabase/ssr';
import {NextResponse, type NextRequest} from 'next/server';
export async function middleware(request:NextRequest){let response=NextResponse.next({request});const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;if(!url||!key)return response;const client=createServerClient(url,key,{cookies:{getAll(){return request.cookies.getAll()},setAll(cookies:{name:string;value:string;options:CookieOptions}[]){cookies.forEach(({name,value})=>request.cookies.set(name,value));response=NextResponse.next({request});cookies.forEach(({name,value,options})=>response.cookies.set(name,value,options))}}});await client.auth.getUser();return response}
export const config={matcher:['/admin/:path*']};
