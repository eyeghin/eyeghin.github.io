/* Analyst / instant, device-friendly assistance for The Alert Room.
   No hidden network calls, account creation or model download. */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
const CASES=()=>window.AR_CASES||[];
const options=[
 ['How do I investigate an alert?','How do I investigate an alert?'],
 ['Help with this case','Can you summarize this case and where I should start?'],
 ['What makes strong evidence?','What makes strong evidence?'],
 ['How do I write a narrative?','How do I write a good investigation narrative?']
];
let history=[],activeCase='',shareCase=true,root=null,busy=false;
const money=n=>'$'+Number(n||0).toLocaleString('en-US',{maximumFractionDigits:2});
const allTx=c=>c?.transactions||[];
const clean=s=>String(s||'').trim();
const match=(s,re)=>re.test(s);
const nextQuestions=(items)=>items.filter(Boolean).slice(0,3);
function useCase(id){return CASES().find(c=>c.id===id)||null}
function getSelected(question){
 const id=question.match(/\bAR-\d{4}\b/i)?.[0]?.toUpperCase();
 return (id&&useCase(id))||(shareCase&&useCase(activeCase))||null;
}
function caseReply(c,q){
 const tx=allTx(c),credit=tx.filter(t=>t.direction==='Credit'),debit=tx.filter(t=>t.direction==='Debit');
 const total=a=>a.reduce((v,t)=>v+Number(t.amount||0),0);
 const range=tx.slice().sort((a,b)=>(a.date+' '+a.time).localeCompare(b.date+' '+b.time));
 const top=tx.slice().sort((a,b)=>b.amount-a.amount).slice(0,3);
 const touch='This is a fictional case; a rule match by itself is not proof of suspicious activity.';
 if(match(q,/\b(transaction|tx-|ledger|amount|credit|debit|payment|transfer|inbound|outbound|how many|total|largest|counterpart)/i)){
   const txid=q.match(/\bTX-[\w-]+\b/i)?.[0]?.toUpperCase();
   if(txid){const t=tx.find(v=>v.id.toUpperCase()===txid);return t?{answer:txid+' is a '+t.direction.toLowerCase()+' of '+money(t.amount)+' on '+t.date+' through '+t.method+' involving '+t.counterparty+'. Memo: '+(t.note||'none')+'. Compare this entry to the rest of the customer activity before citing it as suspicious.',follow:['What are the other major transactions?','How should I cite evidence?']}:null;}
   return {answer:c.id+' contains '+tx.length+' ledger entries: '+credit.length+' credits totaling '+money(total(credit))+' and '+debit.length+' debits totaling '+money(total(debit))+'. The largest entries are '+top.map(t=>t.id+' ('+money(t.amount)+', '+t.direction.toLowerCase()+')').join('; ')+'. '+touch,follow:nextQuestions(['Which transactions should I select?','Compare this with the customer baseline','What does QA expect?'])};
 }
 if(match(q,/\b(expected|profile|kyc|customer|baseline|background|occupation|normal|industry|sector)/i)){
  return {answer:'Customer '+c.reference+' ('+c.sector+'). Expected activity: '+c.expected+'. Prior account behavior: '+c.baseline+'. The monitoring rule flagged: '+c.trigger+'. Document exactly where the observed ledger matches or departs from that baseline. Unavailable supporting documents should remain explicitly unverified.',follow:['Which transactions matter most?','Should I escalate this case?']};
 }
 if(match(q,/\b(qa|score|review|passed|failed|feedback|rubric)/i)){
  return {answer:'For '+c.id+', the training QA evaluates decision and risk judgment (25 points), traceable transaction evidence (20), customer baseline (20), narrative (15), chronology (10) and remaining uncertainty (10). To submit you must select and cite at least three transaction IDs, write the assessment, complete KYC and ledger checkpoints, and attest that the case is fictional. A score is practice feedback, not independent bank QA.',follow:['How do I cite evidence?','Help structure the narrative']};
 }
 if(match(q,/\b(escalat|sar|suspici|rfi|request|clos|disposit|decide|fraud|refer)/i)){
  return {answer:'For '+c.id+', investigate the trigger ('+c.title+') against '+c.sector+' activity. Start with transaction timing, counterparty links, plausible purpose and document gaps. Escalation should explain what remains concerning after considering legitimate explanations. Closure must also be evidence-based. This exercise has a separate referral-review tab; a referral is not a real SAR.',follow:['Summarize the ledger','What is a good narrative structure?']};
 }
 if(match(q,/\b(date|when|timelin|chronolog|period)/i)){
  return {answer:'Recorded activity runs from '+(range[0]?.date||'not supplied')+' through '+(range.at(-1)?.date||'not supplied')+' across '+range.length+' fictional entries. Open Chronology to examine order, direction and gaps. Never invent earlier activity beyond the case record.',follow:['Summarize transactions','How do I cite dates?']};
 }
 return {answer:'You are reviewing '+c.id+' — '+c.title+'. The alert was triggered by '+c.trigger+'. Customer: '+c.reference+'; expected activity: '+c.expected+'. There are '+tx.length+' transactions to investigate. Start with KYC, compare the baseline, select traceable evidence, then write and defend a disposition. '+touch,follow:['Show transaction totals','Compare the customer baseline','How do I write the narrative?']};
}
const knowledge=[
 {re:/\b(hello|hi|hey|good morning|good evening)\b/i,answer:'Hi. I’m Analyst. I can explain AML concepts, guide you through The Alert Room, and examine any of the 40 fictional cases with you. What would you like to work on?',follow:['How do I investigate an alert?','Help with this case']},
 {re:/\b(narrative|write|wording|draft|sar rationale|document|writeup)\b/i,answer:'A clear case narrative follows six parts: (1) alert trigger and review period; (2) customer and expected behavior; (3) observed activity with dates, amounts and ledger IDs; (4) relevant connections and plausible explanations; (5) facts that remain unverified; (6) a defensible closure, information request or escalation recommendation. Use your own analysis rather than copying a template.',follow:['What makes strong evidence?','What does QA score?']},
 {re:/\b(evidence|citation|cite|ids|transactions)\b/i,answer:'Choose ledger entries that demonstrate the actual pattern, not just the three largest payments. Select records that establish timing, counterparties, flow or contradicting behavior. Cite each exact transaction ID, date, direction and amount in the narrative. The training QA requires at least three selected IDs to appear in your written assessment.',follow:['How do I investigate an alert?','Help with this case']},
 {re:/\b(qa|score|reviewer|pass|rubric|feedback)\b/i,answer:'The Alert Room QA is an immediate educational rubric, not human approval. It scores decision quality (25), evidence (20), context (20), writing (15), chronology (10), and gaps/uncertainty (10). A pass requires 78+, the reference disposition and at least three cited evidence IDs. You can revise a case and submit a new review cycle.',follow:['How do I strengthen my narrative?','Open the QA desk']},
 {re:/\b(aml|alert|monitor|investigation|workflow|investigat)/i,answer:'Start with triage, then review the customer profile and expected account behavior. Examine the full ledger, group related transfers, test plausible explanations and mark relevant evidence. Document the facts, missing verification and recommended disposition. If escalating, finish the referral assessment first. Then submit your own narrative to training QA.',follow:['What evidence should I collect?','What is the difference between unusual and suspicious activity?']},
 {re:/\b(kyc|cdd|edd|beneficial owner|due diligence)/i,answer:'KYC establishes who the customer is and why the account is used. CDD includes understanding expected activity and risk. EDD means proportionate additional scrutiny for higher-risk circumstances under a bank’s policies. Compare observed transactions to the documented profile; do not assume an identity check or screening clearance that is not in this exercise.',follow:['How do I spot a material deviation?','Help with this case']},
 {re:/\b(funds flow|layering|structuring|velocity|counterparties|red flag|typolog)/i,answer:'Investigate velocity, timing, payment direction, repeat beneficiaries, source-to-use movement, transaction-size patterns and deviations from the customer’s normal profile. A red flag is a reason to investigate, not proof of a crime. Use alternative explanations and evidence to decide what remains unexplained.',follow:['What makes strong evidence?','Help with this case']},
 {re:/\b(sar|file|filing|finCEN|regulator|legal)/i,answer:'The Alert Room does not file SARs or provide regulatory determinations. An internal escalation may lead to further review under an institution’s policies; it is not the same as filing a SAR. Regulatory obligations and thresholds depend on jurisdiction, facts and applicable rules. Verify current requirements through authoritative guidance.',follow:['How should I write a rationale?','What does QA check?']},
 {re:/\b(close|rfi|escalat|disposition|referral)/i,answer:'A closure should show why the activity is adequately explained; an RFI should identify a precise material gap; an escalation should document the unresolved activity and supporting evidence. None is automatically the safest answer. Compare the customer baseline, counterparties, timing, amounts and facts still unverified.',follow:['How do I investigate an alert?','Help with this case']},
 {re:/\b(learn|lesson|course|quiz|training|certif)/i,answer:'The Academy contains 6 courses and 18 lessons, plus knowledge checks. Open Learn in the navigation, choose a module, complete an exercise, then apply it to a case in Investigate. These exercises are not certification or a substitute for institutional training.',follow:['How do I investigate an alert?','What does QA score?']},
 {re:/\b(progress|saved|login|account|privacy|sync)/i,answer:'This simulation does not require an account or login. Your drafts, selected evidence, lessons and QA reports are saved locally in this browser. They are not synchronized across devices. Avoid entering real customer, employer-confidential or SAR information.',follow:['How do I submit a case?','How does QA work?']},
 {re:/\b(fraud|dispute|chargeback|account takeover|ato)/i,answer:'For suspected fraud, confirm which facts are observed: changes to identity/contact details, authentication, device or beneficiary, unusual velocity and disputed authorizations. Distinguish a customer-service dispute from an AML suspicion, and follow the appropriate institution-specific escalation process. The training ledger alone cannot establish identity fraud.',follow:['What makes strong evidence?','Help with this case']}
];
function response(question){
 const q=clean(question);if(!q)return null;
 const c=getSelected(q);
 const special=q.match(/\bTX-[\w-]+\b/i)?.[0]?.toUpperCase();
 if(special&&!c){let target=CASES().find(c=>allTx(c).some(t=>t.id.toUpperCase()===special));if(target)return caseReply(target,q);}
 if(c){const r=caseReply(c,q);if(r&&(/AR-\d{4}/i.test(q)||shareCase))return r;}
 let found=knowledge.find(v=>v.re.test(q));
 if(found)return {answer:found.answer,follow:found.follow};
 return {answer:'I can work with fictional account data and explain AML, transaction monitoring, KYC, evidence selection, narratives and QA. I don’t have a general-purpose hosted language model connected, so I won’t invent an answer to that question. Ask about a specific alert ID (for example AR-3002), transaction ID, or one of these topics.',follow:['How do I investigate an alert?','Help with this case','How does QA work?']};
}
function render(){
 const log=$('#analyst-messages');if(!log)return;
 log.replaceChildren();
 if(!history.length){
  const intro=document.createElement('section');intro.className='analyst-intro';
  intro.innerHTML='<div class="analyst-monogram">A.</div><h3>Ask anything about your investigation.</h3><p>Understand a rule, review fictional transactions, challenge an assessment or prepare your QA submission.</p><small>INSTANT STUDY GUIDANCE • NO DOWNLOAD</small>';
  log.append(intro);
 }
 for(const h of history){
  const item=document.createElement('article');item.className='analyst-turn '+h.role;
  const who=document.createElement('small');who.textContent=h.role==='user'?'YOU':'ANALYST';
  const p=document.createElement('p');p.textContent=h.answer;
  item.append(who,p);log.append(item);
 }
 log.scrollTop=log.scrollHeight;
}
function ask(q){
 const question=clean(q).slice(0,2000);if(!question||busy)return;
 busy=true;history.push({role:'user',answer:question});
 const r=response(question);history.push({role:'assistant',answer:r.answer});
 history=history.slice(-48);render();
 const hint=$('#analyst-followups');if(hint){
  hint.replaceChildren();
  for(const text of nextQuestions(r.follow||[])){
   const b=document.createElement('button');b.type='button';b.textContent=text;b.addEventListener('click',()=>ask(text));hint.append(b);
  }
 }
 busy=false;
 const input=$('#analyst-input');if(input){input.value='';input.focus();}
}
function mount(){
 const node=$('#analyst-root');if(!node||node===root)return;root=node;
 node.innerHTML='<div class="ag-chat"><div id="analyst-messages" class="ag-conversation" role="log" aria-live="polite" aria-label="Analyst conversation"></div><div class="analyst-toolbar"><label id="analyst-context-label" hidden><input type="checkbox" id="analyst-attach" checked> Include <strong id="analyst-case-id"></strong></label><button id="analyst-clear" type="button">New conversation</button></div><div id="analyst-followups" class="analyst-chips"></div><form id="analyst-chat-form" class="analyst-chat-form"><textarea rows="1" id="analyst-input" maxlength="2000" aria-label="Ask Analyst" placeholder="Ask about an alert, transaction or AML…" required></textarea><button type="submit" id="analyst-send" aria-label="Send question"><span aria-hidden="true">↑</span></button></form><div class="analyst-privacy">Built-in guidance · Fictional data only · No model download</div></div>';
 const f=$('#analyst-chat-form');f.addEventListener('submit',e=>{e.preventDefault();ask($('#analyst-input').value)});
 $('#analyst-input').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();f.requestSubmit()}});
 $('#analyst-clear').addEventListener('click',()=>{history=[];$('#analyst-followups')?.replaceChildren();render()});
 $('#analyst-attach').addEventListener('change',e=>{shareCase=e.target.checked});
 const id=decodeURIComponent(location.hash.replace(/^#/,'')).split('/');
 setCaseContext(id[0]==='case'?id[1]:'');
 render();
 const hint=$('#analyst-followups');options.slice(0,3).forEach(([label,question])=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',()=>ask(question));hint.append(b)});
}
function setCaseContext(id){
 const c=useCase(id);activeCase=c?.id||'';
 const lbl=$('#analyst-context-label');if(lbl)lbl.hidden=!activeCase;
 const title=$('#analyst-case-id');if(title)title.textContent=activeCase;
 shareCase=!!activeCase;
 const check=$('#analyst-attach');if(check)check.checked=shareCase;
}
window.AlertAnalyst={setCaseContext,available:()=>true,isLoading:()=>false};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();