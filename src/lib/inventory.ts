export type Product = { revision?:string; id:string; slug:string; title:string; brand:string; category_id:string; cpu:string; ram_gb:number|null; storage_gb:number|null; quantity:number; source_rows?:number[]; price_pkr:number|null; discount_price_pkr:number|null; stock_status:string; is_published:boolean; description:string; image_url:string|null; image_source:string|null; condition:string|null; extra_specs?:Record<string,string> };
export type Category = {id:string; name:string; slug:string};
export const defaultCategories:Category[]=[{id:'laptops',name:'Laptops',slug:'laptops'}];
// Transcription of the supplied numbered inventory. Each entry represents one listed unit.
// Fields absent from the source (including price, condition and exact CPU model) remain unknown.
const rows = `Dell Latitude 5289 x360|i5 7th Gen|8|128
Dell Latitude 5300|i5 8th Gen|8|128
Dell Latitude 5300|i5 8th Gen|8|128
Dell Latitude 5300|i5 8th Gen|8|128
Dell Latitude 5300|i5 8th Gen|8|256
Dell Latitude 7300|i5 8th Gen|8|128
Dell Latitude 7300|i5 8th Gen|8|128
Dell Latitude 5410|i5 8th Gen|8|256
Dell Latitude 5310|i5 10th Gen|8|256
Dell Latitude 5310|i5 10th Gen|8|128
Dell Latitude 5310|i5 10th Gen|8|128
Dell Latitude 7310|i5 10th Gen|8|256
Dell Latitude 5410|i5 10th Gen|8|256
Dell Latitude 5410|i5 10th Gen|8|256
Dell Latitude 5410|i5 10th Gen|8|256
Dell Latitude 5410|i5 10th Gen|8|256
Dell Latitude 7410|i7 10th Gen|16|256
Lenovo L13|i5 10th Gen|8|256
Lenovo L13|i5 10th Gen|8|128
HP 250 G8|i5 10th Gen|8|256
HP 250 G8|i5 10th Gen|8|256
HP 430 G7|i5 10th Gen|8|256
Dell Latitude 7320|i5 11th Gen|8|256
Dell Latitude 5320|i5 11th Gen|8|256
Dell Latitude 7320|i7 11th Gen|16|256
Dell Latitude 5430|i5 12th Gen|8|256
Dell Latitude 5430|i5 12th Gen|8|256
Dell Latitude 5440|i5 13th Gen|8|256
Microsoft Surface 3|i5 10th Gen|8|256
Dell Latitude 5310 x360|i5 10th Gen|8|128
HP EliteBook 840 G6|i5 8th Gen|8|256
HP EliteBook 840 G6|i7 8th Gen|8|256
Dell Latitude 5300|i5 8th Gen|8|256
Dell Latitude 7320|i7 11th Gen|16|256
Dell Latitude 5310 x360|i5 10th Gen|8|128
HP 840 G7|i5 10th Gen|8|256
HP 250 G8|i5 10th Gen|8|256
HP 250 G8|i5 10th Gen|8|256
HP 250 G8|i5 10th Gen|8|256
Dell Latitude 5300|i5 8th Gen|8|256
Dell Latitude 5300|i5 8th Gen|8|256
Dell Latitude 5420|i7 11th Gen|8|256
Dell Latitude 5320|i7 11th Gen|16|256
Dell Latitude 5320|i7 11th Gen|16|256
Dell Latitude 5320|i7 11th Gen|16|256
Dell Latitude 5320|i5 11th Gen|16|256
Dell Latitude 5320|i5 11th Gen|16|256
Dell Latitude 5320|i5 11th Gen|16|256
Dell Latitude 5320|i7 11th Gen|16|256
Dell Latitude 5420|i7 11th Gen|8|256
Dell Latitude 5320|i5 11th Gen|16|256
Dell Latitude 5320|i5 11th Gen|16|256
Dell Latitude 5320|i5 11th Gen|16|256
Dell Latitude 5320|i5 11th Gen|16|256
Dell Latitude 5320|i5 11th Gen|16|256
Dell Latitude 5320|i5 11th Gen|16|256
Dell Latitude 5320|i5 11th Gen|8|256
Dell Latitude 5320|i5 11th Gen|8|256
Dell Latitude 5320 x360|i5 11th Gen|8|256
Dell Latitude 5320 x360|i5 11th Gen|8|256
Dell Latitude 5320|i7 11th Gen|16|256
Dell Latitude 5410|i5 10th Gen|8|256
Dell Latitude 7410|i5 10th Gen|8|256
Dell Latitude 7280|i5 6th Gen|8|128
Dell Latitude 5330|i5 12th Gen|16|256
Dell Latitude 7320|i7 11th Gen|16|256
Lenovo L13|i5 11th Gen|8|256
Lenovo L13|i5 11th Gen|8|256
Lenovo L13|i5 11th Gen|8|256
Lenovo L13|i5 10th Gen|8|256
Lenovo L13|i7 11th Gen|16|512
Lenovo L13 x360|i5 11th Gen|8|256
HP 840 G8|i5 11th Gen|16|256
HP 840 G8|i5 11th Gen|16|256
Dell Latitude 7320|i5 11th Gen|8|256
Dell Latitude 7320|i5 11th Gen|8|256
Dell Latitude 7320|i5 11th Gen|16|256
Dell Latitude 7320|i7 11th Gen|16|256
Dell Latitude 5440|i5 13th Gen|8|256
Dell Latitude 5430|i5 12th Gen|8|256
HP 440 G8|i5 11th Gen|8|256
Lenovo L13|i7 11th Gen|16|512
HP 250 G8|i5 10th Gen|8|256
HP 250 G8|i7 10th Gen|8|128
HP 250 G7|i5 10th Gen|8|256
HP 250 G7|i5 10th Gen|8|256
HP 250 G7|i5 10th Gen|8|256
HP 440 G8|i5 11th Gen|8|256
Dell Latitude 5320 x360|i5 11th Gen|16|256
Dell Latitude 3320|i5 11th Gen|8|256
Dell Latitude 5310|i7 10th Gen|16|256
Lenovo V15|i5 10th Gen|8|256
Lenovo V15|i5 10th Gen|8|256
HP EliteBook 830 G8|i7 11th Gen|16|512
HP ZBook|i7 10th Gen|16|512`.split('\n');
// Manufacturer reference photos are illustrative, not photographs of the individual units.
const localImages:Record<string,[string,string]> = {
 'Dell Latitude 5289 x360':['dell-5289','https://dell.com/en-us/shop/productdetails/latitude-12-5289-2-in-1-laptop'],
 'Dell Latitude 5300':['dell-5300','https://www.dell.com/support/product-details/en-us/product/latitude-13-5300-laptop/drivers'],
 'Dell Latitude 7300':['dell-7300','https://www.dell.com/support/product-details/en-us/product/latitude-13-7300-laptop/drivers'],
 'Dell Latitude 5310':['dell-5310','https://www.dell.com/support/product-details/en-us/product/latitude-13-5310-laptop/drivers'],
 'Dell Latitude 5310 x360':['dell-5310-x360','https://dell.com/support/product-details/en-us/product/latitude-13-5310-2-in-1-laptop/drivers'],
 'Dell Latitude 7310':['dell-7310','https://www.dell.com/ae/business/p/latitude-13-7310-2-in-1-laptop/pd'],
 'Dell Latitude 7410':['dell-7410','https://www.dell.com/us/dfb/p/latitude-14-7410-2-in-1-laptop/pd/'],
 'Dell Latitude 7280':['dell-7280','https://www.dell.com/support/product-details/en-us/product/latitude-12-7280-laptop/drivers'],
 'Dell Latitude 3320':['dell-3320','https://www.dell.com/support/product-details/en-us/product/latitude-13-3320-laptop/drivers'],
 'Dell Latitude 5330':['dell-5330','https://www.dell.com/en-us/shop/dell-laptops/latitude-5330-laptop-or-2-in-1/spd/latitude-13-5330-laptop'],
 'Dell Latitude 5320 x360':['dell-5320-x360','https://www.dell.com/en-us/shop/2-in-1-laptops-tablets/latitude-5320-laptop/spd/latitude-13-5320-2-in-1-laptop'],
 'Dell Latitude 5320':['dell-5320','https://www.dell.com/support/product-details/en-us/product/latitude-13-5320-2-in-1-laptop/drivers'],
 'Dell Latitude 5410':['dell-5410','https://www.dell.com/support/product-details/en-us/product/latitude-14-5410-laptop/drivers'],
 'Dell Latitude 7320':['dell-7320','https://www.dell.com/support/product-details/en-us/product/latitude-13-7320-2-in-1-laptop/drivers'],
 'Dell Latitude 5420':['dell-5420','https://www.dell.com/en-in/shop/business-laptop-notebook-computers/new-latitude-14-5420-laptop/spd/latitude-5420-laptop'],
 'Dell Latitude 5430':['dell-5430','https://www.dell.com/support/product-details/en-us/product/latitude-5430-laptop/drivers'],
 'Dell Latitude 5440':['dell-5440','https://www.dell.com/support/product-details/en-us/product/latitude-14-5440-laptop/drivers'],
 'HP 250 G8':['hp-250-g8','https://jp.ext.hp.com/notebooks/business/hp_250_g8/'],
 'HP 250 G7':['hp-250-g7','https://support.hp.com/gb-en/product/product-specs/hp-250-g7-notebook-pc/24381316/'],
 'HP 430 G7':['hp-430-g7','https://support.hp.com/si-en/product/setup-user-guides/hp-probook-430-g7-notebook-pc/29060970'],
 'HP 440 G8':['hp-440-g8','https://hp.com/mx-es/shop/laptop-probook-hp-440-g8-6d9f6ls.html'],
 'HP EliteBook 840 G6':['hp-840-g6','https://support.hp.com/us-en/product/product-specs/hp-elitebook-840-g6-notebook-pc/model/26609801'],
 'HP 840 G7':['hp-840-g7','https://support.hp.com/sg-en/product/product-specs/hp-elitebook-840-g7-notebook-pc/33386515'],
 'HP 840 G8':['hp-840-g8','https://hp.com/us-en/shop/pdp/hp-elitebook-840-g8-notebook-pc-p-359z6ut-aba-1'],
 'HP EliteBook 830 G8':['hp-830-g8','https://jp.ext.hp.com/notebooks/business/elitebook_830_g8/'],
 'Lenovo L13 x360':['lenovo-l13-yoga','https://www.lenovo.com/de/de/p/laptops/thinkpad/thinkpadl/thinkpad-l13-yoga-gen-2/22tpl13l3y2'],
 'Lenovo V15':['lenovo-v15','https://www.lenovo.com/gb/en/p/laptops/lenovo-laptops/v-series/lenovo-v15-(15%E2%80%9D-intel)/wmd00000502']
};
function imageFor(title:string,cpu:string) {
 if(title==='Lenovo L13') return cpu.includes('11th') ? {url:'/products/lenovo-l13-gen2.webp',source:'https://www.lenovo.com/de/de/p/laptops/thinkpad/thinkpadl/thinkpad-l13-gen-2/22tpl13l3n2'} : {url:'/products/lenovo-l13-gen1.webp',source:'https://store.lenovo.com/in/en/laptops/thinkpad/thinkpad-l-series/thinkpad-l13-13-intel/thinkpad-l13-33-78cms-black-20r3s0hb00-1520.html'};
 const local=localImages[title];if(local)return {url:`/products/${local[0]}.webp`,source:local[1]};
 return {url:null,source:null};
}
export const inventory:Product[] = Object.values(rows.reduce((acc,row,i)=>{const [title,cpu,ram,storage]=row.split('|'); const key=[title,cpu,ram,storage].join('-').toLowerCase().replace(/[^a-z0-9]+/g,'-'); if(acc[key]){acc[key].quantity++;acc[key].source_rows!.push(i+1)} else {const img=imageFor(title,cpu);acc[key]={id:key,slug:key,title,brand:title.split(' ')[0],category_id:'laptops',cpu:`Intel Core ${cpu}`,ram_gb:Number(ram),storage_gb:Number(storage),quantity:1,source_rows:[i+1],price_pkr:null,discount_price_pkr:null,stock_status:'unconfirmed',is_published:true,description:`${title} with Intel Core ${cpu}, ${ram} GB RAM and ${storage} GB storage, as listed in the supplied inventory. Exact processor model, display, graphics, storage type, condition and warranty have not yet been confirmed. Contact the shop for details and availability.`,image_url:img.url,image_source:img.source,condition:null};}return acc;},{} as Record<string,Product>));
