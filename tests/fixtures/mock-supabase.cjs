const http=require('node:http');
const user={id:'57e001ae-4750-4af5-97cb-a2ec6517abe7',email:'admin@example.test',role:'authenticated',aud:'authenticated',app_metadata:{},user_metadata:{},created_at:new Date().toISOString()};
const b=x=>Buffer.from(JSON.stringify(x)).toString('base64url'); const jwt=`${b({alg:'none',typ:'JWT'})}.${b({sub:user.id,role:'authenticated',exp:Math.floor(Date.now()/1000)+3600})}.mock`;
let categories=[{id:'laptops',name:'Laptops',slug:'laptops'}],products=[];const objects=new Set();
http.createServer(async(req,res)=>{const url=new URL(req.url,'http://localhost');let data='';for await(const chunk of req)data+=chunk;let body;try{body=JSON.parse(data||'{}')}catch{body={}};const send=(code,obj,extra={})=>{res.writeHead(code,{'Content-Type':'application/json',...extra});res.end(req.method==='HEAD'?'':JSON.stringify(obj))};
if(url.pathname==='/auth/v1/token'&&req.method==='POST'){if(body.email!==user.email||body.password!=='local-test-password')return send(400,{error:'invalid_grant',error_description:'Invalid login'});return send(200,{access_token:jwt,token_type:'bearer',expires_in:3600,expires_at:Math.floor(Date.now()/1000)+3600,refresh_token:'mock-refresh',user})}
if(url.pathname==='/auth/v1/user')return req.headers.authorization===`Bearer ${jwt}`?send(200,user):send(401,{message:'invalid session'});
if(url.pathname==='/auth/v1/logout')return send(204,{});
if(url.pathname==='/rest/v1/admin_users')return send(200,req.headers.authorization===`Bearer ${jwt}`?[{user_id:user.id}]:[]);
if(url.pathname==='/_qa/storage-count')return send(200,{count:objects.size});
if(url.pathname.startsWith('/storage/v1/object/product-images/')&&req.method==='POST'){const path=url.pathname.split('/').pop();objects.add(path);return send(200,{Key:'product-images/'+path})}
if(url.pathname==='/storage/v1/object/product-images'&&req.method==='DELETE'){for(const path of body.prefixes||[])objects.delete(path);return send(200,[]);}
const name=url.pathname.split('/').pop();if(!['categories','products'].includes(name))return send(404,{message:'missing mock route '+url.pathname});
let arr=name==='categories'?categories:products; const id=url.searchParams.get('id')?.replace(/^eq\./,'');let found=id?arr.filter(x=>x.id===id):arr;
if(url.searchParams.get('is_published')==='eq.true')found=found.filter(x=>x.is_published);
if(req.method==='GET'||req.method==='HEAD')return send(200,found,{'content-range':`0-${Math.max(0,found.length-1)}/${found.length}`});
if(req.headers.authorization!==`Bearer ${jwt}`)return send(403,{message:'not authenticated'});
const norm=x=>String(x??'').trim().replace(/\s+/g,' ').toLowerCase();
function duplicate(value,exclude){
 const others=arr.filter(x=>x.id!==exclude);
 if(name==='categories'&&others.some(x=>x.name===value.name||x.slug===value.slug))return 'categories_slug_key';
 if(name==='products'){
  if(others.some(x=>norm(x.slug)===norm(value.slug)))return 'products_slug_normalized_key';
  if(others.some(x=>norm(x.title)===norm(value.title)&&norm(x.cpu)===norm(value.cpu)&&(x.ram_gb??null)===(value.ram_gb??null)&&(x.storage_gb??null)===(value.storage_gb??null)))return 'products_unique_configuration';
 }
 return null;
}
if(req.method==='POST'){const value={...body,id:body.id||'mock-'+Date.now(),extra_specs:{}};const constraint=duplicate(value);if(constraint)return send(409,{code:'23505',message:`duplicate key value violates unique constraint "${constraint}"`});if(name==='products'&&!categories.some(c=>c.id===value.category_id))return send(409,{code:'23503',message:'category missing'});arr.push(value);return send(201,[value]);}
if(req.method==='PATCH'){if(found.length){const value={...found[0],...body};const constraint=duplicate(value,id);if(constraint)return send(409,{code:'23505',message:`duplicate key value violates unique constraint "${constraint}"`});if(name==='products'&&!categories.some(c=>c.id===value.category_id))return send(409,{code:'23503',message:'category missing'});}found.forEach(x=>Object.assign(x,body));return send(200,found);}
if(req.method==='DELETE'){if(name==='categories'&&products.some(p=>p.category_id===id))return send(409,{code:'23503',message:'category still in use'});if(name==='products')products=products.filter(x=>x.id!==id);else categories=categories.filter(x=>x.id!==id);return send(200,found);}
return send(405,{});
}).listen(4001,'127.0.0.1',()=>console.log('Mock Supabase ready'));
