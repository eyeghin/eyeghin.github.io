/* Free deterministic, case-aware AML practice coach. This is NOT a generative model.
   Uses only fictional case context the learner explicitly chooses to share. */
(function(){
'use strict';
function money(n){return '$'+Number(n||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});}
function plain(x){return String(x==null?'':x).trim();}
function parse(s){if(typeof s!=='string'||!s.trim())return null;try{const c=JSON.parse(s);return c&&Array.isArray(c.transactions)?c:null;}catch{return null;}}
function record(t){return [t.id||'TX',t.date||'',t.direction||'',money(t.amount),t.method||'',t.counterparty||''].join(' · ');}
function summarize(c){
 const tx=c.transactions||[],credit=tx.filter(x=>String(x.direction).toLowerCase()==='credit'),
 debit=tx.filter(x=>String(x.direction).toLowerCase()==='debit'),
 sum=a=>a.reduce((v,t)=>v+Number(t.amount||0),0),
 ordered=[...tx].sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))||String(a.time||'').localeCompare(String(b.time||'')));
 const methods={};tx.forEach(t=>{let k=plain(t.method)||'Unspecified';methods[k]=(methods[k]||0)+1;});
 return {tx,credit,debit,inTotal:sum(credit),outTotal:sum(debit),ordered,
  methods:Object.entries(methods).sort((a,b)=>b[1]-a[1]).map(x=>x[0]+': '+x[1]).join(', '),
  parties:new Set(tx.map(t=>plain(t.counterparty)).filter(Boolean)).size,
  large:[...tx].sort((a,b)=>Number(b.amount||0)-Number(a.amount||0)).slice(0,3)};
}
function feedback(q){
 const ids=[...q.matchAll(/\b(?:TX[- ]?\d{4,}|AR-\d{3,})\b/gi)];
 const date=/\b(?:\d{1,2}:\d{2}|2026-\d\d-\d\d|yesterday|today)\b/i.test(q);
 const amount=/\$\s?\d|(?:usd|dollars?|amounts?)\b/i.test(q);
 const absolute=/\b(certainly|definitely|criminal|clearly guilty|money laundering proved|must file a sar)\b/i.test(q);
 return 'Narrative quality check (educational, not a filing decision):\n'+
 '• References: '+(ids.length?'Found '+ids.length+' transaction or case reference(s).':'Add exact synthetic IDs for each key conclusion.')+'\n'+
 '• Chronology: '+(date?'Some dates/timing appear. Confirm order and gaps.':'Add a dated transaction sequence.')+'\n'+
 '• Amounts: '+(amount?'Some amounts are mentioned. Link each to a record.':'Cite exact amounts and directions.')+'\n'+
 '• Neutrality: '+(absolute?'Remove unproven assertions of criminal intent.':'Keep facts separate from hypotheses.')+'\n'+
 '• Revision: state the customer baseline, trigger, IDs, reasonable alternative explanation, uncertainties and justified next action.';
}
function respond(input,shared){
 const q=plain(input).slice(0,3000),lower=q.toLowerCase(),c=parse(shared),a=c?summarize(c):null;
 let opening='';
 if(/^(hi|hello|hey|yo|help|what can you do)\W*$/i.test(q)){
  opening='I can help investigate fictional alerts, choose evidence, challenge a rationale and structure a neutral case narrative. Try “What should I review first?” or attach a fictional case for exact transaction IDs.';
 }else if(/sanction|ofac|watchlist|screening|pep\b/i.test(lower)){
  opening='Sanctions screening: a preliminary name hit is not a confirmed match. Compare full name, date of birth, entity details and other relevant identifiers using permitted sources. Record discrepancies and escalate by policy. This lab does not access live sanctions lists.';
 }else if(/structur|threshold|reporting limit/i.test(lower)){
  opening='Potential structuring concerns possible intentional evasion of reporting rules. Repeated amounts near a threshold do not alone prove intent. Investigate timing, business purpose, counterparties, channels and alternate explanations.';
 }else if(/sar\b|suspicious activity report|filing/i.test(lower)){
  opening='Actual SAR decisions depend on institution-specific policy and law. For this simulation, separate objective facts from hypotheses; build a timeline with fictional IDs and document what remains unexplained. Never enter real SAR information.';
 }else if(/challenge|critique|grade|review my|narrative|rationale|write.?up|decision\b|disposition/i.test(lower)){
  opening='Challenge the hypothesis: does the evidence support your claim? What contradicts it? Could an ordinary explanation fit? Which records establish the sequence?\n\n'+feedback(q);
 }else if(/evidence|citations?|transaction ids?|records?|select|document/i.test(lower)){
  opening='Evidence should be reproducible: include IDs, dates, amounts, direction, channels and counterparties. Select records that support and challenge your hypothesis, then note information gaps.';
 }else if(/fraud|ato|account takeover|mule|layering|pass.?through/i.test(lower)){
  opening='Look for changes in counterparties, funding origins, transfer pace, beneficiary details or device activity where recorded. Similar patterns can be legitimate; do not turn an alert into a confirmed fraud finding without corroboration.';
 }else if(/why|cause|red flag|alert|risk|investigat|review|pattern|compare|start|next|summari|baseline|profile|explain|recommend|help/i.test(lower)){
  opening='Begin with the trigger and expected activity. Trace the money chronologically, compare new and known counterparties, test a benign explanation, and document unexplained facts.';
 }else{
  opening='Tell me which decision or evidence you want to test. Start with customer baseline → triggering transactions → plausible alternatives → supported disposition.';
 }
 if(!a)return opening+'\n\nTo analyze actual fictional transaction IDs, open an investigation and check “Share fictional case”. I will not assume case data you have not chosen.\n\nLOCAL CASE COACH · Structured educational feedback, not generative AI.';
 const facts='\n\nATTACHED FICTIONAL CASE · '+plain(c.id)+
 (c.sector?'\nSector: '+plain(c.sector):'')+
 (c.expected?'\nExpected activity: '+plain(c.expected):'')+
 (c.trigger?'\nTrigger: '+plain(c.trigger):'')+
 '\nTransactions: '+a.tx.length+
 ' · Credits: '+a.credit.length+' / '+money(a.inTotal)+
 ' · Debits: '+a.debit.length+' / '+money(a.outTotal)+
 (a.methods?'\nPayment channels: '+a.methods:'')+
 (a.ordered.length?'\nPeriod: '+plain(a.ordered[0].date)+' to '+plain(a.ordered[a.ordered.length-1].date):'')+
 '\nDistinct counterparty labels: '+a.parties+
 (a.large.length?'\nLargest transactions (not automatically suspicious):\n'+a.large.map(record).join('\n'):'');
 return opening+facts+
 '\n\nNEXT CHECKS\n1. Compare observed money movement to the expected account purpose.'+
 '\n2. Trace the direction, timing and counterparties of the selected transactions.'+
 '\n3. Test a reasonable legitimate explanation and note missing records.'+
 '\n4. Document a neutral disposition and request training QA.'+
 '\n\nLOCAL CASE COACH · Structured educational feedback, not generative AI.';
}
window.AR_CASE_COACH=Object.freeze({respond,mode:'deterministic-case-coach',usesNetwork:false});
})();