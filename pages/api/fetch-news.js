import axios from 'axios';
import xml2js from 'xml2js';
import { Redis } from '@upstash/redis';

const SOURCES = [
  {
    country: 'my',
    flag: '🇺🇸',
    name: 'Tổng Lãnh sự quán Hoa Kỳ tại TP.HCM',
    color: '#b22234',
    feeds: ['https://vn.usembassy.gov/feed/', 'https://vn.usembassy.gov/category/press-releases/feed/'],
    fallback: ['https://news.google.com/rss/search?q=%22US%20Consulate%22%20%22Ho%20Chi%20Minh%22%20visa&hl=vi&gl=VN&ceid=VN:vi'],
  },
  {
    country: 'nhat',
    flag: '🇯🇵',
    name: 'Tổng Lãnh sự quán Nhật Bản tại TP.HCM',
    color: '#bc002d',
    feeds: ['https://www.hcmcgj.vn.emb-japan.go.jp/itpr_vi/rss.xml', 'https://www.vn.emb-japan.go.jp/itpr_vi/rss.xml'],
    fallback: ['https://news.google.com/rss/search?q=%22L%C3%A3nh%20s%E1%BB%B1%20qu%C3%A1n%20Nh%E1%BA%ADt%22%20TP.HCM&hl=vi&gl=VN&ceid=VN:vi'],
  },
  {
    country: 'han',
    flag: '🇰🇷',
    name: 'Tổng Lãnh sự quán Hàn Quốc tại TP.HCM',
    color: '#003478',
    feeds: ['https://overseas.mofa.go.kr/vn-hcm-vi/brd/m_22628/rss.do', 'https://overseas.mofa.go.kr/vn-vi/brd/m_2203/rss.do'],
    fallback: ['https://news.google.com/rss/search?q=%22L%C3%A3nh%20s%E1%BB%B1%20qu%C3%A1n%20H%C3%A0n%20Qu%E1%BB%91c%22%20TP.HCM&hl=vi&gl=VN&ceid=VN:vi'],
  },
  {
    country: 'kvac',
    flag: '🇰🇷',
    name: 'Trung tâm Đăng ký Visa Hàn Quốc tại TP.HCM',
    color: '#0047ab',
    feeds: ['https://www.kvachcm.or.kr/rss/rss.do'],
    fallback: ['https://news.google.com/rss/search?q=KVAC%20Ho%20Chi%20Minh%20visa&hl=vi&gl=VN&ceid=VN:vi'],
  },
  {
    country: 'uc',
    flag: '🇦🇺',
    name: 'Tổng Lãnh sự quán Úc tại TP.HCM',
    color: '#012169',
    feeds: ['https://vietnam.embassy.gov.au/hnoi/rss.xml', 'https://www.dfat.gov.au/feeds/news.xml'],
    fallback: ['https://news.google.com/rss/search?q=%22Australia%20Consulate%22%20%22Ho%20Chi%20Minh%22%20visa&hl=vi&gl=VN&ceid=VN:vi'],
  },
  {
    country: 'canada',
    flag: '🇨🇦',
    name: 'Tổng Lãnh sự quán Canada tại TP.HCM',
    color: '#d80621',
    feeds: ['https://www.canada.ca/en/news.atom'],
    fallback: ['https://news.google.com/rss/search?q=%22Canada%20Consulate%22%20%22Ho%20Chi%20Minh%22%20visa&hl=vi&gl=VN&ceid=VN:vi'],
  },
  {
    country: 'daiLoan',
    flag: '🇹🇼',
    name: 'Văn phòng Kinh tế và Văn hóa Đài Bắc tại TP.HCM',
    color: '#003f87',
    feeds: ['https://www.roc-taiwan.org/vn_hcmc/rss/rss.xml'],
    fallback: ['https://news.google.com/rss/search?q=%22Taipei%20Economic%20and%20Cultural%20Office%22%20%22Ho%20Chi%20Minh%22%20visa&hl=vi&gl=VN&ceid=VN:vi'],
  },
];

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function isAuthorized(req) {
  if (!process.env.CRON_SECRET) return true;
  const headerSecret = req.headers['x-cron-secret'];
  const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  return headerSecret === process.env.CRON_SECRET || bearer === process.env.CRON_SECRET;
}

function normalizeLink(link) {
  if (!link) return '';
  if (Array.isArray(link)) return normalizeLink(link[0]);
  if (typeof link === 'object') return link.href || link._ || '';
  return String(link);
}

function normalizeText(value) {
  if (!value) return '';
  if (typeof value === 'object') return value._ || value['#text'] || '';
  return String(value);
}

async function parseFeed(url) {
  try {
    const response = await axios.get(url, {
      timeout: 12000,
      headers: {
        Accept: 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*',
        'User-Agent': 'ConsulateNewsBot/2.0 (+https://vercel.app)',
      },
    });
    const parsed = await xml2js.parseStringPromise(response.data, {
      explicitArray: false,
      mergeAttrs: true,
      trim: true,
    });
    const items = parsed?.rss?.channel?.item || parsed?.feed?.entry || [];
    const list = Array.isArray(items) ? items : [items];

    return list
      .map((item) => ({
        title: normalizeText(item.title).trim(),
        url: normalizeLink(item.link) || normalizeLink(item.guid),
        date: normalizeText(item.pubDate || item.published || item.updated) || new Date().toISOString(),
        description: normalizeText(item.description || item.summary).trim(),
      }))
      .filter((item) => item.title && item.url);
  } catch (error) {
    console.warn(`Feed failed: ${url}`, error.message);
    return [];
  }
}

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const redis = getRedis();
  if (!redis) {
    return res.status(500).json({
      error: 'Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN',
    });
  }

  try {
    const results = [];

    for (const source of SOURCES) {
      let articles = [];
      for (const feedUrl of source.feeds) {
        articles = articles.concat(await parseFeed(feedUrl));
      }
      if (articles.length === 0) {
        for (const feedUrl of source.fallback || []) {
          articles = articles.concat(await parseFeed(feedUrl));
        }
      }

      const seen = new Set();
      articles = articles
        .filter((article) => {
          const key = article.url || article.title;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 20);

      results.push({
        country: source.country,
        flag: source.flag,
        name: source.name,
        color: source.color,
        articles,
        updatedAt: new Date().toISOString(),
      });
    }

    const data = { lastUpdated: new Date().toISOString(), sources: results };
    await redis.set('news-data', JSON.stringify(data));

    return res.status(200).json({
      success: true,
      total: results.reduce((sum, source) => sum + source.articles.length, 0),
      sources: results.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
