
const {chromium}=require('playwright-core');
const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const BASE='http://127.0.0.1:8000/the-alert-room/';const OUT=path.join(__dirname,'../visual-qa');
fs.mkdirSync(OUT,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',args:['--no-sandbox']});const errors=[];
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
 page.on('pageerror',e=>errors.push('PAGE: '+e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push('CONSOLE: '+m.text())});
 try{
  await page.goto(BASE+'#home',{waitUntil:'networkidle'});
  await page.waitForSelector('.vi-hero h1',{timeout:25000});
  assert.match(await page.locator('.vi-hero h1').innerText(),/not\s+an answer/i);
  assert.ok(await page.locator('.signal-console .signal-ledger-row').count()>=3,'Authentic fictional case preview missing');
  assert.ok(await page.locator('.signal-console-action[href^="#case/"]').count()===1,'Case preview must open a real investigation');
  assert.ok(await page.locator('.nav-shell .ar-logo svg').count()===1,'Original Alert Room brand mark missing');
  assert.ok(await page.locator('a[href="#analyst"]').count()>=1,'Analyst access missing');
  assert.ok(await page.locator('.vi-steps button').count()===4,'Four narrative stages missing');
  assert.equal(await page.locator('.vi-route-list a').count(),3,'Three distinct work chapters must render');
  assert.ok(!(await page.locator('.vi-site').innerText()).includes('NaNNaN'),'Broken narrative concatenation');
  assert.equal(await page.locator('#ag-launcher:visible').count(),1,'Analyst launcher must be available on the homepage');
  assert.equal(await page.locator('.ag-drawer.is-open').count(),0,'Agent must not obstruct the homepage until requested');
  await page.locator('[data-vi-step="1"]').click();
  assert.match(await page.locator('#vi-current').innerText(),/Context changes everything|Who is this customer/i);
  await page.locator('[data-vi-step="2"]').click();
  assert.ok(await page.locator('.vi-ledger-row').count()>=3,'Ledger evidence absent from the story');
  await page.locator('[data-vi-step="3"]').click();
  await page.locator('[data-vi-choice="close"]').click();
  assert.match(await page.locator('.vi-explanation').innerText(),/Aligned with|reference outcome|rationale/i);
  await page.locator('[data-vi-step="0"]').click();
  await page.locator('#vi-play').click();
  assert.match(await page.locator('#vi-play').innerText(),/Pause/i);
  await page.locator('#vi-play').click();
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.screenshot({path:path.join(OUT,'01-home-desktop.jpg'),type:'jpeg',quality:72,fullPage:true,animations:'disabled'});
  // Skip link preserves the current route; routed content receives focus.
  await page.locator('.skip').focus();await page.keyboard.press('Enter');
  assert.match(page.url(),/#home$/);assert.equal(await page.locator('#main').evaluate(el=>el===document.activeElement),true);
  const promo=await page.locator('.vi-agent-grid h2').evaluate(el=>({color:getComputedStyle(el).color,background:getComputedStyle(el.closest('section')).backgroundColor}));
  assert.equal(promo.color,'rgb(248, 249, 251)','Analyst promo heading must remain readable on dark background');
  const pages=[
   ['learn','.learning-grid .learning-tile',6],
   ['quiz','.quiz-card',1],
   ['workspace','#queue-body tr[data-open-case]',10],
   ['story','.founder-letter article',1],
   ['feedback','#feedback-form',1],
   ['analyst','#analyst-root .ag-chat',1],
   ['privacy','.wrap',1]
  ];
  for(const [route,selector,min] of pages){await page.goto(BASE+'#'+route,{waitUntil:'networkidle'});await page.waitForSelector(selector,{timeout:12000});const n=await page.locator(selector).count();assert.ok(n>=min,route+': expected '+min+', found '+n);console.log('ROUTE_OK',route,'elements',n);}
  await page.goto(BASE+'#home',{waitUntil:'networkidle'});
  if(await page.locator('#analyst-drawer.is-open').count())await page.locator('#ag-close').click();
  await page.locator('#ag-launcher').click();
  await page.waitForSelector('#analyst-drawer.is-open',{timeout:10000});
  await page.waitForSelector('#analyst-input',{timeout:10000});
  assert.ok(await page.locator('#analyst-messages').isVisible(),'Interactive chat messages must be visible');
  await page.locator('.ag-site-guide summary').click();
  await page.locator('[data-site-guide="2"]').click();
  assert.match(await page.locator('#analyst-messages').innerText(),/PRACTICE GUIDE \/ PREWRITTEN/);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#ag-launcher').evaluate(el=>el===document.activeElement),true,'Escape returns focus');
  await page.locator('#ag-launcher').click();
  assert.ok(!(await page.locator('#analyst-messages').innerText()).includes('PREWRITTEN'),'Close must discard conversation');
  await page.locator('#ag-close').click();
  assert.equal(await page.locator('#analyst-drawer.is-open').count(),0,'Agent must close without route change');
  await page.locator('a[href="#analyst"]').first().click();
  await page.waitForSelector('#analyst-drawer.is-open');
  assert.match(page.url(),/#home$/,'Opening Analyst must not navigate away from current page');
  assert.equal(await page.locator('a[href="./resources.html"]').count(),0,'Official sources link should not appear in footer');
  assert.equal(await page.locator('a[href*="/issues"]').count(),0,'Public issue tracker should not appear in footer');
  await page.locator('.ag-quick [data-analyst-quick="0"]').click();
  assert.match(await page.locator('#analyst-input').inputValue(),/fictional AML alert|investigation/i,'Analyst quick topic did not populate question');
  const aiLibrary=await page.evaluate(async()=>{
    try {
      const lib=await Promise.race([
        import('https://esm.run/@mlc-ai/web-llm@0.2.85'),
        new Promise((_,reject)=>setTimeout(()=>reject(Error('Runtime CDN import timed out')),30000))
      ]);
      return {ok:typeof lib.CreateMLCEngine==='function',models:lib.prebuiltAppConfig?.model_list?.filter(m=>['Qwen2.5-0.5B-Instruct-q4f16_1-MLC','Qwen2.5-1.5B-Instruct-q4f16_1-MLC'].includes(m.model_id)).map(m=>m.model_id)||[]};
    } catch(e) { return {ok:false,error:String(e?.message||e)} }
  });
  console.log('ANALYST_RUNTIME_IMPORT',JSON.stringify(aiLibrary));
  assert.ok(aiLibrary.ok,'Genuine AI runtime could not import: '+JSON.stringify(aiLibrary));
  assert.equal(aiLibrary.models.length,2,'Both optional models must be registered in the runtime');
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.screenshot({path:path.join(OUT,'09-analyst-desktop.jpg'),type:'jpeg',quality:75,fullPage:true,animations:'disabled'});
  await page.goto(BASE+'#analyst/AR-3002',{waitUntil:'networkidle'});
  await page.waitForSelector('#analyst-drawer.is-open',{timeout:10000});
  await page.waitForSelector('#analyst-context-label:not([hidden])',{timeout:10000});
  assert.match(await page.locator('#analyst-context-label').innerText(),/AR-3002/);
  assert.equal(await page.locator('#analyst-attach').isChecked(),false,'Case data must be opt-in');
  await page.locator('#ag-close').click();
  await page.goto(BASE+'#workspace',{waitUntil:'networkidle'});
  await page.waitForSelector('#queue-pager');
  assert.equal(await page.locator('#queue-body tr[data-open-case]').count(),10,'Queue pagination should show ten alerts');
  await page.locator('[data-queue-step="1"]').click();
  assert.equal(await page.locator('#queue-body tr[data-open-case]').count(),10,'Next page should show ten alerts');
  await page.locator('#queue-search').fill('AR-3002');
  assert.equal(await page.locator('#queue-body tr[data-open-case]').count(),1,'Queue search must apply across all forty alerts');
  await page.locator('#queue-search').fill('');
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.screenshot({path:path.join(OUT,'02-workspace-desktop.jpg'),type:'jpeg',quality:75,fullPage:true,animations:'disabled'});
  await page.goto(BASE+'#case/AR-3002',{waitUntil:'networkidle'});
  assert.equal(await page.locator('.ops-case-steps a').count(),5,'All five investigation stages must be labeled and accessible');
  await page.locator('.ops-case-next').click();
  await page.waitForURL(/#case\/AR-3002\/ledger$/);
  await page.waitForFunction(()=>document.querySelector('.ops-case-stephead')?.textContent.includes('Transactions'),{timeout:10000});
  await page.goBack();
  await page.waitForURL(/#case\/AR-3002$/);
  await page.waitForFunction(()=>document.querySelector('.ops-case-stephead')?.textContent.includes('Customer & KYC'),{timeout:10000});
  assert.equal(await page.locator('.ops-case-stephead h2').evaluate(el=>el===document.activeElement),true,'Route must focus the current stage heading');
  assert.equal(await page.locator('[data-case-clock]').count(),1,'Every investigation must display a session timer');
  assert.match(await page.locator('.context-grid').first().innerText(),/account reference/i,'Masked fictional account context missing');
  await page.locator('[data-mark-reviewed="kyc"]').click();
  await page.locator('[data-case-tab="ledger"]').click();
  await page.waitForSelector('[data-evidence]');
  assert.equal(await page.locator('[data-evidence]').count(),24);
  const exportBtn=await page.locator('[data-export-ledger]').evaluate(el=>({background:getComputedStyle(el).backgroundColor,color:getComputedStyle(el).color}));
  assert.notEqual(exportBtn.background,'rgb(255, 255, 255)','Export button has invisible white-on-white styling');
  await page.waitForTimeout(1100);
  const activeBefore=await page.locator('[data-case-clock]').innerText();
  assert.notEqual(activeBefore,'00:00:00','Review clock should advance');
  await page.goto(BASE+'#learn',{waitUntil:'networkidle'});
  const savedMs=await page.evaluate(()=>JSON.parse(localStorage.getItem('tar-public-release-v1')).casework['AR-3002'].reviewMs);
  await page.waitForTimeout(1100);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('tar-public-release-v1')).casework['AR-3002'].reviewMs),savedMs,'Review clock pauses away from the case');
  await page.goto(BASE+'#case/AR-3002/ledger',{waitUntil:'networkidle'});
  const ids=[];
  for(let i=0;i<3;i++){const e=page.locator('[data-evidence]').nth(i);ids.push(await e.getAttribute('data-evidence'));await e.check();}
  assert.match(await page.locator('[data-case-status]').innerText(),/In progress/);
  assert.equal(await page.locator('[data-evidence-count]').innerText(),'3');
  assert.match(await page.locator('[data-case-status-summary]').innerText(),/In progress/);
  assert.ok(await page.locator('[data-case-evidence-check].checked').count()>0,'Case controls did not update after evidence selection');
  await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0)});
  await page.screenshot({path:path.join(OUT,'03-case-ledger.jpg'),type:'jpeg',quality:75,fullPage:true,animations:'disabled'});
  await page.locator('[data-mark-reviewed="ledger"]').click();
  await page.locator('[data-case-tab="workpaper"]').click();
  await page.waitForSelector('[data-case-field="context"]');
  await page.locator('[data-case-field="context"]').fill('This fictional event organizer has a customer baseline involving event ticket payments and supplier expenditure. I reviewed incoming P2P payments and compared them with known activity and possible legitimate explanations. Further documentation could change the conclusion.');
  await page.locator('[data-case-field="decision"]').selectOption('close');
  await page.locator('[data-case-field="narrative"]').fill('From October 1 through October 25, 2026, the account was reviewed for a weekend burst of payments. Transaction IDs '+ids.join(', ')+' demonstrate selected entries from the fictional ledger. Because the customer is an event organizer, the activity may be consistent with ticket collections and a documented venue expense. The assessment compares amounts, timing, counterparties, expected activity, and unresolved risk before recommending closure. The case should be closed based on the available fictional context.');
  await page.locator('#case-attest').check();
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('[data-submit-case]').click();
  await page.waitForURL(/#qa\/QA-/, {timeout:12000});
  await page.waitForSelector('.qa-score',{timeout:10000});assert.ok(await page.locator('.qa-score').count()>0,'QA score missing');
  const layout=await page.locator('.qa-score').evaluate(el=>{const ran=document.createRange();ran.selectNodeContents(el.firstChild);const score=ran.getBoundingClientRect(),tail=el.querySelector('small').getBoundingClientRect();return {scoreRight:score.right,tailLeft:tail.left}});
  assert.ok(layout.tailLeft>=layout.scoreRight-2,'QA denominator overlaps numerical score');
  assert.ok(await page.locator('[data-download-qa]').count()>0,'Exportable QA report missing');
  console.log('FULL_CASE_QA_OK',page.url(),'layout',JSON.stringify(layout));
  await page.evaluate(()=>{const toast=document.querySelector('#toast');if(toast)toast.hidden=true;window.scrollTo({top:0,behavior:'instant'})});
  await page.screenshot({path:path.join(OUT,'04-qa-report.jpg'),type:'jpeg',quality:76,fullPage:true,animations:'disabled'});
  const sidebar=await page.locator('.ops-global-nav').evaluate(el=>({width:el.getBoundingClientRect().width,scroll:el.scrollWidth}));
  assert.ok(sidebar.width>=200&&sidebar.scroll<=sidebar.width+2,'QA sidebar must contain its labels');
  const reportHash=page.url().split('#')[1];
  await page.goto(BASE+'#reviewer',{waitUntil:'networkidle'});
  await page.locator('[data-open-reviewer]').first().click();
  await page.waitForSelector('#review-form');
  const scores=[25,20,20,15,10,10];
  for(let i=0;i<6;i++)await page.locator('input[name="score'+i+'"]').fill(String(scores[i]));
  await page.locator('textarea[name="comments"]').fill('The fictional evidence IDs are traceable and the account profile provides a reasonable explanation. The analyst may improve the chronology with exact amounts and counterparties to strengthen the case conclusion.');
  await page.locator('#review-form button[type="submit"]').click();
  await page.waitForURL(/#qa\/QA-/);
  await page.waitForFunction(()=>document.querySelector('#view')?.textContent?.includes('Local reviewer feedback'),null,{timeout:10000});
  assert.match(await page.locator('#view').innerText(),/Local reviewer feedback/);
  console.log('MANUAL_REVIEW_OK',page.url());
  const mobile=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
  mobile.on('pageerror',e=>errors.push('MOBILE: '+e.message));
  await mobile.goto(BASE+'#home',{waitUntil:'networkidle'});
  await mobile.waitForSelector('.vi-hero h1',{timeout:12000});
  
  await mobile.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await mobile.screenshot({path:path.join(OUT,'05-home-mobile.jpg'),type:'jpeg',quality:70,fullPage:true,animations:'disabled'});
  const overflow=await mobile.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:window.innerWidth}));
  console.log('MOBILE_OVERFLOW',JSON.stringify(overflow));
  assert.ok(overflow.scroll<=overflow.viewport+4,'Unexpected horizontal mobile overflow');
  await mobile.locator('.nav-toggle').click();assert.ok(await mobile.locator('.top-links').isVisible());
  console.log('MOBILE_NAV_OK');
  if(await mobile.locator('#analyst-drawer.is-open').count())await mobile.locator('#ag-close').click();
  await mobile.locator('#ag-launcher').click();
  await mobile.waitForSelector('#analyst-drawer.is-open');
  const agentMobile=await mobile.evaluate(()=>({width:document.querySelector('#analyst-drawer').getBoundingClientRect().width,viewport:innerWidth}));
  assert.ok(Math.abs(agentMobile.width-agentMobile.viewport)<=2,'Agent must fill mobile viewport without overflow');
  await mobile.screenshot({path:path.join(OUT,'11-analyst-agent-mobile.jpg'),type:'jpeg',quality:75,fullPage:false,animations:'disabled'});
  assert.equal(await mobile.locator('#analyst-drawer').getAttribute('aria-modal'),'true');
  assert.equal(await mobile.locator('main').getAttribute('inert'),'');
  await mobile.keyboard.press('Escape');
  assert.equal(await mobile.locator('main').getAttribute('inert'),null);
  for(const [route,selector,file] of [['workspace','#ops-mobile-cards .ops-mobile-card','06-workspace-mobile.jpg'],['case/AR-3002','.case-tabs','07-case-mobile.jpg'],['qa','#qa-filter','08-qa-mobile.jpg'],['analyst','#analyst-root .ag-chat','10-analyst-mobile.jpg']]){
   await mobile.goto(BASE+'#'+route,{waitUntil:'networkidle'});
   await mobile.waitForSelector(selector,{timeout:10000});
   if(route==='workspace'){
    assert.equal(await mobile.locator('#ops-mobile-cards a.ops-mobile-card').count(),10,'Mobile queue must display ten tappable alert cards');
    assert.equal(await mobile.locator('.ops-mobile-card').first().evaluate(el=>getComputedStyle(el).display),'block','Mobile cases must be real cards, not a clipped table');
    assert.equal(await mobile.locator('.ops-queue-scroll').evaluate(el=>getComputedStyle(el).display),'none','Wide alert table should be hidden on narrow screens');
    assert.ok(await mobile.locator('.ops-mobile-card-footer').first().innerText().then(t=>t.includes('Open investigation')),'Each mobile card needs a clear action');
    const position=await mobile.locator('.console-main').evaluate(el=>el.getBoundingClientRect().left);
    assert.ok(position<=24,'Mobile workspace must not have a redundant left navigation rail: '+position);
   }
   const dim=await mobile.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:window.innerWidth}));
   if(dim.scroll>dim.viewport+4){const bad=await mobile.evaluate(()=>Array.from(document.querySelectorAll('body *')).map(el=>({node:el.tagName,cls:typeof el.className==='string'?el.className:'',right:Math.round(el.getBoundingClientRect().right),width:Math.round(el.getBoundingClientRect().width)})).filter(x=>x.right>window.innerWidth+6&&x.width>0).slice(0,14));console.log('OVERFLOW_ELEMENTS',route,JSON.stringify(bad));}
   assert.ok(dim.scroll<=dim.viewport+4,'Mobile horizontal overflow on '+route+': '+JSON.stringify(dim));
   await mobile.screenshot({path:path.join(OUT,file),type:'jpeg',quality:72,fullPage:true,animations:'disabled'});
   console.log('MOBILE_ROUTE_OK',route);
  }

  if(await mobile.locator('#analyst-drawer.is-open').count())await mobile.locator('#ag-close').click();
  // Complete casework and resubmission on a fresh 390px browser context.
  await mobile.goto(BASE+'#case/AR-3002',{waitUntil:'networkidle'});
  await mobile.locator('[data-mark-reviewed="kyc"]').click();
  await mobile.locator('.ops-case-next').click();
  const mids=[];for(let i=0;i<3;i++){const el=mobile.locator('[data-evidence]').nth(i);mids.push(await el.getAttribute('data-evidence'));await el.check();}
  assert.equal(await mobile.locator('[data-evidence-count]').innerText(),'3');
  await mobile.locator('[data-mark-reviewed="ledger"]').click();
  await mobile.locator('[data-case-tab="workpaper"]').click();
  await mobile.locator('[data-case-field="context"]').fill('The fictional customer is an event organizer. Compare expected ticket collections and venue expenses against the observed payment dates and counterparties; documents are not independently verified.');
  await mobile.locator('[data-case-field="decision"]').selectOption('rfi');
  await mobile.locator('[data-case-field="narrative"]').fill('Review of October 2026 payments, including '+mids.join(', ')+', identifies incoming ticket-sized credits and outgoing payments. The customer baseline supports an event explanation, but an event ledger and venue invoice remain unverified. Request these records to reconcile dates, amounts and beneficiaries before deciding whether closure is supported.');
  await mobile.locator('#case-attest').check();mobile.once('dialog',d=>d.accept());await mobile.locator('[data-submit-case]').click();
  await mobile.waitForURL(/#qa\/QA-/);await mobile.waitForSelector('.qa-score');
  await mobile.screenshot({path:path.join(OUT,'12-qa-report-mobile.jpg'),type:'jpeg',quality:80,fullPage:true});
  await mobile.locator('a[href="#case/AR-3002"]').first().click();
  await mobile.locator('[data-case-tab="workpaper"]').click();
  assert.match(await mobile.locator('[data-case-field="narrative"]').inputValue(),new RegExp(mids[0]));
  await mobile.locator('[data-case-field="rfi"]').fill('Obtain the event ledger and venue invoice, then reconcile them against the selected payment IDs.');
  await mobile.locator('#case-attest').check();mobile.once('dialog',d=>d.accept());await mobile.locator('[data-submit-case]').click();
  await mobile.waitForURL(/#qa\/QA-/);await mobile.waitForSelector('.qa-score');
  const submissions=await mobile.evaluate(()=>JSON.parse(localStorage.getItem('tar-public-release-v1')).submissions);
  assert.equal(submissions.length,2);assert.equal(submissions[1].cycle,2);
  console.log('MOBILE_SUBMISSION_REVISION_OK');
  const unsupported=await browser.newPage({viewport:{width:390,height:844}});
  await unsupported.addInitScript(()=>Object.defineProperty(navigator,'gpu',{get:()=>undefined,configurable:true}));
  await unsupported.goto(BASE+'#home',{waitUntil:'networkidle'});
  await unsupported.locator('#ag-launcher').click();
  await unsupported.locator('.ag-model-settings summary').click();
  await unsupported.locator('#analyst-model-button').click();
  await unsupported.waitForFunction(()=>document.querySelector('#analyst-load-status').textContent.includes('WebGPU is unavailable'));
  await unsupported.locator('.ag-site-guide summary').click();
  await unsupported.locator('[data-site-guide="0"]').click();
  assert.match(await unsupported.locator('#analyst-messages').innerText(),/PRACTICE GUIDE \/ PREWRITTEN/);
  await unsupported.screenshot({path:path.join(OUT,'13-analyst-fallback-mobile.jpg'),type:'jpeg',quality:80,fullPage:false});
  await unsupported.close();console.log('UNSUPPORTED_DEVICE_GUIDE_OK');
  assert.deepEqual(errors,[],'Browser errors: '+errors.join('; '));
  console.log('VISUAL_QA_PASS All routes, case submissions, QA, manual review and mobile navigation');
 }finally{await browser.close()}
})().catch(e=>{console.error('VISUAL_QA_FAIL',e.stack||e);process.exitCode=1});
