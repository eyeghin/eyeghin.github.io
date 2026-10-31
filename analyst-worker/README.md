# Hosted Analyst service

The frontend no longer downloads a model, requires WebGPU, asks visitors for keys or presents device settings. It sends messages to the configured HTTPS endpoint when that service is available. The prewritten practice guide remains separately labeled.

## Current release status

The server implementation and its mocked tests are ready. **Live generation is not active.** Live provider verification has not succeeded; owner-side service activation is required. No generated-answer claim is made in the public UI. The deployed endpoint is deliberately empty until a working hosted service is verified.

## Runtime requirements

- `OPENAI_API_KEY`: server secret, never source or browser configuration.
- `RATE_LIMITER`: Cloudflare rate-limit binding; the service fails closed if absent.
- `OPENAI_MODEL`: optional model override; defaults to `gpt-4.1-mini`.
- `ALLOWED_ORIGIN`: optional additional exact HTTPS origin. The GitHub Pages and review origins are included explicitly.

Deploy this Worker through an authorized Cloudflare runtime, configure its secret and rate-limit binding, and verify a real answer after API billing is active. Set only its public `/chat` address in `the-alert-room/analyst-config.js`. No visitor setup is required.

`node --test analyst-worker/server.test.mjs` checks origin restrictions, missing infrastructure, rate limits, request-size bounds, role validation, response extraction, secret isolation and upstream failure. Tests mock provider calls; they are not evidence that the hosted provider is available.

The service stores no conversation. Request context is fictional and explicitly opt-in; input is bounded, only user/assistant roles are accepted and generation is capped. CORS is a browser boundary, not authentication or a substitute for server rate limits. Configure provider spending limits before enabling public generation.
