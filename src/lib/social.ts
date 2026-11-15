/** Only allow genuine HTTPS links for the configured platform; empty values are not links. */
export function socialUrl(value:string|undefined,platform:'tiktok'|'instagram'|'facebook'):string|null {
 if(!value)return null;
 try{
  const url=new URL(value);
  const domain={tiktok:'tiktok.com',instagram:'instagram.com',facebook:'facebook.com'}[platform];
  if(url.protocol!=='https:' || url.username || url.password || !(url.hostname===domain || url.hostname.endsWith('.'+domain)))return null;
  return url.toString();
 }catch{return null}
}

// Profile links provided by the shop owner. Optional environment variables can override them.
export const defaultSocialUrls={
 facebook:'https://www.facebook.com/share/1G9nTWaWoP/',
 instagram:'https://www.instagram.com/nextgen_laptops_abbottabad?dlrf=dWNwdjl1czQ3dTBh',
 tiktok:'https://tiktok.com/@nextgenlaptopsabbottabad',
} as const;
