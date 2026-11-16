import assert from 'node:assert/strict';
import {productSlugBase} from '../src/lib/product-slug';
assert.equal(productSlugBase('Dell Latitude 5300','i5 8th Gen','8','256'),'dell-latitude-5300-i5-8th-gen-8gb-256gb');
assert.equal(productSlugBase('Café Pro & More','','',''),'cafe-pro-more');
assert.equal(productSlugBase('💻','','',''),'product');
assert.ok(productSlugBase('x '.repeat(200),'i5','8','256').length<=180);
console.log('Automatic product slug checks passed');
