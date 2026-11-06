// POST /api/chat  { messages: [{role, content}] }
// Uses OpenRouter free models. No key = clear error, no charge.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return res.status(500).json({ error: 'OPENROUTER_API_KEY is not set in Vercel. Add your free key from openrouter.ai/keys as an env var, then redeploy.' });
  const model = process.env.OPENROUTER_MODEL || 'openrouter/free';
  const { messages } = req.body || {};
  if (!Array.isArray(messages) || !messages.length) return res.status(400).json({ error: 'Send { messages: [{ role: "user", content: "..." }] }' });
  try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://openclaw-vercel.vercel.app',
        'X-Title': 'OpenClaw on Vercel'
      },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: 'You are OpenClaw, a helpful personal AI agent. Be concise and practical.' }, ...messages].slice(-20) })
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data?.error?.message || 'OpenRouter error', status: r.status });
    return res.status(200).json({ reply: data.choices?.[0]?.message?.content || '', model: data.model || model, usage: data.usage || null });
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}
