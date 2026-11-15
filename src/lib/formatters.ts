export const price=(n:number|null)=>n==null?'Price on request':`Rs. ${n.toLocaleString('en-PK')}`;

/** Return the nearest whole percentage for a valid sale; otherwise there is no discount. */
export function discountPercent(original:number|null,discount:number|null):number|null {
 if(original===null||discount===null||!Number.isFinite(original)||!Number.isFinite(discount)||original<=0||discount<0||discount>=original)return null;
 return Math.round((original-discount)/original*100);
}
