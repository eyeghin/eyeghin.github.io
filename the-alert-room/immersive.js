
/* THE ALERT ROOM — DOCUMENTARY SCENE
   Small, self-contained presentation layer. Never alters data, storage, investigation
   outcomes, scoring or form semantics. Motion honors reduced-motion preferences.
*/
(()=>{
'use strict';
const reduce=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??true;
const src=window.AR_CASES||[];
let sceneNode=null, raf=0, mapMotion=null;
const fmt=n=>'$'+Number(n||0).toLocaleString('en-US',{maximumFractionDigits:0});
const esc=x=>String(x||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route=()=>decodeURIComponent((location.hash||'#home').slice(1)).split('/')[0]||'home';
function visual(){
 const c=src.find(r=>r.id==='AR-3002')||src[0];
 const tx=c?.transactions||[];
 const count=tx.length;
 const names=[...new Set(tx.map(t=>t.counterparty))];
 const credit=tx.filter(t=>t.direction==='Credit').reduce((v,t)=>v+Number(t.amount||0),0);
 const debit=tx.filter(t=>t.direction==='Debit').reduce((v,t)=>v+Number(t.amount||0),0);
 const coords=[
  [82,93],[228,59],[417,81],[562,120],[599,228],
  [553,385],[428,445],[247,430],[86,365],[39,238],
  [196,173],[498,306],[360,38],[337,461]
 ];
 const center=[340,244];
 const curve=(n,i)=>{
  const dx=n[0]-center[0],dy=n[1]-center[1],mx=(n[0]+center[0])/2,my=(n[1]+center[1])/2;
  return 'M'+center.join(' ')+' Q'+Math.round(mx-dy*.18)+' '+Math.round(my+dx*.18)+' '+n.join(' ');
 };
 const activePaths=coords.map((p,i)=>'<path class="line '+(i%3===0?'secondary':'')+'" d="'+curve(p,i)+'"/>'+(i%4===0?'<path class="flow" d="'+curve(p,i)+'"/>':'')).join('');
 const outer=coords.map((p,i)=>'<g class="iv-member" data-subject="'+esc(names[i%Math.max(names.length,1)]||'Counterparty')+'"><circle class="halo" cx="'+p[0]+'" cy="'+p[1]+'" r="'+(i%3===0?22:14)+'" style="animation-delay:-'+(i*.43)+'s"/><circle class="dot '+(i%4?'secondary':'')+'" cx="'+p[0]+'" cy="'+p[1]+'" r="'+(i%3===0?7:5)+'"/></g>').join('');
 return '<div class="investigation-visual" aria-label="Animated investigative funds-flow visualization of fictional account activity">'
  +'<div class="iv-corner"><small>CASE SAMPLE</small><b>'+esc(c?.id||'AR-3002')+'</b></div>'
  +'<div class="iv-shell"><div class="iv-top"><span>FINANCIAL ACTIVITY / RELATIONSHIP MAP</span><span class="iv-live"><i></i> TRAINING DATA</span></div>'
  +'<div class="iv-map"><svg viewBox="0 0 680 500" role="img" aria-label="A central training account linked to payment counterparties, each connection representing observed activity" preserveAspectRatio="xMidYMid meet">'
  +'<defs><radialGradient id="node-grad"><stop offset="0%" stop-color="#E5F3D8"/><stop offset="100%" stop-color="#94B798"/></radialGradient><filter id="glow"><feGaussianBlur stdDeviation="9"/></filter></defs>'
  +'<circle cx="340" cy="244" r="185" fill="none" stroke="#627D68" stroke-width="1" opacity=".24"/><circle cx="340" cy="244" r="137" fill="none" stroke="#627D68" stroke-width="1" opacity=".24"/>'
  +'<circle cx="340" cy="244" r="92" fill="none" stroke="#627D68" stroke-width="1" opacity=".18"/>'
  +activePaths
  +outer
  +'<circle cx="340" cy="244" r="57" fill="#A6CAAA" opacity=".14" filter="url(#glow)"/><circle cx="340" cy="244" r="38" fill="#243F32" stroke="#C8DFCA" stroke-width="1.5"/><circle cx="340" cy="244" r="10" fill="url(#node-grad)"/>'
  +'<text x="340" y="306" text-anchor="middle" class="primary">MONITORED ACCOUNT</text><text x="340" y="326" text-anchor="middle">'+esc(c?.reference||'TRAINING SUBJECT')+'</text>'
  +'</svg><div class="iv-canvas-hover"></div></div>'
  +'<div class="iv-bottom"><div class="iv-stat"><small>ENTRIES</small><b>'+count+'</b></div><div class="iv-stat"><small>INBOUND</small><b>'+fmt(credit)+'</b></div><div class="iv-stat"><small>OUTBOUND</small><b>'+fmt(debit)+'</b></div></div></div>'
  +'<div class="iv-note"><small>REVIEW STATUS</small><strong>Context required ↗</strong></div></div>';
}
function refresh(){
 const r=route();
 document.body.classList.remove('route-home','route-story','route-product');
 document.body.classList.add(r==='home'?'route-home':r==='story'?'route-story':'route-product');
 document.documentElement.dataset.page=r;
 const h=document.querySelector('.p-hero h1');
 if(r==='home'&&h){
  h.innerHTML='An alert is<br>only the<br><strong>beginning.</strong>';
  const p=document.querySelector('.p-hero-copy');
  if(p)p.textContent='Review the customer. Follow the transactions. Test the explanations. Write your own decision—and see what holds up under QA.';
  const kicker=document.querySelector('.hero-kicker');
  if(kicker)kicker.innerHTML='<i aria-hidden="true"></i> INDEPENDENT FINANCIAL CRIME PRACTICE';
  const note=document.querySelector('.hero-fine');
  if(note)note.textContent='40 FICTIONAL ALERTS  /  960 TRAINING TRANSACTIONS  /  ZERO PAYWALLS';
  const visualParent=document.querySelector('.visual-wrap');
  if(visualParent&&!visualParent.querySelector('.investigation-visual')){
   visualParent.innerHTML=visual();
   sceneNode=visualParent.querySelector('.investigation-visual');
   if(sceneNode&&!reduce()&&window.matchMedia('(hover: hover)').matches)enableDepth(sceneNode);
  }
 }
 const body=document.body;
 if(r==='story'){
  // Let the long-form letter be the cinematic editorial feature, not a dashboard.
  const hero=body.querySelector('.founder-hero h1');
  if(hero)hero.innerHTML='Training should<br>be about <em style="font-family:Newsreader,Georgia,serif;font-weight:400;letter-spacing:-.065em">doing.</em>';
 }
}
function enableDepth(el){
 if(mapMotion===el)return;mapMotion=el;
 let ox=0,oy=0,x=0,y=0,mx=50,my=50;
 const move=e=>{
  const b=el.getBoundingClientRect();
  x=Math.max(-1,Math.min(1,(e.clientX-b.left)/b.width*2-1));
  y=Math.max(-1,Math.min(1,(e.clientY-b.top)/b.height*2-1));
  mx=((e.clientX-b.left)/b.width*100).toFixed(1);
  my=((e.clientY-b.top)/b.height*100).toFixed(1);
  el.style.setProperty('--mouse-x',mx+'%');
  el.style.setProperty('--mouse-y',my+'%');
 };
 const leave=()=>{x=0;y=0};
 el.addEventListener('pointermove',move,{passive:true});
 el.addEventListener('pointerleave',leave);
 const tick=()=>{
  if(!el.isConnected||reduce()||document.hidden){el.style.transform='';mapMotion=null;raf=0;return}
  ox+=(x-ox)*.08;oy+=(y-oy)*.08;
  el.style.transform='perspective(1250px) rotateY('+(ox*2.7).toFixed(2)+'deg) rotateX('+(-oy*1.5).toFixed(2)+'deg)';
  raf=requestAnimationFrame(tick);
 };
 if(raf)cancelAnimationFrame(raf);
 raf=requestAnimationFrame(tick);
}
document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(refresh));
window.addEventListener('hashchange',()=>requestAnimationFrame(refresh));
window.addEventListener('pageshow',()=>requestAnimationFrame(refresh));
})();
