# Hosted Analyst service

The frontend no longer downloads a model, requires WebGPU, asks visitors for keys or presents device settings. It sends messages to the configured HTTPS endpoint when that service is available. The prewritten practice guide remains separately labeled.

## Current release status

The server implementation and its mocked tests are ready. **Live generation is not active.** Live provider verification has not succeeded; owner-side service activation is required. No generated-answer claim is made in the public UI. The deployed endpoint is deliberately empty until a working hosted service is verified.

## Runtime requirements

- `OPENAI_API_KEY`: server secret, never source or browser configuration.
- `RATE_LIMITER`: Cloudflare rate-limit binding; the service fails closed if absent.
- `OPENAI_MODEL`: optional model override; defaults to `gpt-4.1-mini`.
- `ALLOWED_ORIGIN`: optional additional exact HTTPS origin. The public GitHub Pages origin is included explicitly. Preview-host origins are intentionally excluded.

Deploy this Worker through an authorized Cloudflare runtime, configure its secret and rate-limit binding, verify the public Worker URL and HTTPS/TLS, and make a real end-to-end request after API billing is active. Apply an API spending cap and review abuse protection before enabling public chat. Set only its public `/chat` address in `the-alert-room/analyst-config.js`. No visitor setup is required.

`node --test analyst-worker/server.test.mjs` checks origin restrictions, missing infrastructure, rate limits, request-size bounds, role validation, response extraction, secret isolation and upstream failure. Tests mock provider calls; they are not evidence that the hosted provider is available.

The service stores no conversation. Request context is fictional and explicitly opt-in; input is bounded, only user/assistant roles are accepted and generation is capped. CORS is a browser boundary, not authentication or a substitute for server rate limits. Configure provider spending limits before enabling public generation.

## Publication gate

Public website identity: **The Alert Room**, at `https://eyeghin.github.io/the-alert-room/` (GitHub Pages HTTPS). Website deployment and an operational AI provider are separate releases. The branded website can be public while hosted generation remains clearly unavailable. Do **not** point the frontend at an unverified or third-party public proxy, and never add an API key, token or authorization header to the repository or browser code. The Worker accepts only exact approved production HTTPS origins and JSON requests and fails closed if the service secret or rate limiter is missing. Origin restrictions are a browser defense, not proof of user identity. Before switching live generation on, verify real provider output, deployment security, spending limits, and abuse protection.
