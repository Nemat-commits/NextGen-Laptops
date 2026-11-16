import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
(async()=>{const db=new PGlite();try{
 await db.exec("create table products (id text primary key, title text not null); insert into products values ('1','Existing product');");
 await db.exec(await readFile('supabase/migrations/0004_homepage_featured.sql','utf8'));
 const existing=await db.query<{title:string;is_featured:boolean}>('select title,is_featured from products');assert.deepEqual(existing.rows,[{title:'Existing product',is_featured:false}]);
 await db.query('update products set is_featured=true where id=$1',['1']);assert.equal((await db.query<{is_featured:boolean}>('select is_featured from products')).rows[0].is_featured,true);
 console.log('Homepage migration preserves existing records');
}finally{await db.close()}})().catch(e=>{console.error(e);process.exitCode=1});
