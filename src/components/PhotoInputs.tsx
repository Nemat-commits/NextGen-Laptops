'use client';
import {useEffect,useRef,useState} from 'react';

const maxSize=2*1024*1024;
async function prepareCameraPhoto(file:File):Promise<File> {
 if(file.size<=maxSize && ['image/jpeg','image/png','image/webp'].includes(file.type))return file;
 const url=URL.createObjectURL(file);
 try {
  const image=new Image();
  image.src=url;
  await image.decode();
  let scale=Math.min(1,2000/Math.max(image.naturalWidth,image.naturalHeight));
  for(let attempt=0;attempt<6;attempt++){
   const canvas=document.createElement('canvas');
   canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
   const context=canvas.getContext('2d');if(!context)throw new Error('Image processing unavailable');
   context.drawImage(image,0,0,canvas.width,canvas.height);
   const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,'image/jpeg',0.82));
   if(blob && blob.size<=maxSize)return new File([blob],'camera-photo.jpg',{type:'image/jpeg'});
   scale*=0.75;
  }
  throw new Error('Photo is too large');
 } finally {URL.revokeObjectURL(url)}
}

export default function PhotoInputs({onBusyChange}:{onBusyChange:(busy:boolean)=>void}) {
 const gallery=useRef<HTMLInputElement>(null),camera=useRef<HTMLInputElement>(null),sequence=useRef(0);
 const [preview,setPreview]=useState(''),[message,setMessage]=useState('');
 useEffect(()=>()=>{if(preview)URL.revokeObjectURL(preview)},[preview]);
 const show=(file:File|null)=>setPreview(file?URL.createObjectURL(file):'');
 return <div className="wide">
  <label>Choose an image (JPEG, PNG or WebP, max 2 MB)<input ref={gallery} name="image_file" type="file" accept="image/jpeg,image/png,image/webp" onChange={event=>{
   ++sequence.current;onBusyChange(false);if(camera.current)camera.current.value='';const file=event.currentTarget.files?.[0]||null;if(file && (file.size>maxSize||!['image/jpeg','image/png','image/webp'].includes(file.type))){event.currentTarget.value='';show(null);setMessage('Please choose a JPEG, PNG or WebP image under 2 MB.');return}show(file);setMessage(file?'Selected image: '+file.name:'');
  }}/></label>
  <label>Or take a photo with your camera<input ref={camera} name="camera_file" type="file" accept="image/*" capture="environment" onChange={async event=>{
   const input=event.currentTarget,file=input.files?.[0],current=++sequence.current;
   if(gallery.current)gallery.current.value='';show(null);setMessage('');if(!file){onBusyChange(false);return}
   onBusyChange(true);setMessage('Preparing camera photo…');
   try {
    const photo=await prepareCameraPhoto(file);if(current!==sequence.current)return;
    if(photo!==file){const transfer=new DataTransfer();transfer.items.add(photo);input.files=transfer.files}
    show(photo);setMessage('Camera photo ready: '+photo.name);
   } catch {
    if(current!==sequence.current)return;input.value='';setMessage('Could not prepare this photo. Please choose a JPEG, PNG or WebP image under 2 MB instead.');
   } finally {if(current===sequence.current)onBusyChange(false)}
  }}/></label>
  <p className="photo-help" aria-live="polite">{message||'On a supported phone, “take a photo” opens the camera. Other devices may show a file picker. Large camera photos are resized for upload.'}</p>
  {preview&&<img className="photo-preview" src={preview} alt="Selected product photo preview"/>}
 </div>;
}
