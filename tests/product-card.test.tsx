import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ProductCard from '../src/components/ProductCard';
import type {Product} from '../src/lib/inventory';

const product:Product={id:'1',slug:'example',title:'Example laptop',brand:'Example',category_id:'laptops',cpu:'Core i5',ram_gb:8,storage_gb:256,quantity:3,price_pkr:50000,discount_price_pkr:48000,stock_status:'in_stock',is_published:true,description:'',image_url:'/products/dell-5300.webp',image_source:null,condition:null};
const render=(p:Product)=>renderToStaticMarkup(<ProductCard product={p} categories={[{id:'laptops',name:'Laptops',slug:'laptops'}]}/>);
const sale=render(product);
assert.match(sale,/href="\/laptops\/example"/);assert.match(sale,/In stock/);assert.match(sale,/Core i5/);assert.match(sale,/8 GB RAM/);assert.match(sale,/<dt>Storage<\/dt><dd>256 GB<\/dd>/);assert.doesNotMatch(sale,/256 GB storage/i);assert.match(sale,/Rs\. 50,000/);assert.match(sale,/Rs\. 48,000/);assert.match(sale,/−4%/);assert.doesNotMatch(sale,/reference image/i);
const unavailable=render({...product,stock_status:'out_of_stock',quantity:0,discount_price_pkr:null,cpu:'',ram_gb:null,storage_gb:null,image_url:null});
assert.match(unavailable,/Out of stock/);assert.match(unavailable,/Product image not yet available/);assert.doesNotMatch(unavailable,/card-specs|discount-badge/);
assert.match(render({...product,stock_status:'unconfirmed'}),/Availability unconfirmed/);
console.log('Product card checks passed');
