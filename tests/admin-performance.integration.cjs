// Production-mode admin performance and authorization checks against the isolated mock only.
const assert=require('node:assert/strict');
const base='http://127.0.0.1:3002',mock='http://127.0.0.1:4001';let cookies='';
async function request(path,opts={}){const response=await fetch(base+path,{...opts,redirect:'manual',headers:{...(cookies?{cookie:cookies}:{}),...(opts.method==='POST'?{origin:base}:{}),...opts.headers}});const sets=response.headers.getSetCookie();if(sets.length)cookies=sets.map(x=>x.split(';')[0]).join('; ');return response}
async function page(path){const r=await request(path);return {r,html:await r.text()}}
function action(html,contains){const form=[...html.matchAll(/<form\b[^>]*>[\s\S]*?<\/form>/g)].map(m=>m[0]).find(x=>x.includes(contains));assert.ok(form,`form containing ${contains}`);const fields=[...form.matchAll(/<input\b[^>]*name="(\$ACTION[^"]+)"[^>]*>/g)].map(m=>[m[1],(m[0].match(/value="([^"]*)"/)?.[1]||'').replaceAll('&quot;','"').replaceAll('&amp;','&').replaceAll('&#x27;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>')]);assert.ok(fields.length);return fields}
async function post(path,fields,values){const body=new FormData();for(const [k,v] of fields)body.set(k,v);for(const [k,v] of Object.entries(values))body.set(k,v);return request(path,{method:'POST',body})}
async function api(path,body){const r=await fetch(mock+path,body===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});assert.ok(r.ok);return r.json()}
(async()=>{
 const login=await page('/admin/login');const loginResponse=await post('/admin/login',action(login.html,'name="email"'),{email:'admin@example.test',password:'local-test-password'});assert.equal(loginResponse.status,303);
 const form=await page('/admin/products/new'),save=action(form.html,'name="title"');const product={title:'Private Performance Draft',slug:'private-performance-draft',category_id:'laptops',brand:'Test',cpu:'Test CPU',ram_gb:'8',storage_gb:'256',quantity:'1',price_pkr:'12000',stock_status:'in_stock'};
 assert.equal((await post('/admin/products/new',save,product)).status,303);
 await api('/_qa/admin-config',{delayMs:250,allowed:true});await api('/_qa/admin-reset',{});
 const start=performance.now();const list=await page('/admin/products');const duration=Math.round(performance.now()-start);const stats=await api('/_qa/admin-stats');
 assert.equal(list.r.status,200);assert.match(list.html,/Private Performance Draft/);assert.equal(stats.products,1);assert.equal(stats.categories,1);
 const prod=stats.reads.find(r=>r.name==='products'),cat=stats.reads.find(r=>r.name==='categories');
 assert.equal(stats.auth,2,'Middleware and page each verify authentication');assert.equal(stats.permission,1,'One admin permission check per render');assert.ok(prod.start<cat.end&&cat.start<prod.end,'Product and category reads should overlap');
 console.log(`PASS optimized list: ${duration}ms with 250ms per query; auth ${stats.auth}, permission ${stats.permission}; product/category overlap`);
 for(const failure of ['products','categories']){await api('/_qa/admin-config',{delayMs:0,failure});const failed=await page('/admin/products');assert.match(failed.html,/Could not load products or categories/);assert.doesNotMatch(failed.html,/Private Performance Draft/)}
 await api('/_qa/admin-config',{delayMs:0,failure:''});assert.match((await page('/admin/products')).html,/Private Performance Draft/);console.log('PASS product and category errors fail safely and recover');
 await api('/_qa/admin-config',{delayMs:0,allowed:false});await api('/_qa/admin-reset',{});
 const revoked=await page('/admin/products');assert.doesNotMatch(revoked.html,/Private Performance Draft/);assert.ok(revoked.r.status>=300||/admin\/login/.test(revoked.html),'Revoked admin must be redirected');
 const denied=await post('/admin/products/new',save,{...product,title:'Unauthorized draft',slug:'unauthorized-draft'});assert.ok(denied.status===303||denied.status===307);assert.match(denied.headers.get('location')||'',/admin\/login/);assert.ok((await api('/_qa/admin-stats')).permission>=2,'Permission rechecked on next request and action');
 await api('/_qa/admin-config',{delayMs:0,allowed:true});const restored=await page('/admin/products');assert.match(restored.html,/Private Performance Draft/);assert.doesNotMatch(restored.html,/Unauthorized draft/);
 const guest=await fetch(base+'/admin/products',{redirect:'manual'});assert.equal(guest.status,307);assert.doesNotMatch(await guest.text(),/Private Performance Draft/);
 const publicPage=await fetch(base+'/shop');assert.doesNotMatch(await publicPage.text(),/Private Performance Draft/);console.log('PASS permission revocation, server-action protection, restored access and private data isolation');
})().catch(e=>{console.error(e);process.exitCode=1});
