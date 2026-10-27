
const {chromium}=require('playwright-core');
const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const BASE='http://127.0.0.1:8000/the-alert-room/';const OUT=path.join(__dirname,'../.qa-visual');
fs.mkdirSync(OUT,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',args:['--no-sandbox']});const errors=[];
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
 page.on('pageerror',e=>errors.push('PAGE: '+e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push('CONSOLE: '+m.text())});
 try{
  await page.goto(BASE+'#home',{waitUntil:'networkidle'});
  await page.waitForSelector('.p-hero h1',{timeout:25000});
  assert.match(await page.locator('.p-hero h1').innerText(),/answer key/i);
  await page.screenshot({path:path.join(OUT,'01-home-desktop.jpg'),type:'jpeg',quality:72,fullPage:true,animations:'disabled'});
  const pages=[
   ['learn','.learning-grid .learning-tile',6],
   ['quiz','.quiz-card',1],
   ['workspace','#queue-body tr[data-open-case]',40],
   ['story','.founder-letter article',1],
   ['feedback','#feedback-form',1],
   ['coach','#coach-result',1],
   ['privacy','.wrap',1]
  ];
  for(const [route,selector,min] of pages){await page.goto(BASE+'#'+route,{waitUntil:'networkidle'});await page.waitForSelector(selector,{timeout:12000});const n=await page.locator(selector).count();assert.ok(n>=min,route+': expected '+min+', found '+n);console.log('ROUTE_OK',route,'elements',n);}
  await page.goto(BASE+'#workspace',{waitUntil:'networkidle'});
  await page.screenshot({path:path.join(OUT,'02-workspace-desktop.jpg'),type:'jpeg',quality:75,fullPage:true,animations:'disabled'});
  await page.goto(BASE+'#case/AR-3002',{waitUntil:'networkidle'});
  await page.locator('[data-mark-reviewed="kyc"]').click();
  await page.locator('[data-case-tab="ledger"]').click();
  await page.waitForSelector('[data-evidence]');
  assert.equal(await page.locator('[data-evidence]').count(),24);
  const ids=[];
  for(let i=0;i<3;i++){const e=page.locator('[data-evidence]').nth(i);ids.push(await e.getAttribute('data-evidence'));await e.check();}
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
  assert.ok(await page.locator('.qa-score').count()>0,'QA score missing');
  console.log('FULL_CASE_QA_OK',page.url());
  await page.screenshot({path:path.join(OUT,'04-qa-report.jpg'),type:'jpeg',quality:76,fullPage:true,animations:'disabled'});
  const reportHash=page.url().split('#')[1];
  await page.goto(BASE+'#reviewer',{waitUntil:'networkidle'});
  await page.locator('[data-open-reviewer]').first().click();
  await page.waitForSelector('#review-form');
  const scores=[25,20,20,15,10,10];
  for(let i=0;i<6;i++)await page.locator('input[name="score'+i+'"]').fill(String(scores[i]));
  await page.locator('textarea[name="comments"]').fill('The fictional evidence IDs are traceable and the account profile provides a reasonable explanation. The analyst may improve the chronology with exact amounts and counterparties to strengthen the case conclusion.');
  await page.locator('#review-form button[type="submit"]').click();
  await page.waitForURL(/#qa\/QA-/);
  assert.match(await page.locator('#view').innerText(),/Local reviewer feedback/);
  console.log('MANUAL_REVIEW_OK',page.url());
  const mobile=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
  mobile.on('pageerror',e=>errors.push('MOBILE: '+e.message));
  await mobile.goto(BASE+'#home',{waitUntil:'networkidle'});
  await mobile.waitForSelector('.p-hero h1');
  await mobile.screenshot({path:path.join(OUT,'05-home-mobile.jpg'),type:'jpeg',quality:70,fullPage:true,animations:'disabled'});
  const overflow=await mobile.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:window.innerWidth}));
  console.log('MOBILE_OVERFLOW',JSON.stringify(overflow));
  assert.ok(overflow.scroll<=overflow.viewport+4,'Unexpected horizontal mobile overflow');
  await mobile.locator('.nav-toggle').click();assert.ok(await mobile.locator('.top-links').isVisible());
  console.log('MOBILE_NAV_OK');
  assert.deepEqual(errors,[],'Browser errors: '+errors.join('; '));
  console.log('VISUAL_QA_PASS All routes, case submissions, QA, manual review and mobile navigation');
 }finally{await browser.close()}
})().catch(e=>{console.error('VISUAL_QA_FAIL',e.stack||e);process.exitCode=1});
