
/* THE ALERT ROOM / CINEMA
 * Original playable visual storytelling for fictional AML training.
 * Existing educational investigation, quiz, AI, QA and local progress remain untouched.
 */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const safe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const usd=n=>'$'+Number(n||0).toLocaleString('en-US',{maximumFractionDigits:0});
const arrow='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const sections=[
{eyebrow:'01 / ALERT',label:'The trigger',title:'An alert is a question. Not a verdict.',body:'A monitoring rule identifies activity that deserves a closer look. It does not tell you what happened or whether it is suspicious.'},
{eyebrow:'02 / RESEARCH',label:'Follow the money',title:'Find the pattern. Check the person.',body:'Review the customer profile and the actual transactions, not just the triggering threshold. Look for a credible explanation and what remains unverified.'},
{eyebrow:'03 / JUDGMENT',label:'Make the call',title:'There is no shortcut to a defensible decision.',body:'Choose closure, further information, or escalation. Your explanation must reference the evidence and disclose uncertainty.'},
{eyebrow:'04 / QA',label:'Defend the work',title:'Good work stands up to a second look.',body:'Submit your own case narrative, receive transparent simulated QA feedback, then revise what is missing.'}
];
const data=()=>{const arr=window.AR_CASES||[];return arr.find(c=>c.id==='AR-3002')||arr[0]||{}};
let current=0,playing=true,progress=0,last=0,lastDraw=0,raf=0,canvas=null,ctx=null,w=0,h=0,dpr=1,observer=null,localHome=null,decision='';
const rm=()=>!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
function metric(){const c=data(),t=c.transactions||[];const cr=t.filter(x=>x.direction==='Credit').reduce((s,x)=>s+x.amount,0),db=t.filter(x=>x.direction==='Debit').reduce((s,x)=>s+x.amount,0);return {count:t.length,cr,db};}
function lightSVG(){return '<svg viewBox="0 0 160 70" fill="none" aria-hidden="true"><defs><linearGradient id="ngrad" x1="0" y1="0" x2="160" y2="0"><stop stop-color="#5c5dfe"/><stop offset="1" stop-color="#d9ddff"/></linearGradient></defs><path d="M1 55 C18 54 20 23 37 32 S69 58 82 33 S109 19 124 30 S141 9 159 11" stroke="url(#ngrad)" stroke-width="3" stroke-linecap="round"/><path d="M1 55 C18 54 20 23 37 32 S69 58 82 33 S109 19 124 30 S141 9 159 11" stroke="#b8afff" stroke-opacity=".15" stroke-width="16"/></svg>';}
function heroCard(){
const c=data(),m=metric(),trans=(c.transactions||[]).slice(-3);
return '<div class="nova-object" id="nova-object" aria-label="Illustrative training alert card">'
 +'<div class="nova-glass"><div class="nova-glass-top"><span>THE ALERT ROOM / SIGNAL 002</span><span class="nova-signal"><i></i> LIVE DEMO</span></div>'
 +'<div class="nova-glass-body"><span class="nova-glass-kicker">SIMULATED CASE '+safe(c.id||'AR-3002')+'</span><h3>Unusual activity.<br>Unanswered questions.</h3>'
 +'<div class="nova-glass-meter"><div><strong>'+m.count+'</strong><small> transaction events</small></div>'+lightSVG()+'</div>'
 +'<div class="nova-glass-rows">'+trans.map(t=>'<div class="nova-glass-row"><i>↗</i><div><b>'+safe(t.counterparty)+'</b><small>'+safe(t.date)+' · '+safe(t.method)+'</small></div><strong>'+(t.direction==='Debit'?'−':'+')+usd(t.amount)+'</strong></div>').join('')+'</div></div></div>'
 +'<div class="nova-float"><small>CASE REVIEW</small><b>Evidence first.</b><div class="nova-float-bottom"><i></i> Analyst training / Not a real account</div></div></div>';
}
function pathCard(num,title,desc,link,figure,art){
return '<a class="nova-path nova-rise" href="'+link+'"><div><span class="nova-path-number">'+num+' / THE EXPERIENCE</span><h3>'+title+'</h3><p>'+desc+'</p></div><div class="nova-path-art"><span class="nova-path-ring"></span><span class="nova-path-icon" aria-hidden="true">'+art+'</span></div><div class="nova-path-footer"><span>'+figure+'</span><span aria-hidden="true">↗</span></div></a>';
}
function home(){
return '<div class="nova-home">'
+'<section class="nova-hero" aria-labelledby="nova-hero-head"><div class="nova-radiance" aria-hidden="true"></div><div class="nova-lens" aria-hidden="true"></div><div class="nova-canvas-wrap"><canvas id="nova-universe" aria-hidden="true"></canvas></div><div class="nova-hero-grain" aria-hidden="true"></div>'
+'<div class="nova-wrap nova-hero-grid"><div class="nova-hero-copy"><div class="nova-eyebrow">THE NEXT GENERATION OF FINANCIAL CRIME LEARNING</div>'
+'<h1 class="nova-display" id="nova-hero-head"><span>FOLLOW</span><span>THE FUNDS.</span><span class="nova-gradient">FIND THE WHY.</span></h1>'
+'<p class="nova-hero-description">Step inside a fictional financial-crime investigation. Review real-looking activity, challenge your assumptions, write your own decision, and see how your work holds up.</p>'
+'<div class="nova-hero-ctas"><a class="nova-cta" href="#workspace">Enter the investigation room '+arrow+'</a><a class="nova-cta secondary" href="#nova-play" data-nova-scroll>Experience a case '+arrow+'</a></div>'
+'<div class="nova-hero-meta"><span>CREATED BY ERIK YEGHINYAN</span><i></i><span>FREE TO PRACTICE</span><i></i><span>ALL CASES FICTIONAL</span></div></div>'+heroCard()+'</div>'
+'<div class="nova-hero-bottom"><div class="nova-wrap"><span>01 / 05 &nbsp; THE ALERT ROOM</span><span class="nova-tiny-line"></span><a href="#nova-paths" data-nova-scroll>SCROLL TO DISCOVER &nbsp; <span class="nova-scroll-icon" aria-hidden="true"></span></a></div></div></section>'
+'<section class="nova-light nova-section" id="nova-paths"><div class="nova-wrap"><div class="nova-section-head nova-rise"><div class="nova-eyebrow">YOU DON’T LEARN JUDGMENT FROM A SLIDE DECK</div><h2>It feels different<br>when you do the work.</h2><p>A learning platform built around the decisions an analyst actually makes. Understand the concepts. See the full picture. Make the call.</p></div>'
+'<div class="nova-path-grid">'+pathCard('01','Learn the rules.','Six tracks and 18 lessons that teach the ideas behind the controls.','#learn','Explore the academy','18')+pathCard('02','Investigate the evidence.','A real workflow: account context, transaction ledgers, counterparties, and your own findings.','#workspace','Open 40 alerts','40')+pathCard('03','Get challenged by QA.','Submit a fictional case, review a transparent score, and revise your work.','#qa','Go to the QA desk','/100')+'</div></div></section>'
+'<section class="nova-play-section" id="nova-play"><div class="nova-wrap"><div class="nova-play-top nova-rise"><div><div class="nova-eyebrow">THE EXPERIENCE / INTERACTIVE CASE PREVIEW</div><h2>Watch a case.<br><em>Take control.</em></h2></div><p>Four stages of one investigation. Play the sequence or select a stage. Every step has a counterpart in the working simulator.</p></div>'
+'<div class="nova-player nova-rise"><aside class="nova-player-rail" aria-label="Case walkthrough controls"><div class="nova-player-label">CASE '+safe(data().id||'AR-3002')+' / STORY MODE</div><div class="nova-phases">'+sections.map((s,i)=>'<button class="nova-phase" type="button" role="tab" aria-controls="nova-stage" data-nova-step="'+i+'" aria-selected="'+(i===current?'true':'false')+'"><strong>0'+(i+1)+'</strong><b>'+s.label+'</b><i aria-hidden="true">↗</i></button>').join('')+'</div>'
+'<div class="nova-player-controls"><button type="button" class="nova-toggle" id="nova-toggle" aria-label="Pause animated case walkthrough">Ⅱ</button><div class="nova-progress"><i id="nova-progress"></i></div><span id="nova-counter">01 / 04</span></div></aside>'
+'<div class="nova-player-stage" id="nova-stage" role="tabpanel"><div class="nova-stage-header"><span id="nova-stage-label">01 / ALERT</span><b>SIMULATED TRAINING</b></div><div class="nova-stage-display" id="nova-stage-display"></div>'
+'<div class="nova-example-footer"><small>EDUCATIONAL PREVIEW · NO REAL BANK DATA</small><a href="#case/'+safe(data().id||'AR-3002')+'">Open the complete case ↗</a></div></div></div></div></section>'
+'<section class="nova-light nova-section"><div class="nova-wrap"><div class="nova-ai nova-rise"><div><div class="nova-eyebrow">MEET YOUR SECOND SET OF EYES</div><h2>Meet <span>Analyst.</span><br>Ask anything.</h2><p>A real generative AI study companion for discussing suspicious patterns, testing interpretations, strengthening case narratives, and understanding QA. You stay in control.</p><a href="#analyst" class="nova-cta">Ask Analyst AI '+arrow+'</a><p style="font-size:11px;margin-top:18px;color:#7a7997">Requires a compatible browser and an optional local AI model download.</p></div>'
+'<div class="nova-ai-demo" aria-label="Illustrative example of a case discussion, not a live generated response"><div class="nova-ai-demo-head"><i>A.</i><div>Analyst<small style="display:block;color:#aaa8d4;font-size:10px;margin-top:4px">ILLUSTRATIVE CONVERSATION</small></div></div>'
+'<div class="nova-chat-message user"><small>YOU</small>These incoming payments triggered an alert. Should I escalate?</div>'
+'<div class="nova-chat-message"><small>ANALYST / EXAMPLE</small>Not from the alert alone. What does the customer normally do? Compare the payment amounts and counterparties with the stated business purpose before deciding.</div>'
+'<div class="nova-chat-typing">Ask about a case, red flag, or your reasoning <span>↗</span></div></div></div></div></section>'
+'<section class="nova-founder"><div class="nova-wrap nova-founder-grid"><div class="nova-founder-left nova-rise"><div class="nova-eyebrow">WHY THIS EXISTS</div><span>From an analyst, for the next analyst.</span></div><div class="nova-rise"><blockquote>“I wanted a place to practice the <em>decisions</em>, not just memorize the definitions.”</blockquote><p>Specialized courses can be expensive. Hands-on systems are difficult to access until you are hired. I built this independent learning space to make realistic practice available to more people.</p><a href="#story" class="nova-cta secondary">Read the founder’s story '+arrow+'</a><p style="margin-top:23px;font-size:12px">ERIK YEGHINYAN / FOUNDER & CREATOR</p></div></div></section>'
+'<section class="nova-footer-cta"><div class="nova-wrap nova-rise"><div class="nova-eyebrow" style="justify-content:center">YOUR NEXT SHIFT STARTS HERE</div><h2>The first alert<br>is waiting for you.</h2><p>No course paywall. No actual customer records. Just meaningful practice and your next better decision.</p><a href="#workspace" class="nova-cta">Start investigating '+arrow+'</a></div></section>'
+'</div>';
}
function contents(i){
const c=data(),s=sections[i],tx=c.transactions||[];
let inner='';
if(i===0)inner='<div class="nova-example-panel"><div class="label">TRANSACTION MONITORING / NEW ALERT</div><div class="value">'+safe(c.title||'Account monitoring review')+'</div><div class="mini">Customer '+safe(c.reference||'002')+' · '+safe(c.sector||'Event organizer')+' · Rule triggered by observed payment activity</div><div style="display:flex;gap:9px;margin-top:20px"><span style="padding:7px 10px;background:#ffffff15;border-radius:30px;font-size:11px">P'+Number(c.priority||3)+' / PRIORITY</span><span style="padding:7px 10px;background:#ffffff15;border-radius:30px;font-size:11px">'+tx.length+' TX EVENTS</span></div></div>';
if(i===1){
 const txRows=tx.slice(-4);
 inner='<div class="nova-example-panel"><div class="label">LEDGER / SELECTED EVIDENCE</div><div class="value">Look at the actual transfers.</div>'+txRows.map(t=>'<div class="nova-transaction"><div><strong>'+safe(t.counterparty)+'</strong><small>'+safe(t.id)+' · '+safe(t.method)+' · '+safe(t.date)+'</small></div><span class="amount">'+(t.direction==='Debit'?'−':'+')+usd(t.amount)+'</span></div>').join('')+'</div>';
}
if(i===2)inner='<div class="nova-example-panel"><div class="label">CHOOSE A TRAINING DISPOSITION</div><div class="value">Would you close, inquire, or escalate?</div><div class="mini">Expected behavior: '+safe(c.expected||'Check customer baseline')+'.</div><div class="nova-decision-options">'+[['close','Close'],['rfi','Request information'],['escalate','Escalate']].map(x=>'<button type="button" data-nova-decision="'+x[0]+'" aria-pressed="'+(decision===x[0]?'true':'false')+'">'+x[1]+'</button>').join('')+'</div><div class="nova-decision-result" id="nova-decision-result" aria-live="polite">'+(decision?response(decision):'Choose one option to examine the reasoning. This is not a real filing.')+'</div></div>';
if(i===3)inner='<div class="nova-example-panel"><div class="label">AUTOMATED TRAINING QA / ILLUSTRATION</div><div class="nova-score-row"><strong>86<span style="color:#9c97c4">/100</span></strong><span>ILLUSTRATIVE SCORE ONLY<br>NOT A SUBMITTED CASE</span></div><div class="nova-score-track"><b></b></div><div class="mini">A real practice submission is scored for judgment, evidence, KYC context, chronology, and documentation quality. Revise based on the findings.</div></div>';
return '<h3>'+safe(s.title)+'</h3><p>'+safe(s.body)+'</p>'+inner;
}
function response(v){
const c=data();
if(v===c.outcome)return 'Aligned with the fictional reference outcome. The explanation still needs transaction evidence: '+safe(c.why||'check customer context');
if(v==='rfi')return 'A focused information request may be appropriate if crucial evidence is missing. State which fact requires verification.';
return 'Reconsider this against the customer’s expected activity and the fictional case reference. An alert by itself is not proof.';
}
function stage(n){
current=(n+sections.length)%sections.length;
const el=$('#nova-stage-display');if(el)el.innerHTML=contents(current);
const label=$('#nova-stage-label');if(label)label.textContent=sections[current].eyebrow;
const count=$('#nova-counter');if(count)count.textContent='0'+(current+1)+' / 04';
$$('[data-nova-step]').forEach((btn,i)=>btn.setAttribute('aria-selected',String(i===current)));
progress=0;
}
function motionControls(){
const b=$('#nova-toggle');if(!b)return;
b.textContent=playing?'Ⅱ':'▶';
b.setAttribute('aria-label',playing?'Pause animated case walkthrough':'Play animated case walkthrough');
}
function play(on){playing=on;motionControls();}
function events(e){
const scroll=e.target.closest('[data-nova-scroll]');
if(scroll){e.preventDefault();const to=document.querySelector(scroll.getAttribute('href'));to?.scrollIntoView({behavior:rm()?'instant':'smooth',block:'start'});return;}
const step=e.target.closest('[data-nova-step]');if(step){stage(Number(step.dataset.novaStep));play(false);return;}
if(e.target.closest('#nova-toggle')){play(!playing);return;}
const dec=e.target.closest('[data-nova-decision]');
if(dec){decision=dec.dataset.novaDecision;$$('[data-nova-decision]').forEach(x=>x.setAttribute('aria-pressed',String(x===dec)));const r=$('#nova-decision-result');if(r)r.textContent=response(decision);play(false);}
}
function size(){
if(!canvas)return;const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;
dpr=Math.min(2,window.devicePixelRatio||1);w=rect.width;h=rect.height;
canvas.width=Math.floor(w*dpr);canvas.height=Math.floor(h*dpr);
ctx=canvas.getContext('2d',{alpha:true});if(ctx)ctx.setTransform(dpr,0,0,dpr,0,0);
}
function draw(now){
if(!ctx||!w||!h)return;
ctx.clearRect(0,0,w,h);
const t=now*.001;
const cx=w*.59,cy=h*.49,R=Math.min(w*.42,h*.4);
ctx.save();ctx.globalCompositeOperation='screen';
let glow=ctx.createRadialGradient(cx,cy,10,cx,cy,R*1.8);
glow.addColorStop(0,'rgba(165,165,255,.26)');glow.addColorStop(.28,'rgba(102,84,232,.20)');glow.addColorStop(.69,'rgba(66,44,204,.09)');glow.addColorStop(1,'transparent');
ctx.fillStyle=glow;ctx.beginPath();ctx.arc(cx,cy,R*1.8,0,7);ctx.fill();
for(let i=0;i<8;i++){
 const radius=R*(.38+i*.11);const squash=.42+Math.sin(t*.15+i*.77)*.075;
 ctx.save();ctx.translate(cx,cy);ctx.rotate(i*.24+t*(i%2?.013:-.017));
 ctx.beginPath();ctx.ellipse(0,0,radius,radius*squash,0,0,Math.PI*2);
 ctx.strokeStyle='rgba(183,179,255,'+(0.07+i*.013)+')';ctx.lineWidth=i===2?1.4:.8;ctx.stroke();ctx.restore();
}
for(let n=0;n<36;n++){
 const base=(n*2.399963+t*(n%4?-.025:.05)),rx=R*(.42+n%7*.08),ry=rx*(.45+(n%4)*.09);
 const x=cx+Math.cos(base)*rx,y=cy+Math.sin(base)*ry;
 const alpha=.25+.65*(Math.sin(t*.7+n)*.5+.5);
 ctx.fillStyle='rgba('+(n%3?'196,194,255':'219,231,255')+','+alpha.toFixed(3)+')';
 ctx.beginPath();ctx.arc(x,y,n%9===0?3.4:1.3+(n%3)*.3,0,7);ctx.fill();
 if(n%5===0){
  const end=(base+.4),x2=cx+Math.cos(end)*rx,y2=cy+Math.sin(end)*ry;
  const grad=ctx.createLinearGradient(x,y,x2,y2);grad.addColorStop(0,'rgba(168,148,255,0)');grad.addColorStop(.7,'rgba(181,174,255,.24)');grad.addColorStop(1,'rgba(203,219,255,.58)');
  ctx.strokeStyle=grad;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(cx,cy,x2,y2);ctx.stroke();
 }
}
ctx.restore();
}
function loop(now){
if(!localHome||!localHome.isConnected){raf=0;ctx=null;return;}
const delta=Math.min(100,Math.max(0,now-last));last=now;
if(playing&&!rm()&&!document.hidden){
 progress+=delta/5700*100;
 if(progress>=100){stage(current+1);progress=0;}
 const bar=$('#nova-progress');if(bar)bar.style.width=progress.toFixed(1)+'%';
}
if(!rm()&&!document.hidden&&(now-lastDraw>30)){lastDraw=now;draw(now);}
raf=requestAnimationFrame(loop);
}
function init(){
const path=decodeURIComponent((location.hash||'#home').slice(1)).split('/')[0];
if(path!=='home'){localHome=null;return;}
const root=$('#view');if(!root)return;
if(root.querySelector('.nova-home'))return;
root.innerHTML=home();document.title='The Alert Room — Follow the funds. Find the why.';
localHome=root.querySelector('.nova-home');decision='';
canvas=$('#nova-universe');size();stage(0);playing=!rm();motionControls();
if(rm()){const bar=$('#nova-progress');if(bar)bar.style.width='0';draw(0);}
if(raf)cancelAnimationFrame(raf);
last=performance.now();lastDraw=0;raf=requestAnimationFrame(loop);
if(observer)observer.disconnect();
if('IntersectionObserver' in window && !rm()){
 observer=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');observer.unobserve(x.target)}}),{threshold:.07,rootMargin:'0px 0px -35px 0px'});
 $$('.nova-rise').forEach(x=>observer.observe(x));
}else $$('.nova-rise').forEach(x=>x.classList.add('in'));
}
document.addEventListener('click',events);
window.addEventListener('resize',()=>{if(localHome&&localHome.isConnected)size();},{passive:true});
window.addEventListener('hashchange',()=>requestAnimationFrame(init));
window.addEventListener('pageshow',()=>requestAnimationFrame(init));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(init));else requestAnimationFrame(init);
})();
