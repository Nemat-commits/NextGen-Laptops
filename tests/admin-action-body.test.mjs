// Run against a local production server built without Supabase environment variables.
// This checks the framework's multipart body limit, not an authenticated upload.
import assert from 'node:assert/strict';

const base = 'http://127.0.0.1:3000';
const html = await (await fetch(`${base}/admin/login`)).text();
const action = html.match(/name="(\$ACTION_ID_[^"]+)"/)?.[1];
assert.ok(action, 'login server action field is present');

async function submit(bytes) {
  const form = new FormData();
  form.set(action, '');
  form.set('email', 'test@example.invalid');
  form.set('password', 'not-a-real-password');
  form.set('image_file', new Blob([Buffer.alloc(bytes)], {type: 'image/jpeg'}), 'test.jpg');
  return fetch(`${base}/admin/login`, {method: 'POST', body: form, redirect: 'manual', headers: {origin: base}});
}

const allowed = await submit(1_500_000);
assert.equal(allowed.status, 303, 'a request containing a 1.5 MB file reaches the action');
assert.equal(allowed.headers.get('location'), '/admin/login?error=configuration', 'run this check only without Supabase configured');
const tooLarge = await submit(3_500_000);
assert.notEqual(tooLarge.status, 303, 'an oversized multipart request is rejected before the action');
console.log('Admin server-action body limit checks passed');
