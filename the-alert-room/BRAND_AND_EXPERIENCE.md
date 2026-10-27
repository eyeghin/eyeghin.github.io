# The Alert Room — Brand & Experience Contract
Status: design reset, review branch only. Not a production launch.

## The idea
**An alert is a question. Judgment is the skill.**
The Alert Room is the place where aspiring financial-crime analysts learn to investigate, not memorize red flags. Its promise is free, evidence-led practice: review the customer, trace the activity, document the decision, and learn from QA. Erik Yeghinyan is its independent creator.

## The emotional story — in this exact order
1. **A signal appears.** A sparse, cinematic first frame. A single monitoring alert comes alive. Headline: "An alert is not an answer." Supporting line: "Learn to find out what the evidence really means." The only prominent CTA is "Investigate an alert." No academy metrics, AI pitch, rotating generic dashboards, or feature cards competing with this.
2. **The question unfolds.** The visitor explores one fictional alert with a short, animated sequence tied to actual synthetic ledger events. Reveal customer background, transaction evidence, and counterparty relationships one by one. Motion exposes meaning; it is never decoration.
3. **You make the call.** Let the visitor choose close, request information, or escalate. Explain uncertainty without auto-accusing the subject or claiming reporting was filed. This is the story's interactive climax.
4. **You have to defend it.** Show how an analyst's written assessment gets checked against a transparent training rubric. The homepage teaser must not misrepresent a simulated score as a genuine result.
5. **Why this exists.** Founder message: professional training is often expensive and inaccessible; skills deepen through practice. Explain independence and why the site is free. Simple personal authorship, no artificial brand hype.
6. **Enter the product.** Only now offer the Academy, Alert Workspace, QA Desk, and Analyst AI as clear entry points.

## Product navigation
Global: **Home · Learn · Investigate · QA · Analyst** with one primary CTA: **Open the workspace**.
Story and Feedback belong in the footer, not as equal calls to action in the hero.
No "Official sources" or "Public issue tracker" promotional links in the footer.
Workspace navigation is separate and oriented around authentic case tasks:
**Queue → Customer/KYC → Ledger → Counterparties → Workpaper → QA**.
Don't invent a remotely staffed QA team. Clearly distinguish automated simulation scoring, local reviewer practice, and real online human QA.

## One visual system, no more stacking
- Exactly **one primary font family** for headline, body, controls, and navigation: Inter (variable). Use weight, size, and tracking instead of mixing unrelated serif and geometric fonts. Monospace only where an exact transaction ID must be legible, and preferably from the system UI font.
- Brand colors: **Ink #08090D, Snow #F8F9FB, Signal #655BFF, Neutral #A4A6B2**. Semantic positive/negative states are allowed only inside investigative data, not decorative sections. Use opacity tints rather than inventing 300 different hex values.
- Core spacing on a single **8px grid**. Container max width 1440px, side gutters clamp(20px, 5vw, 80px). Major sections ~112–160px desktop separation, 64–96px mobile. Do not place different design systems or unrelated card aesthetics in one viewport.
- A content-first typographic scale with responsive clamps; all type is readable at 390px width.
- Motion has a causal relationship to understanding the signal: the activity appears, a funds-flow relationship forms, an evidence panel opens, and a decision reveals a rationale. No arbitrary spinning orbs, twinkling particle fields, gradient blobs, floating glass cards, parallax on all elements, or motion during typing.
- Animation duration: UI transitions 160–320ms, narrative scene transitions 500–900ms. Reduced-motion mode displays the identical narrative as static frames with working controls.
- Illustrations must **explain the data**, not pretend to be a screenshot of a real bank system. No fake metrics or marketing claims.
- Semantic accessible HTML, usable focus states, touch targets >=44px, tested desktop and 390px mobile.

## Content discipline
No hype phrases such as "next generation," "revolutionary," "cutting edge," or "AI powered" before visitors understand the product.
One clear headline per section, one supporting argument, one appropriate action.
Home is the **story**; Workspace is the **tool**; Academy is the **curriculum**; Analyst is optional **help**; QA is the **feedback**.
Write like an experienced analyst explaining why the work matters, not a fintech advertisement.

## Build gates (all required before any production merge)
1. Remove duplicate active CSS layers and replace with a single tokenized foundation plus scoped page modules. No global override wall and no large collections of `!important`.
2. Create a screenshot-reviewed desktop and mobile prototype on a separate branch. Verify the first viewport, narrative sections, navigation, responsive tables, forms, and accessible controls.
3. Run actual browser end-to-end tests for complete case submission, evidence IDs, QA scoring and revisions. Test Analyst startup honestly: runtime import ≠ successful inference on every device.
4. Review public copy for proper factual disclosures, no fake human QA claims or real SAR actions.
5. Do not call the work "perfect" or "ready for final publishing" without visual review, broken-link testing, privacy review, and explicit acceptance of the design.
6. **Do not modify the published main branch merely to try another visual direction.** Keep the current public site unchanged until there is a coherent approved concept.
