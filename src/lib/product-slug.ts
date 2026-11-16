/** Human-readable base; the server appends a random suffix to avoid collisions. */
export function productSlugBase(title:string,cpu:string,ram:string,storage:string):string {
 const spec=[title,cpu,ram?`${ram}gb`:'',storage?`${storage}gb`:''].filter(Boolean).join(' ');
 return spec.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,180).replace(/-+$/,'')||'product';
}
