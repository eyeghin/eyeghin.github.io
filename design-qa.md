# Alert Room — current release QA
Date: October 31, 2026 (America/Los_Angeles)

## Current result
Visual and local workflow checks pass. **The requested live generative chat is not ready for production:** provider activation and a verified hosted deployment are outstanding. The public interface says live AI is unavailable and offers a separately labeled prewritten guide. It does not claim a successful answer.

## Owner correction and source truth
The owner rejected mixed colors, generic motion and a browser model-download/GPU confirmation. The subsequent explicit request retained a cinematic homepage alongside a fully designed investigation product. The earlier removal of all cinematic motion was an overcorrection; the implementation below supersedes it.
Source: /workspace/scratch/9c5e25d103a8/upload/IMG_2521.png.
This supersedes the earlier spatial-card sequence, forced welcome overlay and transitional static-only homepage.

## Implemented
- One ink navy / cool white / cobalt palette across public pages, the queue, casework and Analyst. Red/amber remain only for meaningful risk priority.
- Investigation desk with direct welcome, actual queue totals, segmented status filters, search, ten-row pagination and a clear continuation action.
- Preserved all 40 synthetic cases, seven case tabs, transaction dialog, assignment, evidence, narratives, QA, revision, local audit and review clock.
- Added a full-height cinematic case story: Signal → Context → Judgment. Centered “Welcome, AML analyst.” introduces the experience. Animated paths and payment markers use AR-3002 transaction/counterparty data, with pause and direct scene controls. Manual selection pauses playback. Reduced motion starts static; background/offscreen/route changes stop animation work.
- Preserved the functional Context / Activity / Judgment preview, and added preliminary Close / RFI / Escalate responses clearly separated from case resolution and QA.
- Unified Academy, course, lesson, quiz, progress, reviewer and founder typography/colors. Corrected inner-page navigation contrast and added a regression assertion. Removed approximately 20 KB of retired cinematic CSS and placed current cinema/public polish in cinematic-home.css.
- Replaced browser model inference with a hosted client. Removed models, GPU requirements, runtime/model downloads, device settings and native download confirmations.
- Chat supports bounded messages, explicit fictional-context opt-in, cancellation, safe text rendering, clear upstream errors and abort/clearing on close.
- Server implementation enforces exact origins, required rate limiting, actual request-byte bounds, allowed message roles, output bounds and upstream timeouts. Private runtime credentials are never a frontend configuration field.

## Evidence
Source commit: bb4296f9f880a0d0e54a7fbd5dd4cc96f5457345.
Successful CI: https://github.com/eyeghin/eyeghin.github.io/actions/runs/41240619471
Artifact: https://github.com/eyeghin/eyeghin.github.io/actions/runs/41240619471/artifacts/13057486142
CI files are materialized at /workspace/scratch/alert-room-cinema-qa/.
Desktop cinematic evidence: 20-cinema-context-desktop.jpg. The 01-home-desktop.jpg capture shows the case preview lower on the home page. Other evidence: 02-workspace-desktop.jpg, 03-case-ledger.jpg, 09-analyst-desktop.jpg.
Mobile evidence: 05-home-mobile.jpg, 06-workspace-mobile.jpg, 07-case-mobile.jpg, 13-analyst-fallback-mobile.jpg, 15-home-reduced-motion-mobile.jpg.
19-chat-transport-test.jpg shows a **mocked transport test**, not live generated inference.
Live browser inspection also verified Transactions and an attempted “Hi” with no download dialog; screenshot /workspace/scratch/EY-Investigation-System.jpg.

Combined source/implementation comparison: /workspace/scratch/alert-room-chat-comparison.jpg. It shows the owner's phone capture beside the revised desktop chat. These are different viewport/state captures, so it is a qualitative comparison of the setup barrier and palette, not pixel fidelity. Focused text and controls were inspected in the live browser and full-resolution captures.
CI desktop: 1440 × 900 CSS px, density 1; mobile: 390 × 844, density 1. Full-page captures extend vertically. No device frame was used for the mobile CI captures.

## Five visual surfaces
Typography: Inter is consistent throughout the active product; medium-weight hierarchy, compact ledger labels and readable chat body text. The founder letter keeps its readable editorial layout.
Spacing: persistent navy rail on desktop, contained central content, right workflow column and clearly grouped transaction controls. Mobile stacks the work areas and contains wide tables/tabs.
Colors: shared navy/cobalt tokens replace the old green accents. Founder text contrast is checked at >=4.5:1. Functional states use text as well as color.
Assets: cinematic paths, moving payment markers and counterparty labels derive from the synthetic ledger. No stock or generated dashboard artwork. The case preview and relationship graphic are native fictional data views. No private customer information is used.
Copy: no local-model promises, download/device setup, affiliation claims, certification or actual filing claims. Live AI unavailability and prewritten guidance are explicit.

## Latest cinematic verification
- Successful source-head CI runs all server boundary tests and desktop/390px case submission and revision journeys.
- Added direct scene/pause, reduced-motion static startup, preliminary disposition feedback, one-h1 and scene-control/launcher separation assertions.
- Reviewed full-resolution desktop cinema and 390px mobile captures, plus route captures for Academy, course, lesson, quiz, progress, reviewer and founder. Live public preview opens correctly at the source commit.
- Manual visual inspection found dark text on a dark Academy navigation surface; fixed the high-specificity inherited selector and guarded the expected light surface/navy ink across inner routes.

## Earlier iterations
- Initial new CI failed because a test listener for forbidden chat download dialogs remained attached and dismissed the later intentional case-submission confirmation. Scoped that listener to the chat assertion. Application behavior was unchanged.
- Final CI passes desktop investigation → narrative → training QA → reviewer practice, full 390px submission and revision, route focus, timer pause, evidence state, dialog behavior, mobile overflow and reduced motion.
- Hosted-chat tests mock the transport and cover rendering, HTML escaping, optional case context, upstream failure and clearing. Five server boundary tests pass. These do not establish live provider availability.
- Manual browser screenshots confirm matching queue/case/chat palettes and that sending a question never prompts for a model download.

## Blocking next actions
1. Complete owner-side provider activation.
2. Deploy and configure the hosted service with server-only credentials and enforced rate limits, then verify a real end-to-end response before setting the public endpoint.
3. Obtain owner visual acceptance before production merge. Physical-device/Safari/screen-reader QA remains broader release work.

final result: blocked
