/* Optional AI loader. Only clicks trigger a model download. */
(function(){
 'use strict';
 const endpoint=window.AR_HOSTED_ANALYST?.endpoint||'';
 function nodes(){return {setup:document.getElementById('ag-local-setup'),button:document.getElementById('analyst-load-local'),
 note:document.getElementById('analyst-local-note'),progress:document.getElementById('analyst-local-progress'),
 bar:document.getElementById('analyst-local-bar'),status:document.getElementById('analyst-load-status')};}
 function setup(){
  const v=nodes();
  if(!v.setup)return;
  if(endpoint){v.setup.hidden=true;return;}
  if(window.AR_FREE_AI?.active?.()){
   v.button.textContent='On-device AI ready ✓';v.button.disabled=true;
   v.note.textContent='Generative replies now run locally. No API key or subscription.';
  }
 }
 async function load(){
  const x=nodes();
  if(!x.button||x.button.disabled)return;
  if(!window.AR_FREE_AI){x.note.textContent='The optional model loader is unavailable. Case Coach remains ready.';return;}
  x.button.disabled=true;x.button.textContent='Checking device…';
  x.progress.hidden=false;
  const update=(message,percent)=>{
   if(!x.button.isConnected)return;
   x.button.textContent='Loading AI · '+Math.max(0,Math.min(100,Math.floor(percent||0)))+'%';
   if(x.bar)x.bar.style.width=Math.max(0,Math.min(100,percent||0))+'%';
   if(x.status)x.status.textContent=String(message||'Preparing model…').slice(0,160);
  };
  try{
   const can=await window.AR_FREE_AI.capable();
   if(!can)throw Error('WebGPU shader support is unavailable on this browser.');
   await window.AR_FREE_AI.load(update);
   if(!x.button.isConnected)return;
   x.button.textContent='On-device AI ready ✓';
   x.note.textContent='Ask a question above. Text generation is now local to this device.';
   if(x.status)x.status.textContent='On-device generative AI ready · No API charge';
   x.progress.hidden=true;
  }catch(e){
   if(!x.button.isConnected)return;
   x.button.disabled=false;
   x.button.textContent='Retry free on-device AI';
   x.note.textContent='This model could not load here. The free local Case Coach continues to work.';
   if(x.status)x.status.textContent='On-device model unavailable; Case Coach remains ready';
   x.progress.hidden=true;
  }
 }
 document.addEventListener('click',e=>{if(e.target.closest?.('#analyst-load-local'))load();});
 document.addEventListener('DOMContentLoaded',()=>{
  setup();
  const root=document.getElementById('analyst-root');
  if(root)new MutationObserver(setup).observe(root,{childList:true,subtree:false});
 });
})();
