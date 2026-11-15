/* Live destructive QA: only records with a random, per-run QA slug are touched.
 * Requires a dedicated temporary admin account, supplied via GitHub secrets.
 * Never log credentials, session cookies, authorization headers, or traces.
 */
const {chromium}=require('playwright');
const {createClient}=require('@supabase/supabase-js');
const {randomBytes}=require('node:crypto');
const {readFile}=require('node:fs/promises');
const assert=require('node:assert/strict');

const base='https://next-gen-laptops.vercel.app';
const supabaseUrl='https://sqdxnxcxajcgjvmcsksp.supabase.co';
const publicKey='sb_publishable_N3z5B9NpOOFVzHDzzZKJgQ_PgBCZwXt';
const {QA_EMAIL:email,QA_PASSWORD:password}=process.env;
if(!email||!password){console.error('::error title=QA setup::Missing dedicated QA account secrets. No tests were run.');process.exit(1)}
const token=randomBytes(8).toString('hex');
const categorySlug=`qa-automation-${token}`;
const productSlug=`qa-automation-product-${token}`;
const bigSlug=`qa-automation-large-${token}`;
const db=createClient(supabaseUrl,publicKey,{auth:{persistSession:false,autoRefreshToken:false}});
let browser,categoryId;
const uploaded=new Set();
let failures=0;
const secrets=[email,password].filter(Boolean);
function sanitize(message){let s=String(message).replace(/https?:\/\/\S+/g,'[url]');for(const secret of secrets)s=s.split(secret).join('[redacted]');return s.slice(0,500)}
async function check(label,fn){try{await fn();console.log(`::notice title=QA passed::${label}`);return true}catch(e){failures++;console.error(`::error title=QA failed::${label}: ${sanitize(e.message).replace(/\r?\n/g,' ')}`);return false}}
async function lookup(slug){const {data,error}=await db.from('products').select('id,slug,title,category_id,image_url,is_published,price_pkr,description').eq('slug',slug).maybeSingle();if(error)throw new Error('Could not query QA product');return data}
async function waitRecord(slug,exists=true){for(let i=0;i<15;i++){const p=await lookup(slug);if(Boolean(p)===exists)return p;await new Promise(r=>setTimeout(r,400))}throw new Error(`QA product ${exists?'not found':'still present'}`)}
async function goto(page,path){await page.goto(base+path,{waitUntil:'domcontentloaded'});await page.locator('body').waitFor();}
async function fillProduct(page,slug,title,category,large=false){
 await goto(page,'/admin/products/new');
 await page.locator('input[name=title]').fill(title);await page.locator('input[name=slug]').fill(slug);
 await page.locator('select[name=category_id]').selectOption(category);
 await page.locator('input[name=brand]').fill('QA TEST');await page.locator('input[name=cpu]').fill('QA processor');
 await page.locator('input[name=ram_gb]').fill('8');await page.locator('input[name=storage_gb]').fill('256');
 await page.locator('input[name=price_pkr]').fill('10000');await page.locator('input[name=quantity]').fill('1');
 await page.locator('textarea[name=description]').fill('Automated QA draft. Not for sale.');
 const original=await readFile('public/products/dell-5300.webp');
 const buffer=large?Buffer.concat([original,Buffer.alloc(Math.max(0,1500000-original.length))]):original;
 await page.locator('input[name=image_file]').setInputFiles({name:'qa-test.webp',mimeType:'image/webp',buffer});
 await page.getByRole('button',{name:'Save product'}).click();
 await page.waitForURL(/\/admin\/products(?:\?|$)/,{timeout:20000});
 assert.ok(!new URL(page.url()).searchParams.has('error'),'The admin form returned an error');
}
(async()=>{
 try{
  const {data,error}=await db.auth.signInWithPassword({email,password});
  if(error||!data.user)throw new Error('QA account could not sign in to Supabase');
  const member=await db.from('admin_users').select('user_id').eq('user_id',data.user.id).maybeSingle();
  if(member.error||!member.data)throw new Error('QA account is not allowlisted as an admin');
  browser=await chromium.launch({headless:true});const context=await browser.newContext();const page=await context.newPage();page.setDefaultTimeout(15000);
  await check('Unauthenticated admin access redirects to login',async()=>{await goto(page,'/admin');assert.match(page.url(),/\/admin\/login/)});
  const signedIn=await check('Live admin sign-in and dashboard',async()=>{
   await page.locator('input[name=email]').fill(email);await page.locator('input[name=password]').fill(password);
   await page.getByRole('button',{name:'Sign in'}).click();await page.waitForURL(/\/admin\/?$/,{timeout:20000});
   await page.getByRole('heading',{name:'Your inventory',exact:true}).waitFor();
  });
  if(!signedIn)throw new Error('Cannot proceed without a working admin dashboard');
  const created=await check('Create a dedicated test category',async()=>{
   await goto(page,'/admin/categories');await page.locator('input[name=name]').fill(categorySlug);
   await page.getByRole('button',{name:'Create category'}).click();await page.getByText(categorySlug,{exact:true}).first().waitFor();
   const q=await db.from('categories').select('id,slug').eq('slug',categorySlug).maybeSingle();assert.ok(!q.error&&q.data);categoryId=q.data.id;
  });
  if(!created||!categoryId)throw new Error('Cannot continue without the QA category');
  const added=await check('Create an unpublished test product with a small image',async()=>{
   await fillProduct(page,productSlug,'QA AUTOMATION — NOT FOR SALE',categoryId);const p=await waitRecord(productSlug);
   assert.equal(p.is_published,false);assert.equal(p.category_id,categoryId);assert.ok(p.image_url);
  });
  if(added){
   const p=await lookup(productSlug);
   if(p.image_url)uploaded.add(p.image_url);
   await check('Edit the test product',async()=>{
    await goto(page,`/admin/products/${encodeURIComponent(p.id)}`);await page.locator('input[name=price_pkr]').fill('12000');
    await page.locator('textarea[name=description]').fill('Automated QA edited draft. Not for sale.');
    await page.getByRole('button',{name:'Save product'}).click();await page.waitForURL(/\/admin\/products(?:\?|$)/,{timeout:20000});
    assert.ok(!new URL(page.url()).searchParams.has('error'));const changed=await lookup(productSlug);assert.equal(changed.price_pkr,12000);assert.match(changed.description,/edited draft/);
   });
   await check('Delete the test product in the admin interface',async()=>{
    await goto(page,`/admin/products/${encodeURIComponent(p.id)}`);page.once('dialog',dialog=>dialog.accept());
    await page.getByRole('button',{name:'Delete this product'}).click();await page.waitForURL(/\/admin\/products(?:\?|$)/,{timeout:20000});
    assert.ok(!new URL(page.url()).searchParams.has('error'));await waitRecord(productSlug,false);
   });
  }
  await check('Upload an image between 1 MB and the advertised 2 MB limit',async()=>{
   await fillProduct(page,bigSlug,'QA LARGE UPLOAD — NOT FOR SALE',categoryId,true);const p=await waitRecord(bigSlug);assert.equal(p.is_published,false);if(p.image_url)uploaded.add(p.image_url);
  });
  await check('Sign out and protect the dashboard',async()=>{
   await goto(page,'/admin');await page.getByRole('button',{name:'Sign out'}).click();await page.waitForURL(/\/admin\/login/);await goto(page,'/admin');assert.match(page.url(),/\/admin\/login/);
  });
 }catch(e){failures++;console.error(`::error title=QA stopped::${sanitize(e.message).replace(/\r?\n/g,' ')}`)}
 finally{
  if(browser)await browser.close();
  // Query only our unguessable test slugs. Never delete existing inventory.
  if(!categoryId){try{const r=await db.from('categories').select('id').eq('slug',categorySlug).maybeSingle();if(r.error)throw r.error;categoryId=r.data?.id}catch{failures++;console.error(`Could not find QA category for cleanup: ${categorySlug}`)}}
  for(const slug of [productSlug,bigSlug]){
   try{const p=await lookup(slug);if(p){if(p.image_url)uploaded.add(p.image_url);const r=await db.from('products').delete().eq('id',p.id).eq('slug',slug).eq('category_id',categoryId);if(r.error)throw r.error;console.log('Cleaned up QA product')}}catch{failures++;console.error('QA product cleanup failed; inspect the QA category in Supabase')}
  }
  for(const url of uploaded){
   try{const prefix=`${supabaseUrl}/storage/v1/object/public/product-images/`;if(!url.startsWith(prefix))throw Error();const path=url.slice(prefix.length);if(!/^[0-9a-f-]{36}\.(jpg|png|webp)$/.test(path))throw Error();const r=await db.storage.from('product-images').remove([path]);if(r.error)throw r.error;console.log('Cleaned up QA image')}catch{failures++;console.error('QA image cleanup failed; inspect the product-images bucket')}
  }
  if(categoryId){try{const r=await db.from('categories').delete().eq('id',categoryId).eq('slug',categorySlug);if(r.error)throw r.error;console.log('Cleaned up QA category')}catch{failures++;console.error(`QA category cleanup failed: ${categorySlug}`)}}
  await db.auth.signOut();
 }
 if(failures){console.error(`${failures} check(s) failed or could not complete.`);process.exitCode=1}else console.log('All live QA checks passed.');
})();
