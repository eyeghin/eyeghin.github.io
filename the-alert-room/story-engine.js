/* The Alert Room — narrative experience
   All illustrations derive from fictional training scenario AR-3002.
   The visitor's explicit choices are not submitted or scored as SARs.
*/
(function () {
"use strict";
const steps=[
 {label:"Signal",kicker:"01 / THE SIGNAL",title:"Something changed.",desc:"A monitoring rule notices unusual payment volume. That tells you where to look. It doesn't tell you what happened."},
 {label:"Context",kicker:"02 / THE CUSTOMER",title:"The profile changes the picture.",desc:"The account belongs to an event organizer. A burst of payments may fit a scheduled event — or it may not. Compare the expected activity with what actually occurred."},
 {label:"Evidence",kicker:"03 / THE TRANSACTIONS",title:"Follow each entry.",desc:"Read the ledger. Trace where money came from, where it went, and which transaction IDs support your interpretation."},
 {label:"Judgment",kicker:"04 / YOUR DECISION",title:"Make a call you can defend.",desc:"Choose what the evidence supports. Then explain it in writing. The answer isn't 'always escalate' — it's reasoning from facts."}
];
const labels={close:"Close with rationale",rfi:"Request more information",escalate:"Escalate for further review"};
let index=0,playing=false,timer=0,decision="",lastRoot=null;
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const caseData=()=>window.AR_CASES?.find(x=>x.id==="AR-3002")||window.AR_CASES?.[0]||{};
const money=v=>"$"+Number(v||0).toLocaleString("en-US",{maximumFractionDigits:0});
const link=(url,txt,primary=true)=>'<a href="'+url+'" class="ar-action '+(primary?'solid':'outline')+'">'+txt+' <span aria-hidden="true">↗</span></a>';
function story(){
const c=caseData(),tx=c.transactions||[],credit=tx.filter(x=>x.direction==="Credit"),debit=tx.filter(x=>x.direction==="Debit");
return '<div class="ar-site">'
+'<section class="ar-hero" aria-labelledby="ar-hero-title">'
+'<div class="ar-hero-grid" aria-hidden="true"></div>'
+'<div class="ar-hero-inner ar-container">'
+' <div class="ar-hero-copy"><div class="ar-kicker"><i></i> THE ALERT ROOM / FINANCIAL CRIME PRACTICE</div>'
+'  <h1 id="ar-hero-title">An alert is<br>not an <span>answer.</span></h1>'
+'  <p>Every flagged transaction begins with a question. Learn to investigate the person, follow the funds, and defend what the evidence actually says.</p>'
+'  <div class="ar-actions">'+link("#case/AR-3002","Investigate an alert")+link("#story","Why I made this",false)+'</div>'
+'  <div class="ar-hero-foot"><span>INDEPENDENT. FREE. BUILT FOR PRACTICE.</span><span>BY ERIK YEGHINYAN</span></div></div>'
+' <div class="ar-hero-scene" aria-label="Illustrated monitoring alert and transaction relationships">'
+    scene(c,tx,credit,debit)
+' </div></div>'
+' <a class="ar-scroll-cue" href="#ar-chapter" data-story-anchor aria-label="Explore the investigation story"><span>THE STORY STARTS HERE</span><span aria-hidden="true">↓</span></a>'
+'</section>'
+'<section class="ar-section ar-section-intro" id="ar-chapter"><div class="ar-container">'
+' <div class="ar-overline">01 / UNDERSTANDING THE SIGNAL</div>'
+' <div class="ar-intro-split"><h2>Rules flag activity.<br><span>People find meaning.</span></h2><div><p>One alert. Several possible explanations. The job is to find the difference between a pattern that looks unusual and a conclusion the evidence supports.</p><p>Experience a fictional case below. Every stage shows a decision the analyst must make — and why it matters.</p></div></div>'
+'</div></section>'
+'<section class="ar-walkthrough" id="ar-story-player"><div class="ar-container">'
+' <div class="ar-overline light">02 / AN INVESTIGATION, FROM THE INSIDE</div>'
+' <div class="ar-walk-head"><h2>See the case.<br><span>Make the call.</span></h2><p>Four connected stages of one case. Navigate the evidence yourself, or play the sequence from start to finish.</p></div>'
+' <div class="ar-story-machine">'
+'   <div class="ar-story-toolbar"><div><span class="ar-led"></span><strong>CASE AR-3002</strong><span class="ar-tool-sep">/</span><span>FICTIONAL TRAINING SCENARIO</span></div><div>YOUR ANALYST DESK <span class="ar-mono">01—04</span></div></div>'
+'   <nav class="ar-story-steps" role="tablist" aria-label="Investigation walkthrough stages">'
+    steps.map((s,i)=>'<button type="button" class="ar-step" role="tab" aria-controls="ar-step-panel" aria-selected="'+(i===0)+'" data-ar-step="'+i+'"><span>0'+(i+1)+'</span><strong>'+s.label+'</strong></button>').join("")
+'   </nav>'
+'   <div class="ar-stage" id="ar-step-panel" role="tabpanel" aria-live="polite">'+stepPanel(0)+'</div>'
+'   <div class="ar-story-bottom"><div class="ar-stage-status"><span class="ar-story-bar"><i id="ar-story-fill"></i></span><span id="ar-story-count">01 / 04</span></div><div class="ar-stage-controls"><button type="button" id="ar-story-play" aria-label="Play investigation walkthrough">Play sequence <span>▶</span></button><button type="button" id="ar-story-next">Next stage →</button></div></div>'
+'  </div><p class="ar-fine">Training scenario only. All customer details and payments are invented. This preview does not submit a SAR or generate an official QA result.</p>'
+'</div></section>'
+'<section class="ar-section ar-work"><div class="ar-container">'
+' <div class="ar-overline">03 / WHAT YOU ACTUALLY DO</div>'
+' <div class="ar-work-head"><h2>The work is<br><span>in the details.</span></h2><p>The Alert Room is not a quiz pretending to be a bank. The training workspace gives you an account, a ledger and the responsibility to explain your decision.</p></div>'
+' <div class="ar-work-rows">'
+   row("01","Learn the context","Read the customer profile. Understand what normal activity should look like.","#learn","Study the foundations")
+   row("02","Investigate the activity","Search transactions, examine counterparties, build the chronology and select IDs as evidence.","#workspace","Open the investigations")
+   row("03","Write. Submit. Improve.","Document the conclusion yourself. Receive a transparent training QA report and revise.","#qa","Explore training QA")
+' </div></div></section>'
+'<section class="ar-qa-spot"><div class="ar-container ar-qa-inner"><div><div class="ar-overline light">04 / THE SECOND LOOK</div>'
+' <h2>A decision is only as good as the evidence behind it.</h2><p>When you submit a training case, the QA rubric examines your disposition, transaction citations, customer context, chronology and reasoning. A weak narrative comes back for improvement.</p>'
+' '+link("#qa","See how QA works")+'</div>'
+' <div class="ar-qa-paper" aria-label="Illustration of an evidence-linked training workpaper"><div class="ar-paper-top"><span>TRAINING QA / REVIEW OF WORKPAPER</span><span>SIMULATED</span></div>'
+' <div class="ar-paper-title">What does this conclusion rest on?</div><div class="ar-paper-line"><span>Customer baseline</span><b>REVIEWED</b></div><div class="ar-paper-line"><span>Evidence-linked transaction IDs</span><b>REQUIRED</b></div><div class="ar-paper-line"><span>Reasoned disposition</span><b>REQUIRED</b></div>'
+' <div class="ar-paper-text">The narrative should explain the activity, cite actual ledger entries and make its limitations visible.</div>'
+' <div class="ar-paper-bottom"><span>100-POINT EDUCATIONAL RUBRIC</span><span>NOT HUMAN QA</span></div></div>'
+'</div></section>'
+'<section class="ar-founder"><div class="ar-container ar-founder-grid"><div class="ar-overline">05 / WHY THE ALERT ROOM EXISTS</div><div><h2>It should be easier to practice the work before you get the job.</h2><p>Specialized compliance courses can be expensive. Real investigation software usually sits behind an employer login. I wanted a place where someone curious about AML could spend an hour practicing judgment — not just memorizing definitions.</p><div class="ar-founder-byline"><span>ERIK YEGHINYAN<br><small>FOUNDER & CREATOR</small></span>'+link("#story","Read the founder’s story",false)+'</div></div></div></section>'
+'<section class="ar-assistant"><div class="ar-container ar-assistant-grid"><div><div class="ar-overline light">06 / ASK ANALYST</div><h2>A better question changes the investigation.</h2><p>Ask Analyst about a transaction pattern, a missing piece of evidence or how to strengthen your reasoning. It is an optional AI learning companion; your work stays your own.</p>'+link("#analyst","Talk to Analyst")+'<small>Compatible browser and local AI model download required.</small></div><div class="ar-chat-illustration"><div class="ar-chat-heading"><b>Analyst</b><span>TRAINING ASSISTANT</span></div><div class="ar-chat-ask">Does this payment activity automatically mean I should escalate?</div><div class="ar-chat-answer"><span>A</span><p>No. Start with the customer’s expected behavior, then compare the payments, counterparties and supporting evidence. What remains unexplained?</p></div><div class="ar-chat-note">ILLUSTRATIVE CONVERSATION — NOT A LIVE RESPONSE</div></div></div></section>'
+'<section class="ar-final"><div class="ar-container"><div class="ar-overline">THE ROOM IS OPEN</div><h2>Learn the work.<br><span>Practice the judgment.</span></h2><p>Start with a fictional alert. The questions are yours to answer.</p>'+link("#workspace","Enter the investigation room")+'</div></section>'
+'</div>';
}
function row(num,title,body,to,action){return '<a class="ar-work-row" href="'+to+'"><span>'+num+'</span><div><h3>'+title+'</h3><p>'+body+'</p></div><b>'+action+' <i aria-hidden="true">↗</i></b></a>'}
function scene(c,tx,credits,debits){
const selected=tx.filter(x=>x.direction==="Credit").slice(-3);
return '<div class="ar-scene-orbit" aria-hidden="true">'
+'<svg viewBox="0 0 660 620" preserveAspectRatio="xMidYMid meet" role="presentation">'
+'<defs><linearGradient id="ar-thread" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#655bff"/><stop offset="1" stop-color="#a8a1ff"/></linearGradient></defs>'
+'<circle class="ar-ring ar-ring-one" cx="325" cy="305" r="206"/><circle class="ar-ring ar-ring-two" cx="325" cy="305" r="148"/>'
+'<path class="ar-route" d="M96 152 Q248 130 325 305 Q460 228 568 145"/>'
+'<path class="ar-route ar-route-b" d="M80 413 Q208 476 325 305 Q459 419 567 473"/>'
+'<path class="ar-trace" d="M96 152 Q248 130 325 305 Q460 228 568 145"/>'
+'<circle class="ar-node" cx="96" cy="152" r="10"/><circle class="ar-node" cx="568" cy="145" r="10"/><circle class="ar-node" cx="80" cy="413" r="9"/><circle class="ar-node" cx="567" cy="473" r="9"/>'
+'<circle class="ar-halo" cx="325" cy="305" r="67"/><circle class="ar-main-node" cx="325" cy="305" r="31"/><circle cx="325" cy="305" r="9" fill="#fff"/>'
+'</svg></div>'
+'<div class="ar-scene-tag ar-tag-top"><span>MONITORING RULE</span><strong>'+esc(c.title||"Payment velocity")+'</strong><small>ACTIVITY FLAGGED FOR REVIEW</small></div>'
+'<div class="ar-scene-tag ar-tag-left"><span>PAYMENTS OBSERVED</span><strong>'+tx.length+' entries</strong><small>TRAINING LEDGER</small></div>'
+'<div class="ar-scene-tag ar-tag-bottom"><span>CUSTOMER CONTEXT</span><strong>'+esc(c.sector||"Event organizer")+'</strong><small>EXPECTED: '+esc(c.expected||"Event collections")+'</small></div>'
+'<div class="ar-scene-caption"><span class="ar-live-dot"></span> LIVE EXAMPLE / AR-3002 <span>·</span> SYNTHETIC DATA</div>';
}
function stepPanel(i){
const c=caseData(),tx=c.transactions||[],s=steps[i];
let visual="";
if(i===0)visual='<div class="ar-case-display"><span class="ar-case-chip">FLAG / PRIORITY '+esc(c.priority||3)+'</span><strong>'+esc(c.title||"Monitoring alert")+'</strong><small>'+esc(c.trigger||"Payment-volume threshold")+'</small><div class="ar-case-bars">'+Array.from({length:13},(_,j)=>'<i style="height:'+(25+(j*17+j*j*3)%70)+'%"></i>').join("")+'</div></div>';
if(i===1)visual='<div class="ar-case-display"><span class="ar-case-chip">FICTIONAL KYC PROFILE</span><strong>'+esc(c.reference||"Training customer")+'</strong><div class="ar-case-kv"><span>Occupation / industry</span><b>'+esc(c.sector||"Event organizer")+'</b></div><div class="ar-case-kv"><span>Expected activity</span><b>'+esc(c.expected||"Event collections")+'</b></div><div class="ar-case-kv"><span>Historical baseline</span><b>'+esc(c.baseline||"Review history")+'</b></div></div>';
if(i===2)visual='<div class="ar-case-display"><span class="ar-case-chip">LEDGER / CHRONOLOGY</span><strong>Trace the money.</strong>'+tx.slice(0,4).map(t=>'<div class="ar-case-tx"><span>'+esc(t.id)+' <small>'+esc(t.counterparty)+'</small></span><b>'+(t.direction==="Debit"?"−":"+")+money(t.amount)+'</b></div>').join("")+'</div>';
if(i===3)visual='<div class="ar-case-display"><span class="ar-case-chip">DISPOSITION / YOUR TURN</span><strong>What would you do?</strong><div class="ar-story-options">'+Object.entries(labels).map(([v,txt])=>'<button type="button" data-ar-choice="'+v+'" aria-pressed="'+(decision===v?'true':'false')+'">'+txt+'</button>').join("")+'</div><div class="ar-story-response" id="ar-decision-note">'+(decision?answer(decision):"Choose a path to examine its rationale.")+'</div></div>';
return '<div class="ar-stage-copy"><div class="ar-overline light">'+s.kicker+'</div><h3>'+s.title+'</h3><p>'+s.desc+'</p></div><div class="ar-stage-visual">'+visual+'</div>';
}
function answer(choice){const c=caseData();if(choice===c.outcome)return 'Consistent with the fictional reference. Explain your choice using the specific payment IDs, customer context, and evidence.';if(choice==="rfi")return 'A targeted information request is appropriate when a material explanation remains unverified. Be specific about what evidence is missing.';return 'Review the activity against the customer’s expected behavior. A monitoring alert alone is not evidence that misconduct occurred.'}
function renderStage(){
const panel=q("#ar-step-panel");if(panel)panel.innerHTML=stepPanel(index);
qa("[data-ar-step]").forEach((el,i)=>{el.setAttribute("aria-selected",String(index===i));el.tabIndex=index===i?0:-1});
const count=q("#ar-story-count");if(count)count.textContent="0"+(index+1)+" / 04";
const fill=q("#ar-story-fill");if(fill)fill.style.width=((index+1)/4*100)+"%";
}
function setStep(n){index=(n+steps.length)%steps.length;renderStage()}
function setPlay(value){playing=value;const btn=q("#ar-story-play");if(btn){btn.innerHTML=value?'Pause sequence <span>Ⅱ</span>':'Play sequence <span>▶</span>';btn.setAttribute("aria-label",value?"Pause investigation walkthrough":"Play investigation walkthrough")};clearInterval(timer);timer=0;if(value&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches)timer=setInterval(()=>{if(document.visibilityState!=="visible")return;setStep(index+1)},5200);}
function bind(){
const root=q(".ar-site");if(!root||root===lastRoot)return;
lastRoot=root;index=0;decision="";setPlay(false);renderStage();
}
document.addEventListener("click",e=>{
if(!q(".ar-site"))return;
const btn=e.target.closest("[data-ar-step]");if(btn){setStep(Number(btn.dataset.arStep));setPlay(false);return;}
if(e.target.closest("#ar-story-next")){setStep(index+1);setPlay(false);return}
if(e.target.closest("#ar-story-play")){setPlay(!playing);return}
const choice=e.target.closest("[data-ar-choice]");if(choice){decision=choice.dataset.arChoice;setPlay(false);renderStage();return}
const anchor=e.target.closest("[data-story-anchor]");if(anchor){e.preventDefault();q(anchor.getAttribute("href"))?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});}
});
window.addEventListener("hashchange",()=>{if(!q(".ar-site")){setPlay(false);lastRoot=null;}});
window.ARStory={home:story,afterRender:bind};
})();