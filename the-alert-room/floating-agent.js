
/* Floating Analyst: a sitewide AI agent, not a separate destination.
   The chat/model is owned by analyst.js; this file owns access and focus. */
(()=>{"use strict";
let open=false,previousFocus=null,greetingTimer=0,lastCase="";
const $=(q,r=document)=>r.querySelector(q);
const launcher=$('#ag-launcher'),panel=$('#analyst-drawer'),closeButton=$('#ag-close'),greeting=$('#ag-greeting');
if(!launcher||!panel)return;
const parsedCase=()=>{const value=decodeURIComponent(location.hash.replace(/^#/,'')).split('/');return value[0]==='case'&&value[1]?value[1]:'';};
function greetingText(){
 const id=parsedCase(),el=$('#ag-greeting-text');
 if(!el)return;
 el.textContent=id?'Reviewing '+id+'? I can help you question the evidence.':'Have a question about AML, transactions or your case? Ask Analyst.';
}
function dismissGreeting(){
 clearTimeout(greetingTimer);greeting.classList.remove('is-visible');
 try{sessionStorage.setItem('ar-analyst-welcome-seen','1')}catch(e){}
}
function caseContext(id){
 const candidate=(window.AR_CASES||[]).find(x=>x.id===id);
 const current=candidate?.id||'';
 if(current!==lastCase){
  lastCase=current;
  window.AlertAnalyst?.setCaseContext?.(current);
 }
}
function syncModal(){
 const modal=open&&matchMedia('(max-width:640px)').matches;
 panel.setAttribute('aria-modal',String(modal));
 document.querySelectorAll('.nav-shell,main,.footer').forEach(el=>{if(modal)el.setAttribute('inert','');else el.removeAttribute('inert')});
 document.documentElement.style.overflow=modal?'hidden':'';
}
function openAgent(requestedCase){
 if(open){if(requestedCase)caseContext(requestedCase);return}
 previousFocus=document.activeElement;
 open=true;dismissGreeting();
 panel.classList.add('is-open');panel.removeAttribute('inert');panel.setAttribute('aria-hidden','false');
 launcher.setAttribute('aria-expanded','true');
 launcher.hidden=true;
 caseContext(requestedCase||parsedCase());
 syncModal();
 setTimeout(()=>{$('#analyst-input',panel)?.focus()},170);
}
function closeAgent(){
 if(!open)return;open=false;
 // Closing the drawer discards prior questions and model responses by design.
 window.AlertAnalyst?.clearConversation?.();
 panel.classList.remove('is-open');panel.setAttribute('aria-hidden','true');panel.setAttribute('inert','');
 launcher.hidden=false;launcher.setAttribute('aria-expanded','false');
 syncModal();
 if(previousFocus&&document.contains(previousFocus)){previousFocus.focus?.()}else launcher.focus();
}
launcher.addEventListener('click',()=>openAgent());
closeButton?.addEventListener('click',closeAgent);
greeting?.querySelector('[data-ag-dismiss]')?.addEventListener('click',dismissGreeting);
document.addEventListener('keydown',e=>{
 if(!open)return;
 if(e.key==='Escape'){e.preventDefault();closeAgent();return;}
 if(e.key==='Tab'&&matchMedia('(max-width:640px)').matches){
  const focusables=Array.from(panel.querySelectorAll('button:not([disabled]),textarea:not([disabled]),select:not([disabled]),a[href],summary,input:not([disabled])')).filter(x=>x.getClientRects().length);
  if(!focusables.length)return;
  const first=focusables[0],last=focusables[focusables.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
 }
});
document.addEventListener('click',e=>{
 const node=e.target.closest?.('a[href^="#analyst"],[data-open-analyst]');
 if(!node)return;
 e.preventDefault();
 const href=node.getAttribute('href')||'';
 const targeted=href.startsWith('#analyst/')?decodeURIComponent(href.slice('#analyst/'.length)).split('/')[0]:'';
 openAgent(targeted||parsedCase());
},true);
window.addEventListener('hashchange',()=>{
 const parts=decodeURIComponent(location.hash.replace(/^#/,'')).split('/');
 if(parts[0]==='analyst')openAgent(parts[1]||'');
 else{
  greetingText();
  if(open)caseContext(parsedCase());
 }
});
window.addEventListener('resize',syncModal);
document.addEventListener('DOMContentLoaded',()=>{
 greetingText();
 panel.setAttribute('inert','');
 const part=decodeURIComponent(location.hash.replace(/^#/,'')).split('/');
 if(part[0]==='analyst'){setTimeout(()=>openAgent(part[1]||''),180);return}
 let seen=false;try{seen=sessionStorage.getItem('ar-analyst-welcome-seen')==='1'}catch(e){}
 // The assistant opens only when requested. No unsolicited popup.
});
window.AlertRoomAgent={open:openAgent,close:closeAgent,isOpen:()=>open};
})();
