/* Optional free generative AI. A small open-weight model runs entirely on the
   visitor's device with WebGPU. Model files download only after an explicit click.
   No API keys, no subscription, no customer data sent to any AI endpoint.
   Unsupported devices keep the structured case coach.
   WebLLM: https://github.com/mlc-ai/web-llm (Apache-2.0)
   Model: https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct
*/
(function(){
 'use strict';
 const modelId='SmolLM2-360M-Instruct-q4f16_1-MLC';
 let engine=null,loading=null;
 function supported(){
   return !!(typeof navigator!=='undefined'&&navigator.gpu&&typeof WebAssembly==='object');
 }
 async function capable(){
   if(!supported())return false;
   try{
     const adapter=await navigator.gpu.requestAdapter({powerPreference:'low-power'});
     return !!(adapter&&adapter.features&&adapter.features.has('shader-f16'));
   }catch{return false;}
 }
 async function load(report){
   if(engine)return engine;
   if(loading)return loading;
   if(!await capable())throw Error('This browser cannot run the free on-device language model. The local case coach remains available.');
   loading=(async()=>{
     if(typeof report==='function')report('Loading open-source AI library…',0);
     // A recognized, pinned official WebLLM CDN delivery path. Never loads at page startup.
     const webllm=await import('https://esm.run/@mlc-ai/web-llm@0.2.87');
     if(!webllm||typeof webllm.CreateMLCEngine!=='function')throw Error('The optional AI library is unavailable.');
     const catalog=webllm.prebuiltAppConfig?.model_list||[];
     if(!catalog.some(x=>x.model_id===modelId))throw Error('The small local AI model is not in the supported catalog.');
     if(typeof report==='function')report('Downloading free language model to this browser…',0);
     const e=await webllm.CreateMLCEngine(modelId,{
       initProgressCallback:(p)=>{
         const percent=Math.max(0,Math.min(100,Math.floor(Number(p.progress||0)*100)));
         if(typeof report==='function')report((p.text||'Preparing on-device model')+' · '+percent+'%',percent);
       }
     });
     engine=e;
     return engine;
   })();
   try{return await loading;}
   catch(err){engine=null;throw err;}
   finally{loading=null;}
 }
 async function generate(messages,shared){
   if(!engine)throw Error('On-device AI has not finished loading.');
   const sys='You are The Alert Room, a cautious educational AML and fraud investigation coach. Work only with fictional cases. Do not claim access to actual banking records, sanctions databases or private files. Distinguish observed facts from hypotheses, do not declare crimes or order SAR filings. When case data is included, cite exact synthetic transaction IDs and amounts; never invent IDs. Prefer concise actionable feedback, test benign explanations, note missing data. This is educational simulation, not professional legal or bank compliance advice.';
   const chat=[{role:'system',content:sys}];
   if(shared)chat.push({role:'system',content:'User expressly opted to share this FICTIONAL case snapshot, not real customer data:\n'+String(shared).slice(0,4800)});
   chat.push(...messages.slice(-6).map(x=>({role:x.role==='assistant'?'assistant':'user',content:String(x.content||'').slice(0,1800)})));
   const result=await engine.chat.completions.create({messages:chat,temperature:.3,top_p:.84,max_tokens:420});
   const answer=result?.choices?.[0]?.message?.content;
   if(typeof answer!=='string'||!answer.trim())throw Error('The local model did not generate an answer.');
   return answer.trim();
 }
 function stop(){try{engine?.interruptGenerate?.()}catch{}}
 function active(){return !!engine;}
 window.AR_FREE_AI=Object.freeze({modelId,supported,capable,load,generate,stop,active});
})();