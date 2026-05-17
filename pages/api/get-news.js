import { Redis } from '@upstash/redis';

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export default async function handler(req, res) {
  try {
    const redis = getRedis();
    if (!redis) {
      return res.status(200).json({
        lastUpdated: null,
        sources: [],
        warning: 'Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN',
      });
    }

    const raw = await redis.get('news-data');
    if (!raw) return res.status(200).json({ lastUpdated: null, sources: [] });

    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return res.status(200).json({
      lastUpdated: data.lastUpdated || null,
      sources: Array.isArray(data.sources) ? data.sources : [],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
