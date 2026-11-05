/* The Alert Room / free, self-hosted cinematic shader.
No subscription, paid SDK, API, external request or watermark. */
(function(){
'use strict';
const vs=`attribute vec2 a_pos;
void main(){gl_Position=vec4(a_pos,0.,1.);}`;
const fs=`precision highp float;
uniform vec2 u_res;
uniform vec2 u_mouse;
uniform float u_time;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
 return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),
 mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);
 for(int i=0;i<4;i++){v+=a*noise(p);p=m*p;a*=.5;}return v;}
void main(){
 vec2 p=(gl_FragCoord.xy-u_res*.5)/u_res.y;
 float t=u_time*.22;
 float n=fbm(p*2.+vec2(t*.34,-t*.2));
 vec3 col=mix(vec3(.89,.94,1.),vec3(.62,.76,.97),clamp(.48+p.y*.56,0.,1.));
 col=mix(col,vec3(.95,.96,1.),smoothstep(-.4,.72,p.x)*.33);
 col+=vec3(.043,.051,.07)*(n-.4);
 col+=vec3(.028,.038,.07)*sin(p.x*5.+sin(p.y*3.+t*.5)*1.4-t*.4);
 vec2 c=vec2(.10,.03)+vec2(sin(t*.32)*.02,cos(t*.27)*.02)+(u_mouse-.5)*.035;
 vec2 q=p-c;
 float theta=atan(q.y,q.x);
 float wobble=.014*sin(theta*5.+t*1.5)+.01*sin(theta*9.-t*.9);
 float organic=(noise(vec2(theta*2.1,t*.6))-.5)*.039;
 float radius=.435+wobble+organic;
 float r=length(q),s=r/max(radius,.001);
 float mask=1.-smoothstep(radius-.008,radius+.013,r);
 float z=sqrt(max(.001,1.-s*s));
 vec3 N=normalize(vec3(q/max(radius,.001),z));
 float ribbon=sin(7.0*N.y+3.5*N.x+sin(N.x*7.+t)*1.1-t*1.4);
 float swirls=sin(12.*N.x+6.5*N.y+sin(N.y*8.-t)*2.+t*.7);
 float flow=clamp(.5+.21*ribbon+.18*swirls+.2*(fbm(q*5.5+vec2(t*.5,-t*.3))-.5),0.,1.);
 vec3 L=normalize(vec3(-.36,.68,.7));
 float diff=max(dot(N,L),0.);
 float fres=pow(1.-max(N.z,0.),2.2);
 vec3 glass=mix(vec3(.55,.73,.98),vec3(.19,.34,.72),clamp(.16+.6*(1.-diff)+.28*flow,0.,1.));
 glass=mix(glass,vec3(.94,.97,1.),clamp(.5*diff+.17*swirls,0.,.83));
 glass=mix(glass,vec3(.51,.51,.87),(.5+.5*ribbon)*.17);
 float spec=pow(max(dot(N,normalize(L+vec3(.12,.02,1.))),0.),63.);
 glass+=vec3(.64,.72,.87)*spec*.8;
 glass=mix(glass,vec3(.94,.97,1.),fres*.69);
 float intro=smoothstep(.5,2.3,u_time);
 col=mix(col,glass,mask*.92*intro);
 float halo=exp(-pow((r-radius)/.065,2.));
 col+=vec3(.048,.065,.12)*halo*intro;
 gl_FragColor=vec4(clamp(col,0.,1.),1.);
}`;
function mount(){
 const stage=document.getElementById('ar-motion-stage');
 if(!stage||stage.dataset.shaderMounted==='true')return;
 const canvas=stage.querySelector('#ar-free-shader');if(!canvas)return;
 stage.dataset.shaderMounted='true';
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){
  stage.dataset.shaderStatus='reduced-motion';return;
 }
 let gl;try{gl=canvas.getContext('webgl',{alpha:false,depth:false,
  antialias:false,powerPreference:'low-power'});}catch(e){}
 if(!gl){stage.dataset.shaderStatus='fallback';return;}
 const shader=(type,src)=>{
  let s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);
  if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){
    console.warn('Optional WebGL shader failed; continuing with CSS fallback');
    gl.deleteShader(s);return null;
  }return s;
 };
 const v=shader(gl.VERTEX_SHADER,vs),f=shader(gl.FRAGMENT_SHADER,fs);
 if(!v||!f){stage.dataset.shaderStatus='fallback';return;}
 let program=gl.createProgram();gl.attachShader(program,v);gl.attachShader(program,f);
 gl.linkProgram(program);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
  stage.dataset.shaderStatus='fallback';return;
 }
 gl.useProgram(program);
 let buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
 gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
 const loc=gl.getAttribLocation(program,'a_pos');
 gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
 const ures=gl.getUniformLocation(program,'u_res');
 const utime=gl.getUniformLocation(program,'u_time');
 const umouse=gl.getUniformLocation(program,'u_mouse');
 let size=[1,1],target=[.5,.5],pointer=[.5,.5],dead=false,
  raf=0,onscreen=true,last=0,start=performance.now(),elapsed=0;
 const dpr=Math.min(devicePixelRatio||1,innerWidth<768?1:1.4);
 function resize(){
  const rect=stage.getBoundingClientRect();
  size=[Math.max(1,Math.floor(rect.width*dpr)),Math.max(1,Math.floor(rect.height*dpr))];
  if(canvas.width!==size[0]||canvas.height!==size[1]){
   canvas.width=size[0];canvas.height=size[1];gl.viewport(0,0,size[0],size[1]);
  }
 }
 function frame(now){
  if(dead||!stage.isConnected){clean();return;}
  if(!onscreen||document.hidden){raf=0;return;}
  raf=requestAnimationFrame(frame);
  if(now-last<33)return;last=now;
  elapsed=Math.max(0,(now-start)/1000);
  pointer[0]+=(target[0]-pointer[0])*.055;
  pointer[1]+=(target[1]-pointer[1])*.055;
  gl.uniform2f(ures,size[0],size[1]);
  gl.uniform1f(utime,elapsed);
  gl.uniform2f(umouse,pointer[0],pointer[1]);
  gl.drawArrays(gl.TRIANGLES,0,6);
 }
 function pointerMove(e){
  const r=stage.getBoundingClientRect();
  target=[Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),
          Math.max(0,Math.min(1,1-(e.clientY-r.top)/r.height))];
 }
 function resume(){
  if(!dead&&!document.hidden&&onscreen&&!raf){
   start=performance.now()-elapsed*1000;raf=requestAnimationFrame(frame);
  }
 }
 const io=new IntersectionObserver(entries=>{
  onscreen=entries.some(x=>x.isIntersecting);resume();
 },{rootMargin:'100px'});io.observe(stage);
 const ro=new ResizeObserver(resize);ro.observe(stage);
 stage.addEventListener('pointermove',pointerMove,{passive:true});
 document.addEventListener('visibilitychange',resume);
 function clean(){
  if(dead)return;dead=true;cancelAnimationFrame(raf);io.disconnect();ro.disconnect();
  stage.removeEventListener('pointermove',pointerMove);
  document.removeEventListener('visibilitychange',resume);
  gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(v);gl.deleteShader(f);
 }
 if(window.ARFreeShaderCleanup)window.ARFreeShaderCleanup();
 window.ARFreeShaderCleanup=clean;
 resize();stage.dataset.shaderStatus='ready';
 raf=requestAnimationFrame(frame);
}
function boot(){
 mount();
 let view=document.getElementById('view');
 if(view)new MutationObserver(()=>{if(document.getElementById('ar-motion-stage'))mount();})
  .observe(view,{childList:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
})();