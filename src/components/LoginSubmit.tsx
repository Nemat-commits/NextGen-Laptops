'use client';

import {useFormStatus} from 'react-dom';

export default function LoginSubmit(){
 const {pending}=useFormStatus();
 return <>
  <button className="primary-button" type="submit" disabled={pending}>{pending?'Signing in…':'Sign in →'}</button>
  <span role="status" aria-live="polite">{pending?'Signing in, please wait.':''}</span>
 </>;
}
