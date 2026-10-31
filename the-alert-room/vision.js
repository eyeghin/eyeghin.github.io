/* The Alert Room / a data-driven cinematic introduction.
   Every visible payment comes from the same fictional case opened by the CTA. */
(()=>{'use strict';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=x=>'$'+Number(x||0).toLocaleString('en-US');
const current=()=>window.AR_CASES.find(x=>x.id==='AR-3002')||window.AR_CASES[0];
let cleanup=()=>{};
function home(){const c=current(),tx=c.transactions;
return `<div class="experience-home">
<section class="film-runway" aria-label="An investigation unfolds"><div class="film-stage">
 <div class="film-coordinate"><span>INDEPENDENT FINANCIAL CRIME PRACTICE</span><span>FICTIONAL CASE / ${esc(c.id)}</span></div>
 <div class="spatial-ledger" aria-hidden="true"><div class="ledger-camera">${tx.slice(0,8).map((t,i)=>`<div class="evidence-plane" style="--i:${i}"><div class="plane-top"><span>${esc(t.id)}</span><span>${String(i+1).padStart(2,'0')} / 24</span></div><div class="plane-amount">${t.direction==='Credit'?'+':'−'}${money(t.amount)}</div><div class="plane-rule"></div><div class="plane-detail"><span>${esc(t.method)} / ${esc(t.direction)}</span><span>${esc(t.date)}</span></div><div class="plane-party">${esc(t.counterparty.replace(/.* \/ /,''))}</div><span class="plane-label">SYNTHETIC TRANSACTION RECORD</span></div>`).join('')}</div></div>
 <h1 class="film-title"><span class="film-line"><span>BEHIND</span></span><span class="film-line"><span>EVERY</span></span><span class="film-line film-title-last"><span>ALERT<span class="signal-period">.</span></span></span></h1>
 <div class="film-caption"><span class="micro-label">THERE’S A STORY TO INVESTIGATE.</span><p>The rule found a pattern.<br>Your job is to find out what it means.</p><a href="#case/${esc(c.id)}" class="film-action">Enter the investigation <span>↗</span></a></div>
 <div class="film-chapter-copy" aria-live="off"><span id="film-chapter-label">01 / THE SIGNAL</span><h2 id="film-chapter-title">An alert is not an answer.</h2><p id="film-chapter-description">Observe the activity. Question the pattern.</p></div>
 <div class="film-controls"><button class="film-motion" aria-pressed="false">Pause motion</button><span class="film-scroll">SCROLL TO FOLLOW THE EVIDENCE <span>↓</span></span><span class="film-progress-label">01 — 03</span></div>
 <div class="film-progress" aria-hidden="true"><span></span></div>
</div></section>
<section class="method-editorial"><div class="method-intro"><span class="micro-label">THE WORK STARTS AFTER THE WARNING</span><h2>Context.<br>Evidence.<br><span>Judgment.</span></h2><p>A transaction can tell two different stories. Learn to test both before you make the call.</p></div><div class="method-case"><div class="method-case-top"><span>AN OPEN FILE</span><span>${esc(c.id)}</span></div><span class="case-file-number">002</span><h3>${esc(c.title)}</h3><p>${esc(c.trigger)}. Start with the customer. Find the transactions that matter. Explain what remains unknown.</p><dl><div><dt>Customer</dt><dd>${esc(c.reference)}</dd></div><div><dt>Records</dt><dd>${tx.length} fictional transactions</dd></div><div><dt>Your task</dt><dd>Investigate & document</dd></div></dl><a href="#case/${esc(c.id)}">Open the complete case <span>↗</span></a></div></section>
<section class="practice-index"><div class="index-title"><span class="micro-label">THREE WAYS IN</span><h2>Learn it.<br>Then do the work.</h2></div><a href="#learn" class="index-link"><span>01 / THE METHOD</span><strong>Learn</strong><p>Customer due diligence, monitoring patterns, and the questions behind a defensible review.</p><b>↗</b></a><a href="#workspace" class="index-link"><span>02 / THE INVESTIGATION</span><strong>Investigate</strong><p>A 40-alert queue. Realistic customer context. Transactions, evidence, notes, and your decision.</p><b>↗</b></a><a href="#qa" class="index-link"><span>03 / THE REVIEW</span><strong>Defend</strong><p>Submit your own narrative. Read the training rubric. Revise the work, then try again.</p><b>↗</b></a></section>
<section class="founder-statement"><span class="micro-label">A NOTE FROM ERIK</span><div><h2>Access to practice<br>shouldn’t be a privilege.</h2><p>I built The Alert Room to make the practical side of financial-crime work easier to explore. A place to ask better questions, make a decision, and learn from the review.</p><a href="#story">Why I built this ↗</a></div><span class="founder-signature">Erik Y.</span></section>
<section class="closing-scene"><span class="micro-label">40 FICTIONAL ALERTS. YOUR REASONING.</span><h2>MAKE<br>THE CALL<span>.</span></h2><a class="film-action" href="#workspace">Open the investigation desk <span>↗</span></a><p>Free practice. Fictional data. No certification or real regulatory filing.</p></section>
</div>`;
}
function afterRender(){cleanup();const runway=document.querySelector('.film-runway'),stage=document.querySelector('.film-stage');if(!runway)return;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),button=stage.querySelector('.film-motion');let paused=reduced.matches,raf=0,target=0,progress=0,pointerX=0,pointerY=0,chapter=-1,last=0;
 const scenes=[['01 / THE SIGNAL','An alert is not an answer.','Observe the activity. Question the pattern.'],['02 / THE CONTEXT','Every payment has a context.','Who is the customer? What would normal activity look like?'],['03 / THE JUDGMENT','Follow the evidence.','Select the facts. Consider another explanation. Defend your decision.']];
 function update(time){if(!document.contains(stage))return;const rect=runway.getBoundingClientRect();target=Math.max(0,Math.min(1,-rect.top/Math.max(1,runway.offsetHeight-innerHeight)));progress+=((paused?target:target)-progress)*(paused?1:.09);const p=progress;
 stage.style.setProperty('--journey',p);stage.style.setProperty('--travel',(p*1850).toFixed(1)+'px');stage.style.setProperty('--yaw',(-27+p*48+pointerX*5).toFixed(2)+'deg');stage.style.setProperty('--pitch',(11-p*17+pointerY*3).toFixed(2)+'deg');stage.style.setProperty('--float',paused?'0px':(Math.sin(time*.00035)*12).toFixed(2)+'px');
 const n=Math.min(2,Math.floor(p*3));if(n!==chapter){chapter=n;stage.dataset.chapter=n;document.querySelector('#film-chapter-label').textContent=scenes[n][0];document.querySelector('#film-chapter-title').textContent=scenes[n][1];document.querySelector('#film-chapter-description').textContent=scenes[n][2];stage.querySelector('.film-progress-label').textContent=String(n+1).padStart(2,'0')+' — 03';}
 if(!paused||Math.abs(target-progress)>.001)raf=requestAnimationFrame(update);else raf=0;
 }
 function wake(){if(!raf)raf=requestAnimationFrame(update)}
 function pointer(e){if(paused)return;pointerX=(e.clientX/innerWidth-.5);pointerY=(e.clientY/innerHeight-.5);wake()}
 function toggle(){paused=!paused;button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'Resume motion':'Pause motion';stage.classList.toggle('motion-paused',paused);wake()}
 button.textContent=paused?'Enable motion':'Pause motion';button.setAttribute('aria-pressed',String(paused));
 window.addEventListener('scroll',wake,{passive:true});stage.addEventListener('pointermove',pointer);button.addEventListener('click',toggle);wake();
 const observer=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in-view');observer.unobserve(x.target)}}),{threshold:.12});document.querySelectorAll('.method-editorial,.index-link,.founder-statement,.closing-scene').forEach(el=>observer.observe(el));
 cleanup=()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',wake);stage.removeEventListener('pointermove',pointer);button.removeEventListener('click',toggle);observer.disconnect()};
}
window.ARStory={home,afterRender};window.addEventListener('hashchange',()=>{if(!location.hash||location.hash==='#home')return;cleanup()});
})();
