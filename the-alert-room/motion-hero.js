/* The Alert Room / live illustrated transaction network. Native canvas, never video. */
(function(){
  'use strict';
  const duration=15000, ink='#7592AC', pale='#A9BDCE', risk='#B54C56';
  function mount(){
    const stage=document.getElementById('ar-motion-stage');
    if(!stage||stage.dataset.arMounted==='true')return;
    const canvas=stage.querySelector('#ar-network');
    if(!canvas)return;
    const ctx=canvas.getContext('2d',{alpha:true});
    if(!ctx)return;
    stage.dataset.arMounted='true';
    let W=0,H=0,dpr=1,start=performance.now(),frame=0,ended=false;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    const clamp=(x,min=0,max=1)=>Math.max(min,Math.min(max,x));
    const ease=x=>1-Math.pow(1-clamp(x),3);
    const nodes=[
      [.09,.32],[.16,.62],[.24,.18],[.30,.76],[.38,.37],
      [.51,.62],[.61,.22],[.71,.47],[.83,.31],[.88,.70],
      [.44,.82],[.20,.45],[.68,.79]
    ];
    const routes=[
      [0,4,0.10],[2,4,-.12],[1,5,.13],[4,7,-.16],
      [3,10,.15],[10,5,-.13],[6,7,.14],[7,8,-.12],
      [7,9,.10],[5,12,-.12],[11,4,.13],[12,9,.08],
      [2,6,.08],[0,11,-.12],[6,8,.10]
    ];
    function resize(){
      const r=stage.getBoundingClientRect();
      W=Math.max(1,r.width);H=Math.max(1,r.height);
      dpr=Math.min(2,window.devicePixelRatio||1);
      canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);
      canvas.style.width=W+'px';canvas.style.height=H+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    function pos(n){return {x:n[0]*W,y:n[1]*H};}
    function curve(a,b,bend,draw){
      const A=pos(nodes[a]),B=pos(nodes[b]),mx=(A.x+B.x)/2,my=(A.y+B.y)/2,
       ox=-(B.y-A.y)*bend,oy=(B.x-A.x)*bend,cx=mx+ox,cy=my+oy;
      draw(A,B,{x:cx,y:cy});
    }
    function qpt(A,B,C,t){
      const it=1-t;return {x:it*it*A.x+2*it*t*C.x+t*t*B.x,
                           y:it*it*A.y+2*it*t*C.y+t*t*B.y};}
    function draw(now){
      if(!stage.isConnected){cancelAnimationFrame(frame);return;}
      ctx.clearRect(0,0,W,H);
      let t=reduced.matches?duration:clamp(now-start,0,duration);
      const phase=clamp((t-3000)/2400);
      const active=ease(phase),settle=1-clamp((t-12300)/2800)*.46;
      const narrow=W<700,margin=narrow?.85:1;
      ctx.save();
      for(let j=0;j<routes.length;j++){
        const [a,b,bend]=routes[j];const drawProgress=clamp((t-3300-j*130)/2100);
        if(!drawProgress)continue;
        const red=j===7 && t>7300&&t<12400;
        curve(a,b,bend,(A,B,C)=>{
          ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.quadraticCurveTo(C.x,C.y,B.x,B.y);
          ctx.strokeStyle=red?'rgba(181,76,86,.8)':'rgba(118,145,170,.22)';
          ctx.lineWidth=red?2.4:1.15;ctx.globalAlpha=drawProgress*settle*margin;
          ctx.setLineDash([4,7]);ctx.lineDashOffset=-(t*.020+j*17);
          ctx.shadowColor=red?risk:ink;ctx.shadowBlur=red?24:4;
          ctx.stroke();ctx.setLineDash([]);ctx.shadowBlur=0;
          if(t>4100&&t<14000){
            const pr=clamp((t-4100-j*105)/9000);
            const p=qpt(A,B,C,(t*.00019+j*.23)%1);
            ctx.fillStyle=red?risk:pale;ctx.globalAlpha=pr*settle*(red?.96:.55);
            ctx.beginPath();ctx.arc(p.x,p.y,red?3.6:1.9,0,Math.PI*2);ctx.fill();
          }
        });
      }
      for(let j=0;j<nodes.length;j++){
        const p=pos(nodes[j]),appeared=clamp((t-2800-j*190)/1000);
        if(!appeared)continue;
        const isRed=j===8&&t>7500&&t<12000;
        ctx.globalAlpha=appeared*settle*(narrow?.44:.86);
        ctx.shadowBlur=isRed?24:18;ctx.shadowColor=isRed?risk:ink;
        ctx.fillStyle=isRed?risk:'#91ABC2';
        ctx.beginPath();ctx.arc(p.x,p.y,isRed?4.8:2.8,0,Math.PI*2);ctx.fill();
        ctx.shadowBlur=0;
        ctx.strokeStyle=isRed?'rgba(181,76,86,.5)':'rgba(118,145,170,.26)';
        ctx.lineWidth=1;
        ctx.beginPath();ctx.arc(p.x,p.y,8+Math.sin(t*.003+j)*2,0,Math.PI*2);ctx.stroke();
      }
      if(t>7450&&t<11400){
        const pulse=clamp((t-7450)/650)*(1-clamp((t-10600)/800));
        const A=pos(nodes[7]),B=pos(nodes[8]);
        ctx.globalAlpha=pulse*(.65+.35*Math.sin(t*.018)**2);
        ctx.strokeStyle=risk;ctx.lineWidth=2.2;ctx.shadowColor=risk;ctx.shadowBlur=29;
        ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.quadraticCurveTo((A.x+B.x)/2,(A.y+B.y)/2-56,B.x,B.y);
        ctx.stroke();
      }
      ctx.restore();
      if(!reduced.matches&&!ended&&t<duration)frame=requestAnimationFrame(draw);
      else ended=true;
    }
    resize();
    const observer=typeof ResizeObserver!=='undefined'?new ResizeObserver(()=>{
      if(!stage.isConnected){observer.disconnect();return;}resize();if(ended)draw(start+duration);
    }):null;
    if(observer)observer.observe(stage);
    const onReduce=()=>{if(!stage.isConnected){reduced.removeEventListener('change',onReduce);return;}
      cancelAnimationFrame(frame);ended=false;start=performance.now();
      frame=requestAnimationFrame(draw);
    };
    reduced.addEventListener('change',onReduce);
    frame=requestAnimationFrame(draw);
  }
  window.ARLiveMotion={mount};
  function focusAnchor(){
    const anchor=location.hash.split('/')[1];
    if(!['about','contact','contact-details'].includes(anchor))return;
    requestAnimationFrame(()=>{const target=document.getElementById(anchor);if(!target)return;
      target.scrollIntoView({behavior:'smooth',block:'start'});
      target.tabIndex=-1;target.focus({preventScroll:true});
    });
  }
  function boot(){
    mount();
    const view=document.getElementById('view');
    if(view)new MutationObserver(()=>{if(document.getElementById('ar-motion-stage'))mount();})
      .observe(view,{childList:true});
    window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#home/'))setTimeout(focusAnchor,120);});
    if(location.hash.startsWith('#home/'))setTimeout(focusAnchor,120);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();