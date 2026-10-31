# Design QA — Alert Room redesign
Date: 2026-10-30 (America/Los_Angeles)

## Scope and source truth
The user rejected the earlier generic design and all three image concepts, requested cinematic motion and a completely new layout, and named Unit21 as a reference for an analyst's working screen. This is an original redesign informed by that operational structure, not a pixel clone or a claim of Unit21 affiliation.

Source: Unit21's publicly published Alerts overview (2022), including its annotated case screenshot:
https://support.unit21.ai/hc/en-us/articles/6712819596564-Alerts-overview
https://support.unit21.ai/hc/article_attachments/6713223933460/Unit21-Alert-1.png
Motion research and the implementation direction are documented in the-alert-room/DESIGN_RESEARCH.md.

## Browser evidence
Source capture: /workspace/scratch/alert-room-reference-unit21.jpg
Rendered case: /workspace/scratch/EY-AlertRoom-Case-Final.jpg
Rendered home: /workspace/scratch/EY-AlertRoom-Home-Final.jpg
Rendered mobile: /workspace/scratch/EY-AlertRoom-Mobile-Final.jpg
Full-view combined comparison: /workspace/scratch/alert-room-case-comparison-final.jpg
Earlier combined comparison: /workspace/scratch/alert-room-case-comparison.jpg

The two desktop captures are 1363 × 936 pixels at density 1. The implementation includes a 48px preview toolbar; the app viewport is 1348 × 888 CSS px after the scrollbar. The source screenshot contains a 2022 desktop case, black surround and red explanatory annotations. The comparison scales both captures to fit equal 780px-wide columns. These are intentionally different brands and fictional customer content, so there is no pixel-difference score. The comparison checks the persistent rail, case header, tabbed investigation pane, and right workflow column. Mobile is an exact 390 × 888 CSS-pixel content crop, density 1, without the preview toolbar.

Focused inspection used the full-resolution case screenshot and live browser controls: case header, tab labels, customer details, workflow actions and transaction dialog. They remain readable at the original size; the comparison thumbnail is only composition evidence.

## Findings and iterations
- [P2, resolved] Secondary operational labels were too faint. Queue headers used #7d8a81 on a pale background. Unified small operational text to #53645a, strengthened amber priority text and lightened the rail's secondary labels. Post-fix browser computed inactive case-tab text is rgb(83, 100, 90); final case/mobile captures show the revised text.
- [P2, resolved] At the review browser's desktop height, the opening display title collided with the caption. Capped desktop type against both viewport width and height and moved its start to 20%. The final home capture shows clear space between the last title line and caption.
- No remaining actionable P0/P1/P2 differences against the intended operational structure were observed in the inspected states. This does not substitute for owner art-direction acceptance.

## Required fidelity surfaces
- Typography: Inter for controls and body; Barlow Condensed for the public narrative. Font weight and wrapping inspected live. The condensed public type is intentionally different from Unit21; operational labels use compact sans-serif.
- Spacing/layout: 184px rail, a central investigation pane and 255px workflow column on desktop. Customer summary sits above seven tabs. Mobile uses a single column, scrollable tabs, contained tables, and the workflow after the active investigation content.
- Colors/tokens: forest/ivory/orange public narrative; pale slate and white work surface with forest active states. Secondary label contrast corrected. Status uses words as well as color.
- Image quality: no generated product screenshots, stock dashboard pictures or borrowed logos. The moving homepage planes contain actual fictional ledger records. Link analysis is data-derived SVG with a full table alternative; it is a precise data visualization, not an image substitute.
- Copy/content: tabs and actions name actual tasks. Data is labeled synthetic; assignment and audit are local practice. Counterparty connections are not presented as proof of ownership or wrongdoing. Unsupported documentation and screening results are explicitly absent.

## Functional evidence
Browser QA passed on implementation commit 2c8273f93bc88c922102131003970ab7e9a4138e:
https://github.com/eyeghin/eyeghin.github.io/actions/runs/41171897699
The final CSS refinements are additionally checked by the final-source CI run recorded in PR #7.

Automated coverage includes desktop and 390px investigation → evidence → narrative → training QA, revision and resubmission, seven tabs, transaction dialog/Escape, assignment, case review clock pause, route/skip-link focus, mobile navigation/overflow, feedback draft/download, reduced motion, and unsupported WebGPU guidance.
Manual live-browser checks additionally verified counterparty drill-down: Camden Hale opens the ledger prefiltered to two matching records, transaction details, assignment and its audit event, desktop queue and case, and 390px customer overview.
Console inspection showed browser-extension metadata failures; no application-source failure was observed during these interactions.

## Limits and follow-up
- Owner must inspect the actual scrolling motion and desktop/mobile hierarchy before production merge.
- Real-time model inference has not been verified on a supported GPU in this browser. Optional AI remains experimental; the prewritten guide works without it.
- Browser-local state is not shared team case management. The deterministic educational rubric is not a professional approval or compliance certification.
- Safari, physical-device performance, screen-reader testing and 200% zoom need broader release QA; Chromium evidence alone does not establish universal accessibility.
- P3: collect real analyst feedback on density and review terminology after owner visual acceptance.

## Implementation checklist
- [x] Replace active shared design foundation and public page composition.
- [x] Implement seven-tab investigation with persistent desktop workflow.
- [x] Preserve 40 synthetic cases and complete QA practice cycle.
- [x] Inspect source and implementation together, fix contrast and title collision, recapture.
- [x] Keep the interactive working preview available for owner review.
- [ ] Obtain owner design acceptance before production merge.

final result: passed
