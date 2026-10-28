
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ctx=window.AR_PRODUCT||{},p=ctx.page||document.body.dataset.page||'index';
const panel=$('#assistant-panel'),shade=$('#assistant-overlay'),launcher=$('#assistant-launch'),close=$('#assistant-close');
const root=p==='assistant'?$('#assistant-page-content'):$('#assistant-panel-content');
if(!root)return;
const modelChoices=[
{id:'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',name:'Everyday · 1.5B (recommended)',memory:'A sizable first-time model download'},
{id:'Qwen2.5-3B-Instruct-q4f16_1-MLC',name:'Research · 3B',memory:'More device memory and download required'}
];
const suggestions=[['Investigate an alert','How do I investigate an AML alert?'],['Understand QA','What does QA do on this website?'],['Write a case narrative','What makes a good investigation narrative?'],['Learn KYC & EDD','What is the difference between CDD and EDD?']];
const sourceTopics=[
{words:['kyc','cdd','edd','due diligence','onboarding'],label:'Customer due diligence',text:'KYC identifies and verifies the customer. CDD helps understand the purpose of the relationship and expected activity. EDD involves proportionate additional checks where risk or uncertainty warrants it. Start with what the customer should normally do, then compare it with observed activity.',link:'learn.html?module=kyc'},
{words:['monitoring','transaction','velocity','structur','typolog','pass-through','money mule','layering'],label:'Transaction monitoring',text:'Begin with the rule trigger, then reconstruct transaction timing, amounts, directions and counterparties. Compare the pattern with the customer’s KYC baseline. Consider genuine business explanations before recommending closure, information gathering or escalation.',link:'learn.html?module=monitoring'},
{words:['sar','narrative','write','document','evidence','chronology'],label:'Investigation narrative',text:'A defensible case note records the trigger, the customer profile, the transaction period, dates, amounts, cited transaction IDs, supporting and contradicting evidence, and a reasoned recommended disposition. This website simulates narratives; it does not file any real SAR.',link:'workspace.html'},
{words:['qa','quality','review','rubric','score'],label:'Quality Assurance',text:'QA means Quality Assurance. On this website QA is a separate workstation. First, you investigate and submit in Workspace. Then QA scores the submitted work against six published criteria. Open a report to see feedback, or choose Reviewer Workstation to score the workpaper yourself and save actionable QA notes. It is educational, not professional bank QA.',link:'qa.html'},
{words:['fraud','account takeover','device','chargeback','dispute'],label:'Fraud investigations',text:'A suspected fraud event should be assessed with evidence such as authentication anomalies, beneficiary changes, confirmed customer communications and payment timing. Avoid inferring intent from a single signal; follow institution-specific protective and escalation procedures.',link:'learn.html'},
{words:['sanction','ofac','pep','screening'],label:'Sanctions & screening',text:'Screening generates possible matches, not determinations. Validate identity with permitted identifiers, disambiguate false positives and document the rationale. For live compliance obligations, consult current OFAC or relevant regulator guidance and bank policy.',link:'learn.html'},
{words:['quiz','question','study','lesson','academy','course'],label:'Academy help',text:'The Academy has six tracks and lessons, with practice questions. Read a topic, write a private exercise note, then use the Knowledge Check. Your completion is saved only in this browser.',link:'learn.html'},
{words:['progress','achievement','history','record'],label:'Your training progress',text:'The Progress page shows completed lessons, submitted cases, practice QA reports and quiz performance. It is saved locally in your browser, without login or cross-device sync.',link:'progress.html'}
];
const commands=[
{words:['open workspace','go to workspace','start an investigation','begin investigation','open the queue','find alerts','show alerts'],text:'I can take you to the 40-case investigation queue. There, search or filter alerts, open a customer and review evidence.',url:'workspace.html',label:'Open workspace'},
{words:['open qa','go to qa','open quality review','review my submission','quality desk'],text:'Quality Review is a separate place to inspect submitted workpapers and practice scoring them as a reviewer.',url:'qa.html',label:'Open QA workstation'},
{words:['open academy','show courses','open lessons','learn aml'],text:'Academy has dedicated lessons and knowledge checks. Pick a learning track to begin.',url:'learn.html',label:'Open Academy'},
{words:['open quiz','knowledge check','take quiz'],text:'You can test your understanding with ten applied questions and explanations.',url:'quiz.html',label:'Start knowledge check'},
{words:['go home','homepage','main page'],text:'The homepage explains the product and gives you a clear starting point.',url:'./',label:'Back to homepage'},
{words:['open progress','my progress'],text:'See your practice results on the local Progress page.',url:'progress.html',label:'Open Progress'}
];
const ROOT_SYSTEM=[
'You are Analyst, a practical and capable AML learning specialist in The Alert Room, an independent educational website.',
'Help with AML/BSA concepts, KYC/CDD/EDD, transaction monitoring, fraud, funds-flow investigation, SAR narrative structure, OFAC screening, data review, investigation standards and QA.',
'You also explain how The Alert Room works: Home (overview); Academy (six learning tracks, lessons and quizzes); Investigate (40 synthetic alerts with 24 transactions each); Quality Review (an automated 100-point educational rubric, report history and manually scored reviewer practice); Progress (browser local storage).',
'When giving website directions use those actual features; never claim to have clicked, submitted, filed or changed website state yourself.',
'Do not provide a final legal or SAR filing determination, pretend an alert proves crime, or invent unseen documents or transaction IDs.',
'Always consider plausible normal business explanations, unclear facts, evidence gaps and institution procedure. Distinguish fact from inference.',
'If a current law, limit or regulation is requested, explain you lack live regulator access and point to primary sources.',
'Do not ask for real bank customer data, actual SARs, or confidential account information.',
'Respond concisely with practical steps when helpful. Use only synthetic case data if the user explicitly enabled context.'
].join(' ');
let messages=[],engine=null,modelID=modelChoices[0].id,engineID='',engineLoad=null,busy=false,mode='guide',open=false,allowCase=false;
let lastFocus=null;
const query=new URLSearchParams(location.search),caseId=query.get('case')||'',caseObj=(ctx.cases||[]).find(x=>x.id===caseId);
function shell(){return `<div class="agent-chat-head"><div><b>Analyst AI</b><span style="display:block;margin-top:5px">AML help · Investigation coaching · Website navigation</span></div><span class="tag active" id="agent-state">GUIDE READY</span></div>
<div class="agent-messages" id="agent-messages" role="log" aria-label="AI conversation" aria-live="polite"></div>
<div class="agent-settings"><div class="model-status" id="agent-model-status">Site guide · Instant</div><div style="display:flex;align-items:center;gap:7px"><select id="agent-model" class="agent-model-select" aria-label="Select AI model">${modelChoices.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('')}</select><button type="button" id="agent-enable">Enable AI model</button><button type="button" id="agent-reset" aria-label="Clear chat">Clear</button></div></div>
${caseObj?`<div style="padding:10px 20px;border-top:1px solid #ededf4"><label class="check-label"><input type="checkbox" id="agent-case-context"> Include fictional case ${esc(caseId)} in AI questions</label></div>`:''}
<div class="agent-compose"><form id="agent-form"><textarea id="agent-input" rows="2" maxlength="3500" aria-label="Message Analyst" placeholder="Ask about an AML case, QA or the website…"></textarea><button type="submit" id="agent-submit" aria-label="Send message">↗</button></form><div class="agent-disclosure">Real AI requires a WebGPU-compatible device and large initial download. Guide mode answers common questions and navigates the site. Messages are not saved and clear when you exit. Fictional data only.</div></div>`}
function clear(){messages=[];allowCase=false;const box=$('#agent-case-context',root);if(box)box.checked=false;paint();}
function paint(){const target=$('#agent-messages',root);if(!target)return;if(!messages.length){target.innerHTML=`<div class="agent-welcome"><div class="welcome-icon">✦</div><h3>Ask better questions.</h3><p>I'm your guide to AML learning and this workspace. Activate a real AI model for free-form conversation on a supported device.</p><div class="prompt-chips">${suggestions.map((x,i)=>`<button type="button" data-prompt="${i}">${esc(x[0])}</button>`).join('')}</div></div>`}
else target.innerHTML=messages.map(m=>`<div class="agent-message ${m.role==='user'?'user':'assistant'}"><div class="agent-bubble">${esc(m.content)}${m.url?`<div style="margin-top:12px"><a href="${esc(m.url)}">${esc(m.label||'Open page')} ↗</a></div>`:''}</div></div>`).join('');
target.scrollTop=target.scrollHeight;
$$('[data-prompt]',root).forEach(b=>b.onclick=()=>{let text=suggestions[Number(b.dataset.prompt)][1];$('#agent-input',root).value=text;send(text);});}
function setStatus(text,type='guide'){const status=$('#agent-state',root),label=$('#agent-model-status',root),control=$('#agent-enable',root);if(status)status.textContent=type==='ready'?'AI READY':type==='loading'?'LOADING AI':type==='error'?'AI UNAVAILABLE':'GUIDE READY';if(label)label.textContent=text;if(control)control.textContent=type==='ready'?'✓ AI is ready':type==='loading'?'Preparing…':'Enable AI model';if(control)control.disabled=type==='loading'||busy;}
function add(role,content,extra={}){messages.push({role,content,...extra});if(messages.length>42)messages.splice(0,messages.length-42);paint();}
function guide(question){const q=question.toLowerCase().trim();for(const c of commands){if(c.words.some(w=>q.includes(w)))return {content:c.text,url:c.url,label:c.label}};
for(const s of sourceTopics){if(s.words.some(w=>q.includes(w)))return {content:s.text+'\n\nFor a longer, open-ended answer, enable the on-device AI model above.',url:s.link,label:'Open related page'}}
if(/^(hello|hi|hey|thanks|thank you)[!. ]*$/.test(q))return {content:'Hi. I can help you navigate the Academy, investigate fictional alerts, understand the QA workstation, or learn AML concepts. Ask a question or start a local AI model for free-form answers.'};
return {content:'I can navigate this website and answer common AML study questions immediately. For a free-form answer to this specific question, choose “Enable AI model.” It downloads a real language model to a compatible device; nothing is pretending to be live AI while it is disabled.'}}
function contextBlock(){if(!allowCase||!caseObj)return '';const c=caseObj;return JSON.stringify({caseId:c.id,customer:c.reference,occupation:c.sector,expected:c.expected,baseline:c.baseline,alert:c.trigger,transactions:c.transactions.slice(-12).map(t=>({id:t.id,date:t.date,direction:t.direction,amount:t.amount,party:t.counterparty}))})}
async function loadAI(){if(engine&&engineID===modelID){mode='ai';setStatus('Local generative AI · Ready','ready');return true}
if(!navigator.gpu){mode='guide';setStatus('WebGPU not available; guide mode is still ready.','error');return false}
if(engineLoad)return engineLoad;
const approval=window.confirm('A real language model may download 1 GB or more and use considerable device memory. No real bank data should be entered. Continue?');if(!approval)return false;
mode='loading';setStatus('Downloading and preparing the model…','loading');
engineLoad=(async()=>{try{
const lib=await import('https://esm.run/@mlc-ai/web-llm@0.2.85');
engine=await lib.CreateMLCEngine(modelID,{initProgressCallback:info=>{const label=String(info?.text||'Preparing model').slice(0,110);setStatus(label,'loading')}});
engineID=modelID;mode='ai';setStatus('On-device model ready · Private session','ready');return true;
}catch(err){console.error('Analyst AI could not load',err);engine=null;engineID='';mode='guide';setStatus('AI unavailable on this device. Site guide remains available.','error');return false}
finally{engineLoad=null}})();return engineLoad}
async function send(text){text=String(text||'').trim();if(!text||busy)return;const input=$('#agent-input',root);if(input)input.value='';add('user',text);
if(mode!=='ai'){const result=guide(text);add('assistant',result.content,result);return}
busy=true;setStatus('Analyst is preparing an answer…','ready');const pending={role:'assistant',content:'Thinking through the evidence…'};messages.push(pending);paint();
try{const chat=[{role:'system',content:ROOT_SYSTEM+(contextBlock()?'\nSynthetic case context (user opt-in): '+contextBlock():'')}];
messages.filter(m=>m!==pending).slice(-16).forEach(m=>chat.push({role:m.role,content:m.content}));
let response='';const stream=await engine.chat.completions.create({messages:chat,stream:true,max_tokens:850,temperature:.35});
for await(const piece of stream){const chunk=piece?.choices?.[0]?.delta?.content||'';if(chunk){response+=chunk;pending.content=response.slice(0,8000);paint()}}
if(!response)pending.content='The model did not return an answer. Try a narrower question.';
}catch(err){pending.content='This local AI session could not answer: '+String(err?.message||err).slice(0,140)+'. You can still use the instant website guide.';console.error(err)}
finally{busy=false;setStatus('On-device model ready','ready');paint()}}
function wire(){root.innerHTML=shell();paint();$('#agent-enable',root).onclick=()=>loadAI();
$('#agent-model',root).onchange=x=>{modelID=x.target.value;if(modelID!==engineID){mode='guide';setStatus('Model selection changed. Enable to start it.','guide')}};
$('#agent-reset',root).onclick=()=>{clear();setStatus(mode==='ai'?'On-device model ready':'Guide ready',mode==='ai'?'ready':'guide')};
$('#agent-form',root).onsubmit=x=>{x.preventDefault();const input=$('#agent-input',root);send(input.value)};
$('#agent-input',root).onkeydown=x=>{if(x.key==='Enter'&&!x.shiftKey&&!x.isComposing){x.preventDefault();$('#agent-form',root).requestSubmit()}};
if($('#agent-case-context',root))$('#agent-case-context',root).onchange=x=>{allowCase=x.target.checked;};
}
function show(){if(p==='assistant'){document.querySelector('#agent-input',root)?.focus();return}if(open)return;open=true;lastFocus=document.activeElement;panel.hidden=false;shade.hidden=false;launcher.setAttribute('aria-expanded','true');document.documentElement.style.overflow='hidden';wire();$('#agent-input',root)?.focus()}
function hide(){if(!open)return;open=false;clear();panel.hidden=true;shade.hidden=true;launcher.setAttribute('aria-expanded','false');document.documentElement.style.overflow='';if(lastFocus?.isConnected)lastFocus.focus();}
launcher?.addEventListener('click',show);close?.addEventListener('click',hide);shade?.addEventListener('click',hide);
document.addEventListener('keydown',evt=>{if(evt.key==='Escape'&&open){evt.preventDefault();hide()}});
window.addEventListener('pagehide',()=>{messages=[];if(open)hide()});
if(p==='assistant'){launcher.hidden=true;wire()}else{panel.hidden=true;shade.hidden=true;}
window.AR_AGENT={open:show,close:hide,clear,mode:()=>mode};
})();
