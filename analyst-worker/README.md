# Analyst — optional hosted AI service

This Cloudflare Worker is the secure backend needed to replace the browser-only small model with a capable hosted model. **It has not been deployed or connected to the public site.**

1. Create a Cloudflare Worker account, a Turnstile widget restricted to `eyeghin.github.io`, and an OpenAI API project with billing.
2. In the `analyst-worker/` directory run `npx wrangler deploy` using the owner's authenticated Cloudflare account.
3. Set encrypted secrets through `npx wrangler secret put OPENAI_API_KEY` and `npx wrangler secret put TURNSTILE_SECRET`. Never put either value into Git or public client files.
4. Configure the public Turnstile sitekey and deployed Worker `/chat` address in the front-end only after deployment, and validate the full production chat flow end to end.
5. Use the mandatory origin restriction, server-verified Turnstile token, rate-limit binding and request-length guard. Monitor costs and misuse; a rate limit is not a complete abuse-prevention strategy.

The old on-device Analyst model remains functional as a fallback. The site is static, so this backend is a separate deployment and is **not live simply because the Worker source exists in the repository**.
