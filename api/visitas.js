// Contador de visitas da DARO Tech / DARO Games
// Usa o Upstash Redis conectado ao projeto no Vercel (Storage → Upstash for Redis).
// GET /api/visitas        → soma 1 e devolve o total
// GET /api/visitas?ver=1  → só devolve o total
export default async function handler(req, res) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  res.setHeader('Cache-Control', 'no-store');
  if (!url || !token) return res.status(503).json({ erro: 'contador não configurado' });
  const so_ver = req.query && (req.query.ver === '1');
  const cmd = so_ver ? ['GET', 'darotech:visitas'] : ['INCR', 'darotech:visitas'];
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(cmd),
    });
    const j = await r.json();
    return res.status(200).json({ visitas: Number(j.result || 0) });
  } catch (e) {
    return res.status(500).json({ erro: 'falha no contador' });
  }
}
