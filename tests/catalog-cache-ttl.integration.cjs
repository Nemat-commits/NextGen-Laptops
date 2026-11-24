// Extended production-mode test against the in-memory mock only; runs the real five-minute TTL.
const assert=require('node:assert/strict');
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:3002',mock='http://127.0.0.1:4001';
assert.ok(['127.0.0.1','localhost'].includes(new URL(base).hostname),'Use a local test server only');
let cookies='';
async function request(path,opts={}){const r=await fetch(base+path,{...opts,redirect:'manual',headers:{...(cookies?{cookie:cookies}:{}),...(opts.method==='POST'?{origin:base}:{}),...opts.headers}});const sets=r.headers.getSetCookie();if(sets.length)cookies=sets.map(x=>x.split(';')[0]).join('; ');return r}
async function page(path){const r=await request(path);return {status:r.status,html:await r.text()}}
function action(html,contains){const form=[...html.matchAll(/<form\b[^>]*>[\s\S]*?<\/form>/g)].map(m=>m[0]).find(x=>x.includes(contains));assert.ok(form,`form containing ${contains}`);const fields=[...form.matchAll(/<input\b[^>]*name="(\$ACTION[^"]+)"[^>]*>/g)].map(m=>[m[1],(m[0].match(/value="([^"]*)"/)?.[1]||'').replaceAll('&quot;','"').replaceAll('&amp;','&').replaceAll('&#x27;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>')]);assert.ok(fields.length);return fields}
async function post(path,fields,values){const body=new FormData();for(const [k,v] of fields)body.set(k,v);for(const [k,v] of Object.entries(values))body.set(k,v);const r=await request(path,{method:'POST',body});assert.equal(r.status,303);return r.headers.get('location')}
async function api(path,opts={}){const r=await fetch(mock+path,opts);assert.ok(r.ok,`mock ${path}: ${r.status}`);return r.json()}
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
(async()=>{
 const login=await page('/admin/login');assert.equal(await post('/admin/login',action(login.html,'name="email"'),{email:'admin@example.test',password:'local-test-password'}),'/admin');
 const form=await page('/admin/products/new');const product={title:'Cache TTL Laptop',slug:'cache-ttl-laptop',category_id:'laptops',brand:'Cache TTL',cpu:'TTL CPU',ram_gb:'8',storage_gb:'128',quantity:'2',price_pkr:'50000',discount_price_pkr:'',stock_status:'in_stock',condition:'',description:'TTL test',image_url:'/products/dell-5300.webp',image_source:'',is_published:'on',is_featured:'on'};
 assert.equal(await post('/admin/products/new',action(form.html,'name="title"'),product),'/admin/products');
 const warmed=await page('/laptops/cache-ttl-laptop');assert.equal(warmed.status,200);assert.match(warmed.html,/Rs\. 50,000/);
 const auth=await api('/auth/v1/token?grant_type=password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'admin@example.test',password:'local-test-password'})});const record=(await api('/rest/v1/products')).find(p=>p.slug==='cache-ttl-laptop');assert.ok(record);
 await api('/rest/v1/products?id=eq.'+record.id,{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:'Bearer '+auth.access_token},body:JSON.stringify({price_pkr:55000})});
 const before=await page('/laptops/cache-ttl-laptop');assert.match(before.html,/Rs\. 50,000/);assert.doesNotMatch(before.html,/Rs\. 55,000/);console.log('PASS direct database edit remains cached before expiry; waiting for the five-minute safety net');
 await sleep(302000);
 const deadline=Date.now()+25000;let updated=false;while(Date.now()<deadline){const result=await page('/laptops/cache-ttl-laptop');if(/Rs\. 55,000/.test(result.html)){updated=true;break}await sleep(1000)}
 assert.ok(updated,'External change did not appear after cache revalidation');console.log('PASS direct database change appears after time-based cache revalidation');
})().catch(e=>{console.error(e);process.exitCode=1});
