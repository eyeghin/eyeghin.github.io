# The Alert Room — GitHub-only multi-page training platform

A premium, independent, fictional AML casework and study environment. Creator: Erik Yeghinyan.

## Product architecture
- `index.html` — primary brand story and entry points
- `learn.html` / `lesson.html` — academy, module index, lesson exercises
- `quiz.html` — knowledge checks and explanations
- `workspace.html` — 40-case monitoring queue
- `case.html` — KYC, 24-entry transaction ledger, funds flow and workpaper
- `qa.html` — distinct QA review queue, educational scoring rubric
- `report.html` — scored report; `?mode=review` opens interactive QA reviewer practice with six manual scoring controls and narrative feedback
- `progress.html`, `assistant.html`, `about.html`, `privacy.html` — learning record, dedicated AI, mission and transparency

## Files
`product.css` holds the common design system; `product.js` handles fictional casework and learning; `agent.js` handles site guidance and optional local model interaction; `data.js` supplies 40 synthetic cases, courses and questions. Prior layered styles and scripts are retained in git history/legacy files but are **not loaded by the new pages**.

## How QA works
The learner reviews an alert and writes an original workpaper. Submission produces automated 100-point practice feedback across judgment, evidence, customer context, writing, chronology and next action. The QA reviewer workstation lets another learner/manual reviewer score the submitted case and write actionable comments locally. It is not independent professional bank QA or a regulatory finding.

## Analyst AI
The site guide works immediately (help with navigation and curated AML concepts). To answer arbitrary questions with generative AI, click **Enable AI model** and explicitly approve the substantial on-device download. Supported models include Qwen2.5 1.5B, Qwen2.5 3B and Qwen3 8B. This requires a browser with WebGPU and adequate GPU memory. Hosted AI is **not connected**, and successful real-model inference is not covered by the browser tests. Do not claim that a model is running before the user enables it. Conversations are ephemeral and cleared on exit/close.

## Privacy
Training cases and ledgers are fictional. Browser localStorage keeps drafts and educational results, without login or cloud sync. Never enter real bank data or actual SAR materials. No report is filed.

## Test
The GitHub Actions workflow `.github/workflows/alert-room-product-qa.yml` executes `product-browser-qa.cjs` with Chrome. It visits all pages, submits an example workpaper, evaluates QA and manual reviewer scores, checks instant site-agent responses and verifies desktop/mobile layouts. Screenshots are uploaded as a build artifact. No CI test currently downloads a multi-gigabyte language model.

## Run locally
From the repository root run `python3 -m http.server 8000` then open `http://localhost:8000/the-alert-room/`. A static server is needed for browser module loading and realistic navigation.

## Deployment
The production website is only updated when the approved branch is merged into the configured GitHub Pages source. Review PR screenshots and functionality before merging.
