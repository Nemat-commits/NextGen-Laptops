export const price=(n:number|null)=>n==null?'Price on request':`Rs. ${n.toLocaleString('en-PK')}`;
