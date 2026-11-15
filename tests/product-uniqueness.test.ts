import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
import {inventory} from '../src/lib/inventory';

const db=new PGlite();
(async()=>{
 try {
  await db.exec(`CREATE TABLE products (id text primary key, slug text not null unique, title text not null, cpu text not null default '', ram_gb integer, storage_gb integer);`);
  for(const p of inventory)await db.query('INSERT INTO products VALUES ($1,$2,$3,$4,$5,$6)',[p.id,p.slug,p.title,p.cpu,p.ram_gb,p.storage_gb]);
  await db.exec(await readFile('supabase/migrations/0002_product_uniqueness.sql','utf8'));
  const first=inventory[0];
  await assert.rejects(()=>db.query('INSERT INTO products VALUES ($1,$2,$3,$4,$5,$6)',['qa-duplicate','unique-qa',`  ${first.title.toUpperCase().replace(/ /g,'   ')}  `,` ${first.cpu.toLowerCase()} `,first.ram_gb,first.storage_gb]),/products_unique_configuration/);
  await assert.rejects(()=>db.query('INSERT INTO products VALUES ($1,$2,$3,$4,$5,$6)',['qa-slug',` ${first.slug.toUpperCase()} `,'different','different',1,2]),/products_slug_normalized_key/);
  await db.query('INSERT INTO products VALUES ($1,$2,$3,$4,$5,$6)',['qa-variant','unique-variant',first.title,first.cpu,first.ram_gb,9999]);
  await db.query('INSERT INTO products VALUES ($1,$2,$3,$4,$5,$6)',['qa-null','unique-null','Unknown laptop','',null,null]);
  await assert.rejects(()=>db.query('INSERT INTO products VALUES ($1,$2,$3,$4,$5,$6)',['qa-null2','unique-null2','  UNKNOWN    LAPTOP ',' ',null,null]),/products_unique_configuration/);
  await db.query('UPDATE products SET title=$1 WHERE id=$2',[first.title.toUpperCase(),first.id]);
  await assert.rejects(()=>db.query('UPDATE products SET title=$1,cpu=$2,ram_gb=$3,storage_gb=$4 WHERE id=$5',[first.title,first.cpu,first.ram_gb,first.storage_gb,'qa-variant']),/products_unique_configuration/);
  const attempts=await Promise.allSettled([
   db.query('INSERT INTO products VALUES ($1,$2,$3,$4,$5,$6)',['race-a','race-a','Race model','CPU',8,256]),
   db.query('INSERT INTO products VALUES ($1,$2,$3,$4,$5,$6)',['race-b','race-b','race  model','cpu',8,256])
  ]);assert.equal(attempts.filter(x=>x.status==='fulfilled').length,1);assert.equal(attempts.filter(x=>x.status==='rejected').length,1);
  console.log('PostgreSQL duplicate constraint checks passed');
 } finally {await db.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
