/* THE ALERT ROOM / 6-second cinematic introduction.
   Original native canvas/Web animation: free, self-hosted, no player. */
(function(){
'use strict';
let cleanCurrent=null;
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
function mount(){
 const stage=document.getElementById('ar-motion-stage');
 if(!stage||stage.dataset.ar3Mounted)return;
 stage.dataset.ar3Mounted='true';
 if(cleanCurrent)cleanCurrent();
 const intro=stage.querySelector('.ar3-intro');
 if(!intro)return;
 const canvas=document.createElement('canvas');
 canvas.setAttribute('aria-hidden','true');
 Object.assign(canvas.style,{position:'absolute',inset:'0',zIndex:'2',
   width:'100%',height:'100%',pointerEvents:'none',opacity:'.9'});
 intro.insertBefore(canvas,intro.querySelector('.ar3-film-title'));
 const ctx=canvas.getContext('2d',{alpha:true});
 let W=1,H=1,dpr=1,raf=0,endTimer=0,dead=false,start=performance.now();
 const lines=[
  [.03,.57,.28,.25,.65,.2],
  [.08,.83,.43,.46,.75,.75],
  [.17,.12,.63,.39,.88,.23],
  [.32,.96,.58,.65,.95,.88],
  [-.1,.31,.41,.31,1.05,.62],
  [.01,.74,.55,.14,.99,.13],
  [.1,.19,.46,.92,.96,.64],
  [-.13,.92,.34,.57,.99,.45]
 ];
 const points=[
  [.03,.55],[.15,.75],[.28,.27],[.35,.54],[.48,.32],
  [.56,.70],[.71,.38],[.84,.55],[.95,.27],[.9,.82]
 ];
 function resize(){
   const r=stage.getBoundingClientRect();
   W=Math.max(1,r.width);H=Math.max(1,r.height);
   dpr=Math.min(window.devicePixelRatio||1,1.8);
   canvas.width=Math.ceil(W*dpr);canvas.height=Math.ceil(H*dpr);
   ctx.setTransform(dpr,0,0,dpr,0,0);
 }
 function cubic(a,b,c,d,t){
  const u=1-t;return {x:u*u*u*a.x+3*u*u*t*b.x+3*u*t*t*c.x+t*t*t*d.x,
   y:u*u*u*a.y+3*u*u*t*b.y+3*u*t*t*c.y+t*t*t*d.y};
 }
 const clamp=n=>Math.max(0,Math.min(1,n));
 function frame(now){
  if(dead||!stage.isConnected){dispose();return;}
  const t=(now-start)/1000;
  ctx.clearRect(0,0,W,H);
  if(t<6.6){
   const emerge=clamp((t-.45)/1.3);
   lines.forEach((line,i)=>{
    const a={x:W*line[0],y:H*line[1]},d={x:W*line[4],y:H*line[5]},
      b={x:W*line[2],y:H*(line[1]-.15)},c={x:W*line[2],y:H*line[3]};
    const lit=i===4&&t>3.2&&t<5.3;
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.bezierCurveTo(b.x,b.y,c.x,c.y,d.x,d.y);
    ctx.setLineDash([2,11]);ctx.lineDashOffset=-(t*18+i*17);
    ctx.lineWidth=lit?1.9:1.1;ctx.strokeStyle=lit?'rgba(255,78,110,.85)':'rgba(146,165,255,'+(.21*emerge)+')';
    ctx.stroke();ctx.setLineDash([]);
    const travel=clamp(t*.15+i*.13)%1;
    const p=cubic(a,b,c,d,travel);
    const rad=lit?5:2;
    ctx.beginPath();ctx.arc(p.x,p.y,rad,0,Math.PI*2);
    ctx.shadowColor=lit?'#FF536A':'#B2C2FF';ctx.shadowBlur=lit?23:14;
    ctx.fillStyle=lit?'rgba(255,90,110,.96)':'rgba(231,232,255,'+emerge+')';
    ctx.fill();ctx.shadowBlur=0;
   });
   points.forEach((n,i)=>{
    const x=n[0]*W,y=n[1]*H;
    const radius=3+Math.sin(t*2.3+i)*1.4;
    ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);
    ctx.fillStyle='rgba(156,168,255,'+(.21*emerge)+')';ctx.fill();
   });
  }
  if(t<6.5)raf=requestAnimationFrame(frame);
 }
 function dispose(){
  if(dead)return;dead=true;cancelAnimationFrame(raf);
  if(endTimer)clearTimeout(endTimer);ro.disconnect();
  document.body.classList.remove('ar3-playing');
 }
 cleanCurrent=dispose;
 const ro=new ResizeObserver(resize);
 ro.observe(stage);resize();
 if(reduce.matches){
  intro.hidden=true;document.body.classList.remove('ar3-playing');
  stage.dataset.ar3Ready='true';return;
 }
 document.body.classList.add('ar3-playing');
 raf=requestAnimationFrame(frame);
 endTimer=setTimeout(()=>{
  if(dead)return;
  document.body.classList.remove('ar3-playing');
  stage.dataset.ar3Ready='true';
  cancelAnimationFrame(raf);raf=0;
  ro.disconnect();
 },6500);
}
function boot(){
 mount();
 const root=document.getElementById('view');
 if(root)new MutationObserver(()=>{if(document.getElementById('ar-motion-stage'))mount();
  else if(cleanCurrent){cleanCurrent();cleanCurrent=null;}})
  .observe(root,{childList:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
})();