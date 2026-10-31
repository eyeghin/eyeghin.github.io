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
