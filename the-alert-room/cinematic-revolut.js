/* The Alert Room: original cinematic motion scene. Native Canvas, zero video elements.
   The transfer network is fictional; no real financial data or account API. */
(function(){
  'use strict';
  const clamp=(v,lo=0,hi=1)=>Math.max(lo,Math.min(hi,v));
  const mix=(a,b,t)=>a+(b-a)*t;
  const smooth=t=>{t=clamp(t);return t*t*(3-2*t);};
  const palette={blue:[76,104,191],sky:[148,179,234],white:[255,255,255],red:[186,58,74]};
  function rgba(c,a){return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')';}
  const points=[
    [.055,.38],[.15,.28],[.22,.75],[.33,.18],[.38,.6],[.53,.35],
    [.6,.71],[.71,.18],[.8,.48],[.91,.30],[.95,.7],[.12,.64],
    [.45,.85],[.73,.76],[.3,.42]
  ];
  const routes=[
    [0,5,-.13],[1,4,.09],[2,6,-.11],[3,5,.14],[4,8,-.15],
    [5,9,.13],[6,10,.16],[7,8,-.08],[11,4,.12],[12,8,-.08],
    [8,13,.16],[2,12,.09],[14,5,-.13],[1,14,.08]
  ];
  const satellites=[
    [.11,.17,13,.7],[.84,.16,18,1.2],[.91,.62,12,.8],
    [.11,.83,20,1.5],[.74,.83,10,.95]
  ];
  let running=null;
  function mount(){
    const stage=document.getElementById('ar-motion-stage');
    if(!stage || stage.dataset.arMounted==='true')return;
    const canvas=stage.querySelector('#ar-network');
    if(!canvas)return;
    const ctx=canvas.getContext('2d',{alpha:true});
    if(!ctx)return;
    stage.dataset.arMounted='true';
    let width=1,height=1,dpr=1,raf=0,t0=performance.now(),on=true,last=0,disposed=false;
    const reduce=matchMedia('(prefers-reduced-motion: reduce)');
    const dot=(x,y,r,color)=>{ctx.beginPath();ctx.fillStyle=color;ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();};
    const pos=n=>({x:n[0]*width,y:n[1]*height});
    function pathCoords(a,b,bend){
      const p=pos(points[a]),q=pos(points[b]);
      const dx=q.x-p.x,dy=q.y-p.y;
      const c1={x:p.x+dx*.34-dy*bend,y:p.y+dy*.34+dx*bend};
      const c2={x:p.x+dx*.69-dy*bend,y:p.y+dy*.69+dx*bend};
      return {p,q,c1,c2};
    }
    function cubic(p,c1,c2,q,t){
      const u=1-t;return {x:u*u*u*p.x+3*u*u*t*c1.x+3*u*t*t*c2.x+t*t*t*q.x,
       y:u*u*u*p.y+3*u*u*t*c1.y+3*u*t*t*c2.y+t*t*t*q.y};
    }
    function drawRoute(p,c1,c2,q){
      ctx.beginPath();ctx.moveTo(p.x,p.y);
      ctx.bezierCurveTo(c1.x,c1.y,c2.x,c2.y,q.x,q.y);
    }
    function resize(){
      if(!stage.isConnected){cleanup();return;}
      const b=stage.getBoundingClientRect();
      width=Math.max(1,b.width);height=Math.max(1,b.height);
      dpr=Math.min(2,devicePixelRatio||1);
      canvas.width=Math.ceil(width*dpr);
      canvas.height=Math.ceil(height*dpr);
      canvas.style.width=width+'px';canvas.style.height=height+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    function draw(now){
      if(disposed || !stage.isConnected){cleanup();return;}
      const sec=reduce.matches?15:Math.max(0,(now-t0)/1000);
      const appear=smooth((sec-1.35)/3.1);
      const slow=sec*.35;
      ctx.clearRect(0,0,width,height);
      const mobile=width<650;
      ctx.save();
      /* Big orbital ribbons. Premium diffuse lines rather than a boxed illustration. */
      const cx=width*.52,cy=height*.51;
      for(let i=0;i<4;i++){
        const radius=Math.min(width*.47,height*.56)*(1-i*.18);
        ctx.beginPath();
        ctx.ellipse(cx,cy,radius,radius*(.53+i*.06),-.32+i*.28,0,Math.PI*2);
        ctx.strokeStyle=rgba(i%2?palette.white:palette.sky,appear*(.08+i*.015));
        ctx.lineWidth=i===0?1.8:1.05;
        ctx.stroke();
      }
      /* Distributed ledger points and moving route strokes. */
      routes.forEach(([a,b,bend],i)=>{
        const c=pathCoords(a,b,bend);
        const reveal=smooth((sec-2.3-i*.14)/2.5);
        if(!reveal)return;
        const isAlert=i===4 && sec>=4.7 && sec<9;
        const alpha=reveal*(mobile?.27:.43);
        drawRoute(c.p,c.c1,c.c2,c.q);
        ctx.setLineDash([3,8]);
        ctx.lineDashOffset=-(sec*13+i*8);
        ctx.strokeStyle=rgba(palette.white,alpha*.8);
        ctx.lineWidth=1.45;ctx.stroke();ctx.setLineDash([]);
        if(i%2===0){
          drawRoute(c.p,c.c1,c.c2,c.q);
          ctx.strokeStyle=rgba(palette.blue,alpha*.55);
          ctx.lineWidth=1.1;ctx.stroke();
        }
        if(sec>3.6&&!reduce.matches){
          const t=(sec*.09+i*.21)%1;
          const p=cubic(c.p,c.c1,c.c2,c.q,t);
          const radius=isAlert?4:2.5;
          ctx.shadowColor=rgba(isAlert?palette.red:palette.white,.55);
          ctx.shadowBlur=isAlert?17:9;
          dot(p.x,p.y,radius,rgba(isAlert?palette.red:palette.white,alpha*(isAlert?2:1.9)));
          ctx.shadowBlur=0;
        }
      });
      /* Soft nodes: small points only, never outlined cards or dashboard mockups. */
      points.forEach((n,i)=>{
        const p=pos(n),inTime=smooth((sec-2.0-i*.12)/1.5);
        if(!inTime)return;
        const alpha=inTime*(mobile?.3:.58);
        dot(p.x,p.y,2.15,rgba(palette.white,alpha));
        if(i%3===0){
          ctx.beginPath();ctx.arc(p.x,p.y,6.8+Math.sin(slow+i)*1.5,0,Math.PI*2);
          ctx.strokeStyle=rgba(palette.blue,alpha*.25);
          ctx.lineWidth=.95;ctx.stroke();
        }
      });
      /* Semi-transparent glints give the scene a moving photographic feel. */
      satellites.forEach(([x,y,r,s],i)=>{
        const nx=(x+.013*Math.sin(sec*s*.22+i))*width;
        const ny=(y+.022*Math.cos(sec*s*.2+i))*height;
        const grad=ctx.createRadialGradient(nx-r*.23,ny-r*.23,0,nx,ny,r);
        grad.addColorStop(0,rgba(palette.white,.63));
        grad.addColorStop(.4,rgba(palette.white,.17));
        grad.addColorStop(1,rgba(palette.white,0));
        dot(nx,ny,r,grad);
      });
      /* Single alert event. Red is a semantic exception, never a theme color. */
      if(sec>=4.65 && sec<9.25){
        const c=pathCoords(4,8,-.15);
        const pulse=smooth((sec-4.65)/.65)*(1-smooth((sec-8.45)/.8));
        drawRoute(c.p,c.c1,c.c2,c.q);
        ctx.globalAlpha=pulse;
        ctx.strokeStyle=rgba(palette.red,.76);
        ctx.lineWidth=2.5;
        ctx.shadowColor=rgba(palette.red,.5);ctx.shadowBlur=15;
        ctx.stroke();ctx.shadowBlur=0;ctx.globalAlpha=1;
        const mark=cubic(c.p,c.c1,c.c2,c.q,clamp((sec-5.1)/2.1));
        dot(mark.x,mark.y,4,rgba(palette.red,pulse));
      }
      /* The very last frame stays alive with low-energy ambient motion. */
      ctx.restore();
      last=sec;
      if(!reduce.matches && on)raf=requestAnimationFrame(draw);
    }
    function update(){
      cancelAnimationFrame(raf);
      if(disposed)return;
      if(reduce.matches){draw(t0+15000);return;}
      if(on){t0=performance.now()-Math.min(last,15)*1000;raf=requestAnimationFrame(draw);}
    }
    const intersection=new IntersectionObserver(entries=>{
      if(disposed)return;
      on=entries.some(e=>e.isIntersecting);
      update();
    },{rootMargin:'180px'});
    intersection.observe(stage);
    const observer=new ResizeObserver(()=>{resize();if(reduce.matches)draw(t0+15000);});
    observer.observe(stage);
    const onMotion=()=>update();
    reduce.addEventListener('change',onMotion);
    function cleanup(){
      if(disposed)return;disposed=true;
      cancelAnimationFrame(raf);intersection.disconnect();observer.disconnect();
      reduce.removeEventListener('change',onMotion);
    }
    if(running && running!==cleanup)running();
    running=cleanup;
    resize();update();
  }
  window.ARLiveMotion={mount};
  function boot(){
    mount();
    const view=document.getElementById('view');
    if(view)new MutationObserver(()=>{if(document.getElementById('ar-motion-stage'))mount();})
      .observe(view,{childList:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();