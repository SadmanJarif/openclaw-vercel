export default function handler(req, res) {
  res.status(200).json({ ok: true, service: 'openclaw-vercel', model: process.env.OPENROUTER_MODEL || 'openrouter/free', hasKey: Boolean(process.env.OPENROUTER_API_KEY), limits: 'OpenRouter free: 20 req/min, 50 req/day with no credits. Vercel Hobby: 10s function timeout.' });
}
