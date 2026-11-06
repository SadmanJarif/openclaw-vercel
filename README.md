# OpenClaw on Vercel — free with OpenRouter

Free stack, $0:
- **Vercel Hobby** — free, no card. Project: `openclaw-vercel`
- **OpenRouter `:free` models** — $0 per token, no card to sign up

## Honest limits
- OpenRouter free: **20 requests/min, 50 requests/day** if you've never bought credits. Buying $10 once (optional, credits never expire) raises it to 1,000/day.
- Vercel Hobby functions time out after **10 seconds** and are stateless. This deploys OpenClaw as on-demand chat + webhook (`/api/chat`, `/api/webhook`), **not** a 24/7 background agent that stays awake on Telegram.
- Use `openrouter/free` as the model — it routes to whatever free model is currently available, so you don't hard-code a model that later rotates out. Or set `OPENROUTER_MODEL` to e.g. `google/gemma-4-31b-it:free`.

## Setup (2 minutes)
1. Go to https://openrouter.ai/keys — sign up with GitHub/email, no card. Create a key, it starts `sk-or-v1-...`
2. In Vercel, project `openclaw-vercel` → Settings → Environment Variables → add:
   - `OPENROUTER_API_KEY` = your key
   - `OPENROUTER_MODEL` = `openrouter/free` (optional)
3. Redeploy. Open the site, check `/api/health` — `hasKey` should be `true`.

## Endpoints
- `GET /api/health` — status
- `POST /api/chat` — `{ messages: [{ role: "user", content: "..." }] }`
- `POST /api/webhook` — `{ text: "..." }`

## Local OpenClaw gateway
`openclaw.json` in this repo is the local gateway config pointing at OpenRouter (`baseUrl https://openrouter.ai/api/v1`, `apiKeyEnv OPENROUTER_API_KEY`). Run `openclaw onboard` locally and pick OpenRouter if you want the full gateway on your own machine.
