# The Alert Room — motion and operational redesign

October 30, 2026, Los Angeles. This direction supersedes the previous generic landing-page treatment. The user rejected all three generated static options and requested a complete structural redesign, cinematic motion, and a separate investigation page informed by actual analyst platforms such as Unit21.

## Primary references

- Lusion: https://lusion.co/ — spatial visual storytelling, composed transitions and a continuous narrative. Inspiration for motion and pacing, not a claim of equivalent production resources or a clone of its proprietary work.
- Active Theory: https://activetheory.net/ — immersive interactive experiences and integrated design/development. Its current site requires JavaScript; only its public descriptions informed research.
- Unit21 Alerts overview: https://support.unit21.ai/hc/en-us/articles/6712819596564-Alerts-overview — public product documentation dated June 2, 2022. Public screenshot: https://support.unit21.ai/hc/article_attachments/6713223933460/Unit21-Alert-1.png . This is a historical public reference, not access to a current signed-in Unit21 account.
- Unit21 transaction monitoring: https://www.unit21.ai/products/aml-transaction-monitoring — current public product context.

## Structural changes

Public experience: a scroll-directed spatial ledger. The same synthetic case is introduced through signal, context and judgment, with camera movement through actual transaction records. Typography and a single editorial surface replace the previous split hero, decorative dashboard preview and alternating feature panels. A pause control and reduced-motion layout are retained. All visible payment values are taken from AR-3002, not invented statistics.

Investigation application: a persistent operations rail, compact alert summary, horizontal Overview / Transactions / Link analysis / Activity / Narrative / Notes / Audit trail tabs, and a contextual workflow rail. Search, queue segments, priority/status/rule filters, pagination, assignment to self, transaction detail, evidence, notes, narrative and QA are functional.

Link analysis is derived from the ledger and groups canonical counterparty names instead of treating a returning payer and a new beneficiary label for the same name as separate identities. Connections indicate transactions only, not ownership or wrongdoing. Table values remain accessible alongside the diagram.

## Implementation

`experience.css` is the sole active main-site stylesheet; prior visual layers remain in Git history/files but are not loaded. `floating-agent.css` is isolated to the optional Analyst component. `vision.js` owns the cinematic introduction and cleans up listeners/frames on route change. `frame.js` retains local data and educational review behavior.

The motion uses transforms of meaningful transaction UI in perspective, not generated artwork or a video substituted for a working interface. No large graphics dependencies or remote art assets are required. Reduced-motion mode removes continuous and scroll-directed animation. Operational route transitions are shorter than editorial transitions.

## Boundaries

Original Alert Room branding. No Unit21 logos, affiliation, bank access, real compliance system, external reviewer assignment, real SAR filing or all-device AI claims. All investigation data is synthetic. Assignment and audit history are browser-local practice features. No production merge without owner acceptance.

## October 31 owner-directed refinement
The owner liked the cinematic motion but requested richer colors and a centered animated “Welcome AML analyst” opening. Replaced the public narrative palette with midnight/porcelain/luminous blue. The founder page's old inline slate background clashed with its inherited text palette; rebuilt the page on warm paper and pale blue with navy type, medium-weight title, numbered letter chapters and a cobalt invitation. Kept operational casework intact. The welcome is brief, skippable, once per tab session, keyboard-contained and bypassed under reduced motion. This revision follows direct owner feedback rather than introducing another reference template.

## Latest correction — October 31
The owner rejected the mixed green/blue visual system, the forced cinematic treatment and the browser model-download dialog shown in IMG_2521.png. This supersedes the earlier welcome-overlay and spatial-ledger choices. Unified active surfaces to ink navy, cool white and cobalt. Made the investigation desk the primary destination; added actual queue totals and retained all review tools. Replaced the scroll-gated hero with a direct welcome, concise introduction and a functional three-section fictional case preview. Motion is limited to short entry and interaction transitions. Replaced the browser model runtime with a bounded hosted-chat client: no GPU requirement, downloads, model selectors or key prompts. Hosted generation is not available yet; public UI says so explicitly. The prewritten practice guide remains separately labeled. Live activation is a release blocker, not a successful AI inference claim.


## Current direction — cinematic homepage retained
The owner explicitly asked for the animated cinematic homepage and the rest of the product to be completed. Removing all cinematic motion was an overcorrection. The current version uses one navy/white/cobalt system and a full-height case-led Signal → Context → Judgment story. Native canvas paths and payment markers use AR-3002 counterparties and transaction totals; they represent recorded activity, not arbitrary particles or generated dashboard artwork. Centered welcome text, pause/direct scene controls, a static reduced-motion view and immediate investigation entry keep the experience usable. The working case preview adds a preliminary disposition response without implying real QA or case resolution.

Current styles are experience.css (foundation/operations), cinematic-home.css (cinema and public/learning surfaces) and floating-agent.css (Analyst). Removed retired film/spatial-ledger CSS instead of loading another obsolete animation layer. Academy, course, lesson, quiz, progress, reviewer and founder routes share the revised typography and palette. The inherited dark navigation surface on inner pages was corrected and is checked in browser QA.

Source bb4296f9f880a0d0e54a7fbd5dd4cc96f5457345 passes CI run 41240619471. Live hosted AI remains unavailable; provider activation, deployment and a real end-to-end answer are still required. No production merge without owner visual acceptance.
