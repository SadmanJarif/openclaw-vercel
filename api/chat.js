// POST /api/chat  { messages, apiKey?, model?, system? }
// apiKey/model/system may come from the browser (saved in localStorage on the user's own device).
// If not provided, falls back to Vercel env OPENROUTER_API_KEY / OPENROUTER_MODEL.
// The browser key is used only for that request - it is never stored server-side or in the repo.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });
  const body = req.body || {};
  const key = body.apiKey || process.env.OPENROUTER_API_KEY;
  if (!key) return res.status(500).json({ error: 'No API key. Set it in Settings in the dashboard (saved in your browser), or set OPENROUTER_API_KEY in Vercel env vars.' });
  const model = body.model || process.env.OPENROUTER_MODEL || 'openrouter/free';
  const { messages } = body;
  if (!Array.isArray(messages) || !messages.length) return res.status(400).json({ error: 'Send { messages: [{ role: "user", content: "..." }] }' });
  const system = body.system || 'You are OpenClaw, a helpful personal AI agent. Be concise and practical.';
  try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://openclaw-vercel-sage.vercel.app',
        'X-Title': 'OpenClaw on Vercel'
      },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: system }, ...messages].slice(-20) })
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data?.error?.message || 'OpenRouter error', status: r.status });
    return res.status(200).json({ reply: data.choices?.[0]?.message?.content || '', model: data.model || model, usage: data.usage || null });
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}
