const http=require('node:http');
const {randomUUID}=require('node:crypto');
const user={id:'57e001ae-4750-4af5-97cb-a2ec6517abe7',email:'admin@example.test',role:'authenticated',aud:'authenticated',app_metadata:{},user_metadata:{},created_at:new Date().toISOString()};
const b=x=>Buffer.from(JSON.stringify(x)).toString('base64url'); const jwt=`${b({alg:'none',typ:'JWT'})}.${b({sub:user.id,role:'authenticated',exp:Math.floor(Date.now()/1000)+3600})}.mock`;
let publicCounts={products:0,categories:0};let lastPublicAuth=null,catalogDelayMs=0;
let adminCounts={auth:0,permission:0,products:0,categories:0},adminDelayMs=0,adminAllowed=true,adminReads=[],adminFailure='';
let categories=[{id:'laptops',name:'Laptops',slug:'laptops'}],products=[];const objects=new Set();let catalogFailure=false,slugCollisionOnce=false;
http.createServer(async(req,res)=>{const url=new URL(req.url,'http://localhost');let data='';for await(const chunk of req)data+=chunk;let body;try{body=JSON.parse(data||'{}')}catch{body={}};const send=(code,obj,extra={})=>{res.writeHead(code,{'Content-Type':'application/json',...extra});res.end(req.method==='HEAD'?'':JSON.stringify(obj))};
if(url.pathname==='/auth/v1/token'&&req.method==='POST'){if(body.email!==user.email||body.password!=='local-test-password')return send(400,{error:'invalid_grant',error_description:'Invalid login'});return send(200,{access_token:jwt,token_type:'bearer',expires_in:3600,expires_at:Math.floor(Date.now()/1000)+3600,refresh_token:'mock-refresh',user})}
if(url.pathname==='/auth/v1/user'){adminCounts.auth++;return req.headers.authorization===`Bearer ${jwt}`?send(200,user):send(401,{message:'invalid session'})}
if(url.pathname==='/auth/v1/logout')return send(204,{});
if(url.pathname==='/rest/v1/admin_users'){adminCounts.permission++;return send(200,adminAllowed&&req.headers.authorization===`Bearer ${jwt}`?[{user_id:user.id}]:[])}
if(url.pathname==='/_qa/admin-config'&&req.method==='POST'){adminDelayMs=Math.max(0,Math.min(2000,Number(body.delayMs)||0));if(typeof body.allowed==='boolean')adminAllowed=body.allowed;if(typeof body.failure==='string')adminFailure=body.failure;return send(200,{ok:true})}
if(url.pathname==='/_qa/admin-reset'&&req.method==='POST'){adminCounts={auth:0,permission:0,products:0,categories:0};adminReads=[];return send(200,{ok:true})}
if(url.pathname==='/_qa/admin-stats'&&req.method==='GET')return send(200,{...adminCounts,reads:adminReads});
if(url.pathname==='/_qa/catalog-delay'&&req.method==='POST'){catalogDelayMs=Math.max(0,Math.min(2000,Number(body.ms)||0));return send(200,{ok:true})}
if(url.pathname==='/_qa/catalog-counts'&&req.method==='GET')return send(200,{...publicCounts,lastPublicAuth});
if(url.pathname==='/_qa/reset-catalog-counts'&&req.method==='POST'){publicCounts={products:0,categories:0};lastPublicAuth=null;return send(200,{ok:true})}
if(url.pathname==='/_qa/slug-collision'&&req.method==='POST'){slugCollisionOnce=true;return send(200,{ok:true})}
if(url.pathname==='/_qa/catalog-failure'&&req.method==='POST'){catalogFailure=body.enabled;return send(200,{ok:true})}
if(url.pathname==='/_qa/storage-count')return send(200,{count:objects.size});
if(url.pathname.startsWith('/storage/v1/object/product-images/')&&req.method==='POST'){const path=url.pathname.split('/').pop();objects.add(path);return send(200,{Key:'product-images/'+path})}
if(url.pathname==='/storage/v1/object/product-images'&&req.method==='DELETE'){for(const path of body.prefixes||[])objects.delete(path);return send(200,[]);}
const name=url.pathname.split('/').pop();if(!['categories','products'].includes(name))return send(404,{message:'missing mock route '+url.pathname});
if(req.method==='GET'&&req.headers.authorization===`Bearer ${jwt}`){adminCounts[name]++;const read={name,start:Date.now()};adminReads.push(read);if(adminDelayMs)await new Promise(resolve=>setTimeout(resolve,adminDelayMs));read.end=Date.now();if(adminFailure===name)return send(503,{message:'simulated admin database failure'})}
if(req.method==='GET'&&req.headers.authorization!==`Bearer ${jwt}`){let publicRead=false;if(name==='products'&&url.searchParams.get('is_published')==='eq.true'){publicCounts.products++;lastPublicAuth=req.headers.authorization||null;publicRead=true}if(name==='categories'){publicCounts.categories++;lastPublicAuth=req.headers.authorization||null;publicRead=true}if(publicRead&&catalogDelayMs)await new Promise(resolve=>setTimeout(resolve,catalogDelayMs))}
if(catalogFailure && name==='products' && req.method==='GET' && url.searchParams.get('is_published')==='eq.true')return send(503,{message:'simulated database failure'});
let arr=name==='categories'?categories:products; const id=url.searchParams.get('id')?.replace(/^eq\./,'');let found=id?arr.filter(x=>x.id===id):arr;
const revision=url.searchParams.get('revision')?.replace(/^eq\./,'');if(revision)found=found.filter(x=>x.revision===revision);
if(url.searchParams.get('is_published')==='eq.true')found=found.filter(x=>x.is_published);
if(req.method==='GET'||req.method==='HEAD'){const count=found.length,offset=Number(url.searchParams.get('offset')||0),limit=Number(url.searchParams.get('limit')||count);found=found.slice(offset,offset+limit);return send(200,found,{'content-range':`${offset}-${Math.max(offset,offset+found.length-1)}/${count}`});}
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
if(req.method==='POST'){if(name==='products'&&slugCollisionOnce){slugCollisionOnce=false;return send(409,{code:'23505',message:'duplicate key value violates unique constraint products_slug_normalized_key'})}const value={...body,id:body.id||'mock-'+randomUUID(),revision:randomUUID(),extra_specs:{}};if(name==='products'&&value.stock_status!=='unconfirmed')value.stock_status=value.quantity===0?'out_of_stock':'in_stock';const constraint=duplicate(value);if(constraint)return send(409,{code:'23505',message:`duplicate key value violates unique constraint "${constraint}"`});if(name==='products'&&!categories.some(c=>c.id===value.category_id))return send(409,{code:'23503',message:'category missing'});arr.push(value);return send(201,[value]);}
if(req.method==='PATCH'){if(found.length){const value={...found[0],...body};const constraint=duplicate(value,id);if(constraint)return send(409,{code:'23505',message:`duplicate key value violates unique constraint "${constraint}"`});if(name==='products'&&!categories.some(c=>c.id===value.category_id))return send(409,{code:'23503',message:'category missing'});}found.forEach(x=>{Object.assign(x,body);if(name==='products'){x.revision=randomUUID();if(x.stock_status!=='unconfirmed')x.stock_status=x.quantity===0?'out_of_stock':'in_stock'}});return send(200,found);}
if(req.method==='DELETE'){if(name==='categories'&&products.some(p=>p.category_id===id))return send(409,{code:'23503',message:'category still in use'});if(name==='products')products=products.filter(x=>!found.includes(x));else categories=categories.filter(x=>!found.includes(x));return send(200,found);}
return send(405,{});
}).listen(4001,'127.0.0.1',()=>console.log('Mock Supabase ready'));
