/** Only allow genuine HTTPS links for the configured platform; empty values are not links. */
export function socialUrl(value:string|undefined,platform:'tiktok'|'instagram'):string|null {
 if(!value)return null;
 try{
  const url=new URL(value);
  const domain=platform==='tiktok'?'tiktok.com':'instagram.com';
  if(url.protocol!=='https:' || url.username || url.password || !(url.hostname===domain || url.hostname.endsWith('.'+domain)))return null;
  return url.toString();
 }catch{return null}
}
