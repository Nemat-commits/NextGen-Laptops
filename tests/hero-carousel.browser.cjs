// Optional isolated browser regression test; never connects to production.
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const launch={headless:true};
 if(process.env.TEST_CHROMIUM_PATH){launch.executablePath=process.env.TEST_CHROMIUM_PATH;launch.args=['--no-sandbox'];}
 const browser=await chromium.launch(launch);
 try{
  const base=process.env.TEST_BASE_URL||'http://127.0.0.1:3002';
  const target=new URL(base);assert.ok(['127.0.0.1','localhost'].includes(target.hostname),'Use a local test server only');
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  await page.goto(base+'/',{waitUntil:'domcontentloaded'});await page.waitForTimeout(600);
  const hero=page.locator('.hero'),art=hero.locator('.hero-art');
  const theme=()=>hero.getAttribute('data-theme');
  const advances=async(previous)=>page.waitForFunction(value=>document.querySelector('.hero')?.dataset.theme!==value,previous,{timeout:7000});
  let rect=await art.boundingBox();assert.ok(rect);let x=rect.x+rect.width*.7,y=rect.y+rect.height*.45;
  await page.mouse.move(x,y);let before=await theme();await advances(before);
  await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x-130,y,{steps:5});await page.mouse.up();before=await theme();await advances(before);
  await hero.getByRole('button',{name:/Go to slide 2/}).click();assert.equal(await theme(),'work');before=await theme();await advances(before);
  console.log('PASS mouse hover, drag and indicator selection continue rotating');

  await page.setViewportSize({width:375,height:812});const cdp=await page.context().newCDPSession(page);await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
  await page.goto(base+'/',{waitUntil:'domcontentloaded'});await page.waitForTimeout(600);await art.scrollIntoViewIfNeeded();await page.evaluate(()=>window.scrollBy(0,120));rect=await art.boundingBox();assert.ok(rect);x=rect.x+rect.width*.75;y=rect.y+rect.height*.4;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-100,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(200);assert.equal(await theme(),'work');before=await theme();await advances(before);
  const dot=hero.getByRole('button',{name:/Go to slide 1/});rect=await dot.boundingBox();assert.ok(rect);x=rect.x+rect.width/2;y=rect.y+rect.height/2;await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(200);assert.equal(await theme(),'everyday');before=await theme();await advances(before);
  console.log('PASS touchscreen swipe and indicator selection continue rotating');

  await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:false});await page.setViewportSize({width:1280,height:900});await page.goto(base+'/',{waitUntil:'domcontentloaded'});await page.waitForTimeout(600);await page.keyboard.press('Tab');await art.focus();assert.equal(await art.evaluate(e=>e.matches(':focus-visible')),true);before=await theme();await page.waitForTimeout(4000);assert.equal(await theme(),before);await page.locator('#header-product-search').focus();await advances(before);
  // The text layers share a stable footprint so slide changes do not push the page around.
  for(const width of [320,375,768,1280]){
   await page.setViewportSize({width,height:900});await page.goto(base+'/',{waitUntil:'domcontentloaded'});await page.waitForTimeout(600);await page.keyboard.press('Tab');await art.focus();
   const initial=await hero.boundingBox();assert.ok(initial);assert.equal(await hero.locator('h1').count(),1);
   for(let i=0;i<2;i++){await page.keyboard.press('ArrowRight');await page.waitForTimeout(750);const box=await hero.boundingBox();assert.ok(box);assert.ok(Math.abs(initial.height-box.height)<2,`Hero height changed at ${width}px`);assert.equal(await hero.locator('h1').count(),1)}
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
  }
  console.log('PASS stable hero height and one accessible heading across slides');
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'/',{waitUntil:'domcontentloaded'});await page.waitForTimeout(4000);assert.equal(await theme(),'everyday');
  console.log('PASS keyboard focus pauses temporarily and reduced-motion preference stops rotation');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
