import assert from 'node:assert/strict';
import {inventory} from '../src/lib/inventory';
import {productSpecs} from '../src/lib/product-specs';
const product=inventory[0];
assert.deepEqual(productSpecs({...product,brand:'',cpu:'  ',ram_gb:null,storage_gb:null,condition:null,extra_specs:{Empty:'  ','':'value'}}),[]);
assert.deepEqual(productSpecs({...product,brand:' Dell ',cpu:' i5 ',ram_gb:8,storage_gb:256,condition:' Used ',extra_specs:{Colour:' Black ',Blank:''}}),[
 ['Brand','Dell'],['Processor','i5'],['Memory','8 GB'],['Storage capacity','256 GB'],['Condition','Used'],['Colour','Black']
]);
assert.ok(productSpecs({...product,ram_gb:0}).some(([k,v])=>k==='Memory'&&v==='0 GB'));
console.log('Optional product specifications checks passed');
