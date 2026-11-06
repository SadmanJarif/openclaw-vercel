// POST /api/webhook  { text: "..." }  — simple webhook receiver for OpenClaw
// Vercel Hobby: 10s timeout, stateless. Good for on-demand replies, not 24/7 sessions.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ ok: true, usage: 'POST { text: "hello" }' });
  const text = req.body?.text || req.body?.message || '';
  if (!text) return res.status(400).json({ error: 'Send { text: "..." }' });
  const base = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;
  const r = await fetch(`${base}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content: text }] }) });
  const data = await r.json();
  return res.status(r.status).json(data);
}
