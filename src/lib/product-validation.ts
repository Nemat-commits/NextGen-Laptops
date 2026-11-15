export type ProductValues={title:string;slug:string;category_id:string;brand:string;cpu:string;ram_gb:string;storage_gb:string;price_pkr:string;discount_price_pkr:string;quantity:string;stock_status:string;condition:string;description:string;image_url:string;image_source:string;is_published:boolean};
export type ProductField=keyof ProductValues|'image_file';
export type ProductFormState={message:string;errors:Partial<Record<ProductField,string>>};
export const initialProductFormState:ProductFormState={message:'',errors:{}};
const statuses=['unconfirmed','in_stock','low_stock','out_of_stock'];
const maxInteger=2147483647;
export function validateProduct(form:FormData){
 const text=(key:string)=>String(form.get(key)||'').trim();
 const values:ProductValues={title:text('title'),slug:text('slug').toLowerCase(),category_id:text('category_id'),brand:text('brand'),cpu:text('cpu'),ram_gb:text('ram_gb'),storage_gb:text('storage_gb'),price_pkr:text('price_pkr'),discount_price_pkr:text('discount_price_pkr'),quantity:text('quantity'),stock_status:text('stock_status'),condition:text('condition'),description:text('description'),image_url:text('image_url'),image_source:text('image_source'),is_published:form.get('is_published')==='on'};
 const errors:ProductFormState['errors']={};
 if(!values.title)errors.title='Enter a product name.';else if(values.title.length>200)errors.title='Keep the product name under 200 characters.';
 if(!values.slug)errors.slug='Enter a URL slug.';else if(values.slug.length>200||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug))errors.slug='Use lowercase letters, numbers and single hyphens, with no spaces or hyphen at either end.';
 if(!values.category_id)errors.category_id='Choose a category.';
 for(const [key,label] of [['brand','Brand'],['cpu','Processor'],['condition','Condition']] as const)if(values[key].length>200)errors[key]=`${label} must be 200 characters or fewer.`;
 if(values.description.length>10000)errors.description='Keep the description under 10,000 characters.';
 const numbers={} as Record<'ram_gb'|'storage_gb'|'price_pkr'|'discount_price_pkr'|'quantity',number|null>;
 for(const [key,label] of [['ram_gb','RAM'],['storage_gb','Storage'],['price_pkr','Price'],['discount_price_pkr','Discount price'],['quantity','Quantity']] as const){
  const value=values[key];const n=value===''?null:Number(value);numbers[key]=n;
  if(value!==''&&(!/^\d+$/.test(value)||!Number.isSafeInteger(n)||n!>maxInteger))errors[key]=`${label} must be a whole number from 0 to ${maxInteger.toLocaleString('en-PK')}.`;
 }
 if(!errors.price_pkr&&!errors.discount_price_pkr&&numbers.discount_price_pkr!==null&&(numbers.price_pkr===null||numbers.discount_price_pkr>=numbers.price_pkr))errors.discount_price_pkr='Enter an original price first; the discount price must be lower than it.';
 if(!statuses.includes(values.stock_status))errors.stock_status='Choose a valid availability status.';
 for(const [key,label] of [['image_url','Image URL'],['image_source','Manufacturer image source URL']] as const){
  const value=values[key];if(!value)continue;
  if(key==='image_url'&&/^\/products\/[a-z0-9-]+\.webp$/.test(value))continue;
  try{const url=new URL(value);if(value.length>2048||url.protocol!=='https:'||url.username||url.password)throw Error()}catch{errors[key]=`${label} must be a valid HTTPS link${key==='image_url'?' or an existing /products/ image path':''}.`;}
 }
 const upload=form.get('image_file'),camera=form.get('camera_file');
 if(upload instanceof File&&upload.size&&camera instanceof File&&camera.size)errors.image_file='Choose either a file or a camera photo, not both.';
 const file=camera instanceof File&&camera.size?camera:upload instanceof File&&upload.size?upload:null;
 if(file&&(file.size>2*1024*1024||!['image/webp','image/jpeg','image/png'].includes(file.type)))errors.image_file='Choose a JPEG, PNG or WebP image no larger than 2 MB.';
 return {values,numbers,errors,file};
}
