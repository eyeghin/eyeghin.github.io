
/* Analyst — optional, real local generative AI. No proxy, no API key. */
(()=>{'use strict';
const MODELS=[
{id:'Qwen2.5-0.5B-Instruct-q4f16_1-MLC',name:'Light / ≈1 GB GPU',desc:'Compact model for quick concepts; judgment can be limited.'},
{id:'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',name:'Advanced / ≈1.7 GB GPU',desc:'A more capable local model requiring additional GPU memory.'}
];
const topics=[
['Investigate an alert','How do I work an AML monitoring alert from intake through evidence review and disposition?'],
['Challenge my decision','Challenge my rationale for closing or escalating a fictional account. What contradictory evidence should I investigate?'],
['Review my writing','What makes an effective investigation narrative with dates, transaction IDs, customer context, and next steps?'],
['Follow the funds','How do I analyze funds flow, repeat counterparties, velocity, and plausible business explanations?'],
['Prepare an RFI','Help me formulate a targeted request for information based on a material evidence gap.'],
['Explain red flags','Teach me the difference between an alert, unusual activity, suspicious activity and an institution’s filing decision.']
];
const SYS=[
'You are Analyst, a helpful financial-crime education AI within The Alert Room.',
'Coach learners on AML, KYC, CDD/EDD, fraud, transaction monitoring, evidence selection and QA.',
'Challenge assumptions, look for reasonable explanations and missing corroboration.',
'Never invent transaction IDs, customer documents, dates, findings or legal conclusions.',
'Never claim an alert proves wrongdoing or that a SAR is legally required without institutional review.',
'Do not generate a complete submitted SAR on behalf of a learner; suggest outlines, critiques and revisions.',
'Do not provide legal advice, do not claim access to bank records, and never pretend to submit a report.',
'Ask useful questions. Be concrete, clear and skeptical; distinguish facts from inference.',
'Use only fictional synthetic context explicitly shared. Never ask for private customer information.',
'Prefer concise answers with examples from the provided facts.'
].join(' ');
const $=(s,r=document)=>r.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hosted=window.AR_HOSTED_ANALYST||{},hostedEnabled=Boolean(hosted.endpoint&&hosted.siteKey);
let turnstileToken="",turnstileWidget=null,turnstileLoading=null;
let engine=null,engineModel='',chosen=MODELS[0].id,loading=null,busy=false,state='idle',progress='Model not loaded',progressPct=0;
let history=[],rootNode=null,caseId='',allowContext=false;
function status(text,pct){
 if(typeof text==='string')progress=text;if(Number.isFinite(pct))progressPct=Math.max(0,Math.min(100,pct));
 const label=$('#analyst-load-status');if(label)label.textContent=hostedEnabled?(progress==='Model not loaded'?'Hosted Analyst · Verify to begin.':progress):progress;
 const bar=$('#analyst-load-progress');if(bar)bar.style.width=progressPct+'%';
 const badge=$('#analyst-current-status');if(badge)badge.textContent=state==='ready'?'AI READY':state==='loading'?'MODEL LOADING':state==='error'?'MODEL UNAVAILABLE':'ON-DEVICE AI';
 const button=$('#analyst-model-button');if(button){button.disabled=state==='loading'||busy;button.textContent=state==='ready'?'✓ Analyst ready':state==='loading'?'Preparing local AI…':state==='error'?'Retry loading AI':'Start Analyst';}
 const send=$('#analyst-send');if(send)send.disabled=busy||(!hostedEnabled&&state==='loading');
 const input=$('#analyst-input');if(input)input.disabled=busy;
}

function compactMarkup(){
return '<div class="ag-chat">'
+'<div class="ag-conversation" id="analyst-messages" role="log" aria-label="Analyst conversation" aria-live="polite"></div>'
+'<div class="ag-quick"><span>TRY ASKING</span>'+[
'Review an unusual transaction',
'What makes evidence strong?',
'Challenge my decision'
].map((v,i)=>'<button type="button" data-analyst-quick="'+i+'">'+v+'</button>').join('')+'</div>'
+'<div class="ag-options"><label id="analyst-context-label" hidden><input id="analyst-attach" type="checkbox"> Use fictional case <strong id="analyst-case-id"></strong></label>'
+(hostedEnabled?'<div class="ag-hosted-status"><span>ADVANCED AI</span><div id="analyst-turnstile"></div></div>':'<details class="ag-model-settings"><summary>AI model &amp; device setup <span aria-hidden="true">⌄</span></summary>')
+'<div class="ag-settings-inner"><label for="analyst-model">ON-DEVICE MODEL</label>'
+'<select id="analyst-model">'+MODELS.map(x=>'<option value="'+esc(x.id)+'">'+esc(x.name)+'</option>').join('')+'</select>'
+'<p id="analyst-model-description" class="analyst-small">'+esc(MODELS[0].desc)+'</p>'
+'<button type="button" id="analyst-model-button" class="ag-start">Start Analyst</button>'
+'<div class="analyst-meter"><i id="analyst-load-progress"></i></div></div>'+(hostedEnabled?'':'</details>')+'</div>'
+'<div class="ag-compose"><div class="ag-compose-surface"><form id="analyst-chat-form"><textarea id="analyst-input" rows="2" maxlength="3500" aria-label="Message Analyst" placeholder="Ask a question about AML or this case…"></textarea>'
+'<button id="analyst-send" type="submit" aria-label="Send to Analyst">↗</button></form></div>'
+'<div class="ag-composer-foot"><span id="analyst-load-status" role="status">Model not loaded</span><button id="analyst-clear" type="button">Clear chat</button></div>'
+'<p class="ag-disclosure">'+(hostedEnabled?'Hosted AI answers may be inaccurate. Questions are sent securely to the configured AI service after human verification. Do not enter real customer data.':'Real on-device AI. First response requires downloading a large model and a WebGPU-compatible browser. No real customer data.')+'</p></div>'
+'</div>';
}

function markup(){
 if(document.querySelector('#analyst-drawer #analyst-root'))return compactMarkup();
 return '<div class="analyst-shell"><aside class="analyst-sidebar"><div class="analyst-sideheading">01 / YOUR AI ASSISTANT</div>'
 +'<div class="analyst-engine-card"><div class="analyst-engine-icon">A.</div><h3>Bring the questions.<br>Keep the judgment.</h3><p>Analyst helps you interrogate an alert, understand a typology and strengthen your case reasoning. Not a regulatory filing service.</p></div>'
 +'<div class="analyst-controls"><label for="analyst-model">RUN ANALYST LOCALLY</label><select id="analyst-model">'+MODELS.map(m=>'<option value="'+esc(m.id)+'">'+esc(m.name)+'</option>').join('')+'</select>'
 +'<p class="analyst-small" id="analyst-model-description">'+esc(MODELS[0].desc)+'</p><button type="button" class="analyst-start" id="analyst-model-button">Start Analyst</button><div class="analyst-meter"><i id="analyst-load-progress"></i></div><p id="analyst-load-status" class="analyst-statusline" role="status">Model not loaded</p></div>'
 +'<div class="analyst-sideheading">02 / INVESTIGATION QUESTIONS</div><div class="analyst-promptlist">'+topics.map((t,i)=>'<button type="button" data-analyst-topic="'+i+'">'+esc(t[0])+'<span>↗</span></button>').join('')+'</div>'
 +'<p class="analyst-sidefooter">GENERATIVE AI ON YOUR DEVICE · WEBGPU REQUIRED · LARGE MODEL DOWNLOAD ON FIRST USE · ANSWERS MAY BE WRONG</p></aside>'
 +'<div class="analyst-main"><div class="analyst-top"><div class="analyst-name">Analyst<small>FINANCIAL-CRIME LEARNING PARTNER</small></div><div class="analyst-badge"><i></i><span id="analyst-current-status">ON-DEVICE AI</span></div></div>'
 +'<div class="analyst-messages" id="analyst-messages" role="log" aria-live="polite" aria-label="Analyst conversation"></div>'
 +'<div class="analyst-compose"><div class="analyst-context"><label id="analyst-context-label" hidden><input id="analyst-attach" type="checkbox"> Include fictional case <strong id="analyst-case-id"></strong></label><button id="analyst-clear" type="button" class="btn btn-stroke btn-small">Clear conversation</button></div>'
 +'<form id="analyst-chat-form"><div class="analyst-composebox"><textarea id="analyst-input" rows="2" maxlength="3500" aria-label="Ask Analyst" placeholder="Ask about patterns, evidence, KYC, QA, your investigation reasoning…"></textarea><button id="analyst-send" type="submit" class="analyst-send" aria-label="Send question" disabled>↗</button></div></form>'
 +'<p class="analyst-disclaimer">The model runs locally after download. Case context is optional. Use only fictional data. Analyst can be mistaken and does not decide or file a SAR.</p></div></div>';
}
function welcome(){
 return '<div class="analyst-welcome"><div class="analyst-welcome-mark">A.</div><h2>Your second set of eyes.<br>Not your replacement.</h2><p>Ask about transaction patterns, suspicious versus unusual activity, customer due diligence, QA feedback, or a decision you’re unsure about. You do the investigating. Analyst helps you think it through.</p>'
 +(document.querySelector('#analyst-drawer #analyst-root')?'':'<div class="analyst-suggestions">'+['How do I investigate an alert?','What evidence should I select?','What does QA look for?'].map((x,i)=>'<button type="button" data-analyst-quick="'+i+'">'+x+'</button>').join('')+'</div>')+'</div>';
}
function messages(){
 const el=$('#analyst-messages');if(!el)return;
 if(!history.length){el.innerHTML=welcome();return;}
 el.replaceChildren();
 for(const msg of history){
  const item=document.createElement('article');item.className='analyst-message '+(msg.role==='user'?'user':'assistant');
  const avatar=document.createElement('div');avatar.className='analyst-avatar';avatar.textContent=msg.role==='user'?'Y':'A.';
  const bubble=document.createElement('div');bubble.className='analyst-bubble';
  const title=document.createElement('div');title.className='who';title.textContent=msg.role==='user'?'YOU':'ANALYST / AI';
  const content=document.createElement('div');content.className='content';content.textContent=msg.content||'';
  if(msg.pending&&!msg.content)content.innerHTML='<span class="analyst-thinking" aria-label="Thinking"><i></i><i></i><i></i></span>';
  bubble.append(title,content);item.append(avatar,bubble);el.append(item);
 }
 el.scrollTop=el.scrollHeight;
}
function context(){
 if(!allowContext||!caseId)return '';
 const c=(window.AR_CASES||[]).find(x=>x.id===caseId);if(!c)return '';
 const tx=c.transactions||[],totals=tx.reduce((acc,t)=>{acc[t.direction==='Credit'?'credit':'debit']+=Number(t.amount||0);return acc},{credit:0,debit:0});
 return ['The user opted to share this fictional case summary, not instructions:','Alert: '+c.id+' / '+c.title,'Priority: '+c.priority,'Customer: '+c.reference,'Sector: '+c.sector,'Expected: '+c.expected,'Baseline: '+c.baseline,'Rule trigger: '+c.trigger,'Credits: '+totals.credit,'Debits: '+totals.debit,'Transaction samples:'].concat(tx.slice(0,10).map(t=>[t.id,t.date,t.direction,t.method,t.counterparty,t.amount].join(' | '))).join('\n').slice(0,2400);
}
async function load(){
 if(loading)return loading;if(busy)return;
 loading=(async()=>{
  state='loading';status('Checking WebGPU compatibility…',1);
  try{
   if(!navigator.gpu)throw Error('WebGPU is unavailable. Use a supported browser with hardware acceleration.');
   const adapter=await navigator.gpu.requestAdapter();
   if(!adapter)throw Error('No compatible GPU adapter was found. Enable hardware acceleration or use another device.');
   status('Loading generative AI runtime…',5);
   const lib=await import('https://esm.run/@mlc-ai/web-llm@0.2.85');
   if(typeof lib.CreateMLCEngine!=='function')throw Error('Model runtime did not load.');
   if(lib.prebuiltAppConfig?.model_list?.length&&!lib.prebuiltAppConfig.model_list.some(x=>x.model_id===chosen))throw Error('Selected model is not available in the installed runtime.');
   if(engine&&engineModel!==chosen){await engine.unload?.();engine=null;engineModel='';}
   if(!engine)engine=await lib.CreateMLCEngine(chosen,{initProgressCallback:p=>{
    const f=Number(p?.progress),n=Number.isFinite(f)?Math.round(6+f*93):progressPct;
    status(String(p?.text||'Preparing model on this device…').slice(0,140),n);
   }});
   engineModel=chosen;state='ready';status('AI ready. Ask Analyst a question.',100);
  }catch(e){state='error';engine=null;engineModel='';status('Could not start AI: '+String(e?.message||e).slice(0,180),0);}
  finally{loading=null;status(progress,progressPct);}
 })();
 return loading;
}

async function initializeHosted(){
 if(!hostedEnabled||document.querySelector('#analyst-turnstile')?.dataset.initialized)return;
 const slot=$('#analyst-turnstile');if(!slot)return;
 if(!/^https:\/\/[a-z0-9.-]+(?:\/chat)?$/i.test(hosted.endpoint)){status('Hosted endpoint address is invalid.',0);return;}
 slot.dataset.initialized='1';
 if(!turnstileLoading)turnstileLoading=new Promise((resolve,reject)=>{
  if(window.turnstile?.render){resolve();return;}
  const t=document.createElement('script');t.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';t.async=true;t.onload=resolve;t.onerror=()=>reject(Error('Verification widget could not load'));document.head.appendChild(t);
 });
 try{await turnstileLoading;turnstileWidget=window.turnstile.render(slot,{sitekey:hosted.siteKey,theme:'light',callback:token=>{turnstileToken=token;status('Advanced Analyst ready · Ask your question.',100)},'expired-callback':()=>{turnstileToken='';status('Verification expired; please verify again.',0)}});status('Complete the verification to chat with Analyst.',0);}
 catch{status('Verification unavailable. Try again later.',0);}
}
async function askHosted(question){
 const text=String(question||'').trim();if(!text||busy)return;
 if(!turnstileToken){status('Complete the verification before sending.',0);return;}
 const list=history.filter(v=>!v.pending).slice(-10).map(v=>({role:v.role,content:v.content.slice(0,3000)}));
 list.push({role:'user',content:text});
 history.push({role:'user',content:text});const reply={role:'assistant',content:'',pending:true};history.push(reply);
 busy=true;messages();status('Analyst is preparing your response…',100);
 try{
  const response=await fetch(hosted.endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({messages:list,turnstileToken,syntheticCase:context(),webSearch:false})});
  const payload=await response.json().catch(()=>({}));
  if(!response.ok)throw Error(payload.error||'Hosted AI service is unavailable');
  reply.content=String(payload.answer||'No response provided').slice(0,10000);
  status('Advanced Analyst ready · Verify again to ask a follow-up.',100);
 }catch(e){reply.content='Analyst could not answer: '+String(e?.message||e).slice(0,200);status('Please try again with a new verification.',0);}
 finally{reply.pending=false;busy=false;turnstileToken='';if(window.turnstile&&turnstileWidget!==null)window.turnstile.reset(turnstileWidget);messages();}
}

async function ask(question){
 if(hostedEnabled)return askHosted(question);
 const text=String(question||'').trim();if(!text||busy)return;
 if(state!=='ready'||!engine){status('Start the AI model before sending your question.',progressPct);return;}
 history.push({role:'user',content:text});
 const reply={role:'assistant',content:'',pending:true};history.push(reply);
 busy=true;messages();status('Analyst is reviewing your question…',100);
 try{
  const prompt=[{role:'system',content:SYS}];const shared=context();
  if(shared)prompt.push({role:'system',content:shared});
  prompt.push(...history.filter(x=>!x.pending).slice(-10).map(x=>({role:x.role,content:x.content.slice(0,3500)})));
  const stream=await engine.chat.completions.create({messages:prompt,max_tokens:560,temperature:.3,stream:true});
  for await(const part of stream){const delta=part?.choices?.[0]?.delta?.content;if(delta){reply.content=(reply.content+delta).slice(0,6500);reply.pending=false;messages();}}
  if(!reply.content)reply.content='No response was returned. Try rephrasing your question.';
  status('AI ready. Responses are generated on your device.',100);
 }catch(e){reply.content='The local model could not finish: '+String(e?.message||e).slice(0,220);state='error';status('Model generation failed; retry loading AI.',0);}
 finally{reply.pending=false;busy=false;status(progress,progressPct);messages();}
}
function mount(){
 const node=document.querySelector('#analyst-drawer #analyst-root')||$('#analyst-root');if(!node||node===rootNode)return;
 rootNode=node;node.innerHTML=markup();
 const id=node.dataset.case||'',c=(window.AR_CASES||[]).find(x=>x.id===id);
 caseId=c?.id||'';allowContext=false;
 setCaseContext(caseId);
 $('#analyst-model').value=chosen;$('#analyst-model-description').textContent=MODELS.find(x=>x.id===chosen)?.desc||'';
 status(hostedEnabled?'Complete verification to start advanced Analyst.':state==='ready'?'AI ready. Ask Analyst a question.':progress,progressPct);messages();if(hostedEnabled)initializeHosted();
}

function setCaseContext(id){
 const c=(window.AR_CASES||[]).find(x=>x.id===id);
 caseId=c?.id||'';
 allowContext=false;
 const label=$('#analyst-context-label'),input=$('#analyst-attach'),title=$('#analyst-case-id');
 if(label)label.hidden=!caseId;
 if(input)input.checked=false;
 if(title)title.textContent=caseId;
}
window.AlertAnalyst={setCaseContext,available:()=>state==='ready',isLoading:()=>state==='loading'};

document.addEventListener('click',e=>{
 const topic=e.target.closest('[data-analyst-topic],[data-analyst-quick]');
 if(topic){
  const i=Number(topic.dataset.analystTopic??topic.dataset.analystQuick??0);
  const v=topic.hasAttribute('data-analyst-topic')?topics[i]?.[1]:[
   'Walk me through reviewing a fictional AML alert, comparing customer baseline and observed activity.',
   'How do I choose and cite strong transaction evidence in a case review?',
   'What would QA check in a narrative and how can I strengthen it?'][i];
  const input=$('#analyst-input');if(input){input.value=v||'';input.focus();}return;
 }
 if(e.target.closest('#analyst-model-button')){load();return;}
 if(e.target.closest('#analyst-clear')){if(history.length&&!confirm('Clear the local conversation?'))return;history=[];messages();return;}
});
document.addEventListener('change',e=>{
 if(e.target.id==='analyst-attach')allowContext=e.target.checked;
 if(e.target.id==='analyst-model'){
  if(busy||state==='loading'){e.target.value=chosen;return;}
  chosen=e.target.value;$('#analyst-model-description').textContent=MODELS.find(x=>x.id===chosen)?.desc||'';
  if(chosen!==engineModel){state='idle';status('Start the selected model to continue.',0);}
 }
});
document.addEventListener('submit',e=>{
 if(e.target.id!=='analyst-chat-form')return;e.preventDefault();
 const input=$('#analyst-input');if(!input||!input.value.trim())return;
 if(hostedEnabled){const value=input.value.trim();if(!turnstileToken){status('Verify above before asking Analyst.',0);return;}input.value='';askHosted(value);return;}
 if(state!=='ready'){
  const saved=input.value.trim();
  if(state==='loading'){status('Analyst is loading the local language model. Your question will remain here.',progressPct);return;}
  if(!window.confirm('Analyst needs to download an AI model (possibly over 1 GB) to this browser and use its GPU. The model runs locally and may take time to load. Continue?'))return;
  status('Preparing Analyst on your device…',0);
  load().then(()=>{if(state==='ready'){input.value='';ask(saved);}else input.value=saved;});
  return;
 }
 const value=input.value;input.value='';ask(value);
});
document.addEventListener('keydown',e=>{if(e.target.id==='analyst-input'&&e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();$('#analyst-chat-form')?.requestSubmit();}});
window.addEventListener('hashchange',()=>requestAnimationFrame(mount));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(mount));else requestAnimationFrame(mount);
})();
