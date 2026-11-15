import React from 'react';
import {price,discountPercent} from '@/lib/formatters';

export default function ProductPrice({original,discount}:{original:number|null;discount:number|null}) {
 const percent=discountPercent(original,discount);
 if(percent===null)return <div className="product-price"><strong>{price(original)}</strong></div>;
 return <div className="product-price product-price--sale">
  <del><span className="visually-hidden">Original price: </span>{price(original)}</del>
  <strong><span className="visually-hidden">Sale price: </span>{price(discount)}</strong>
  <span className="discount-badge" title="Discount rounded to the nearest whole percent" aria-label={`${percent} percent off, rounded to the nearest whole percent`}>−{percent}%</span>
 </div>;
}
