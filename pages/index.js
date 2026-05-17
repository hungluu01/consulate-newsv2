import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';

const STORAGE_KEY = 'consulate_news_read';
const SEEN_KEY = 'consulate_news_seen';

const TEXT = {
  vi: {
    title: 'Kênh Cập Nhật Tin Tức Visa',
    eyebrow: 'Nguồn chính thống',
    subtitle: 'Theo dõi thông báo visa, lãnh sự và tin tức từ các cơ quan ngoại giao tại Việt Nam.',
    search: 'Tìm theo tiêu đề, nguồn hoặc quốc gia...',
    update: 'Cập nhật',
    updating: 'Đang cập nhật',
    all: 'Tất cả',
    articles: 'bài',
    sources: 'nguồn',
    unread: 'chưa đọc',
    lastUpdated: 'Cập nhật lần cuối',
    markAllRead: 'Đánh dấu đã xem',
    read: 'Đã đọc',
    new: 'Mới',
    noData: 'Chưa có dữ liệu tin tức',
    noDataSub: 'Bấm Cập nhật để tải tin từ các nguồn đã cấu hình.',
    noResult: 'Không tìm thấy tin phù hợp',
    loading: 'Đang tải dữ liệu...',
    official: 'Nguồn',
    footer: 'Tự động cập nhật hằng ngày lúc 7:00 sáng theo cấu hình Vercel Cron.',
    connectionError: 'Không thể kết nối máy chủ',
    open: 'Mở tin',
  },
  en: {
    title: 'Visa News Monitor',
    eyebrow: 'Official sources',
    subtitle: 'Track visa, consular and diplomatic updates from foreign missions in Vietnam.',
    search: 'Search by title, source or country...',
    update: 'Update',
    updating: 'Updating',
    all: 'All',
    articles: 'articles',
    sources: 'sources',
    unread: 'unread',
    lastUpdated: 'Last updated',
    markAllRead: 'Mark all seen',
    read: 'Read',
    new: 'New',
    noData: 'No news data yet',
    noDataSub: 'Press Update to load news from configured sources.',
    noResult: 'No matching articles',
    loading: 'Loading data...',
    official: 'Source',
    footer: 'Auto-updates daily at 7:00 AM via Vercel Cron.',
    connectionError: 'Cannot connect to server',
    open: 'Open',
  },
};

const COUNTRY_LABELS = {
  my: { vi: 'Mỹ', en: 'USA' },
  nhat: { vi: 'Nhật Bản', en: 'Japan' },
  han: { vi: 'Hàn Quốc', en: 'Korea' },
  kvac: { vi: 'KVAC', en: 'KVAC' },
  uc: { vi: 'Úc', en: 'Australia' },
  canada: { vi: 'Canada', en: 'Canada' },
  daiLoan: { vi: 'Đài Loan', en: 'Taiwan' },
};

function readStoredSet(key) {
  if (typeof window === 'undefined') return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(key) || '[]'));
  } catch {
    return new Set();
  }
}

function saveStoredSet(key, value) {
  localStorage.setItem(key, JSON.stringify([...value]));
}

function formatDate(value, withTime = false) {
  if (!value) return '';
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    }).format(new Date(value));
  } catch {
    return '';
  }
}

function getArticleId(article) {
  return article.url || article.title || '';
}

export default function Home() {
  const [lang, setLang] = useState('vi');
  const [data, setData] = useState({ lastUpdated: null, sources: [] });
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [activeCountry, setActiveCountry] = useState('all');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [readSet, setReadSet] = useState(new Set());
  const [seenSet, setSeenSet] = useState(new Set());

  const t = TEXT[lang];

  useEffect(() => {
    setReadSet(readStoredSet(STORAGE_KEY));
    setSeenSet(readStoredSet(SEEN_KEY));
    const savedLang = localStorage.getItem('consulate_news_lang');
    if (savedLang === 'vi' || savedLang === 'en') setLang(savedLang);
    loadNews();
  }, []);

  async function loadNews() {
    setLoading(true);
    try {
      const res = await fetch('/api/get-news');
      const json = await res.json();
      setData({
        lastUpdated: json.lastUpdated || null,
        sources: Array.isArray(json.sources) ? json.sources : [],
      });
    } catch {
      setMessage(t.connectionError);
    } finally {
      setLoading(false);
    }
  }

  async function triggerFetch() {
    setFetching(true);
    setMessage(t.updating + '...');
    try {
      const res = await fetch('/api/fetch-news', {
        method: 'POST',
        headers: { 'x-cron-secret': process.env.NEXT_PUBLIC_CRON_SECRET || '' },
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || t.connectionError);
      setMessage(`${json.total} ${t.articles} đã được cập nhật`);
      await loadNews();
    } catch (error) {
      setMessage(error.message || t.connectionError);
    } finally {
      setFetching(false);
      setTimeout(() => setMessage(''), 4200);
    }
  }

  function switchLang(nextLang) {
    setLang(nextLang);
    localStorage.setItem('consulate_news_lang', nextLang);
  }

  function markRead(article) {
    const id = getArticleId(article);
    if (!id) return;
    const nextRead = new Set(readSet);
    const nextSeen = new Set(seenSet);
    nextRead.add(id);
    nextSeen.add(id);
    setReadSet(nextRead);
    setSeenSet(nextSeen);
    saveStoredSet(STORAGE_KEY, nextRead);
    saveStoredSet(SEEN_KEY, nextSeen);
  }

  function markAllSeen() {
    const nextSeen = new Set(seenSet);
    data.sources.forEach((source) => {
      source.articles.forEach((article) => nextSeen.add(getArticleId(article)));
    });
    setSeenSet(nextSeen);
    saveStoredSet(SEEN_KEY, nextSeen);
  }

  const totalArticles = data.sources.reduce((sum, source) => sum + source.articles.length, 0);
  const unreadCount = data.sources.reduce((sum, source) => {
    return sum + source.articles.filter((article) => !seenSet.has(getArticleId(article))).length;
  }, 0);

  const filteredSources = useMemo(() => {
    const query = search.trim().toLowerCase();
    return data.sources
      .filter((source) => activeCountry === 'all' || source.country === activeCountry)
      .map((source) => ({
        ...source,
        articles: source.articles.filter((article) => {
          if (!query) return true;
          return [article.title, source.name, source.country]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query);
        }),
      }))
      .filter((source) => source.articles.length > 0);
  }, [activeCountry, data.sources, search]);

  const countryButtons = data.sources.map((source) => ({
    key: source.country,
    label: COUNTRY_LABELS[source.country]?.[lang] || source.country,
    flag: source.flag,
    count: source.articles.length,
  }));

  return (
    <div className="page">
      <Head>
        <title>{t.title}</title>
        <meta name="description" content={t.subtitle} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style>{`
        *{box-sizing:border-box}
        body{margin:0;background:#f6f7fb;color:#151925;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        button,input{font:inherit}
        a{color:inherit;text-decoration:none}
        .page{min-height:100vh;background:#f6f7fb}
        .topbar{position:sticky;top:0;z-index:20;background:rgba(255,255,255,.92);backdrop-filter:blur(16px);border-bottom:1px solid #e7eaf0}
        .topbar-inner{max-width:1180px;margin:0 auto;height:64px;padding:0 20px;display:flex;align-items:center;justify-content:space-between;gap:16px}
        .brand{display:flex;align-items:center;gap:12px;min-width:0}
        .brand-mark{width:40px;height:40px;border-radius:10px;background:#0f2d52;color:white;display:grid;place-items:center;font-weight:900}
        .brand-title{font-weight:900;line-height:1.1;color:#121827;white-space:nowrap}
        .brand-sub{font-size:12px;color:#667085;margin-top:3px}
        .top-actions{display:flex;align-items:center;gap:8px}
        .lang{display:flex;padding:3px;background:#eef1f6;border:1px solid #dde3ec;border-radius:999px}
        .lang button{border:0;background:transparent;border-radius:999px;padding:6px 11px;font-size:12px;font-weight:800;color:#667085;cursor:pointer}
        .lang button.on{background:#fff;color:#0f2d52;box-shadow:0 1px 5px rgba(16,24,40,.1)}
        .btn{border:1px solid #cdd5df;background:#fff;color:#1d2939;border-radius:8px;padding:9px 13px;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:8px;min-height:38px}
        .btn.primary{background:#c2410c;border-color:#c2410c;color:#fff}
        .btn:disabled{opacity:.58;cursor:not-allowed}
        .hero{background:#0f2d52;color:#fff}
        .hero-inner{max-width:1180px;margin:0 auto;padding:44px 20px 72px}
        .eyebrow{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);border-radius:999px;padding:6px 12px;color:#d6e4f7;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.04em}
        h1{font-size:clamp(32px,5vw,58px);line-height:1.02;margin:18px 0 14px;max-width:760px;letter-spacing:0}
        .hero p{max-width:720px;color:#d5deea;font-size:17px;line-height:1.65;margin:0}
        .stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;max-width:560px;margin-top:28px}
        .stat{border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.08);border-radius:8px;padding:14px 16px}
        .stat strong{display:block;font-size:28px;line-height:1}
        .stat span{display:block;color:#c2d1e4;font-size:12px;font-weight:800;text-transform:uppercase;margin-top:7px}
        .main{max-width:1180px;margin:-38px auto 0;padding:0 20px 52px}
        .search-panel{background:#fff;border:1px solid #e4e7ec;border-radius:8px;box-shadow:0 18px 40px rgba(16,24,40,.12);padding:14px;display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center}
        .search-box{display:flex;align-items:center;gap:10px;background:#f7f8fb;border:1px solid #e4e7ec;border-radius:8px;padding:0 12px;min-height:46px}
        .search-box input{border:0;background:transparent;outline:none;width:100%;color:#111827}
        .meta-row{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:18px 0;flex-wrap:wrap;color:#667085;font-size:14px}
        .meta-row b{color:#c2410c}
        .filters{display:flex;gap:8px;overflow:auto;padding-bottom:6px;margin-bottom:22px}
        .chip{border:1px solid #d0d5dd;background:#fff;border-radius:999px;padding:8px 13px;font-size:13px;font-weight:800;color:#475467;white-space:nowrap;cursor:pointer}
        .chip.on{background:#0f2d52;border-color:#0f2d52;color:#fff}
        .source{margin:0 0 32px}
        .source-head{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;margin-bottom:12px}
        .source-name{display:flex;align-items:center;gap:10px;font-size:18px;font-weight:900;color:#111827}
        .source-line{width:5px;height:28px;border-radius:999px}
        .source-sub{font-size:13px;color:#667085;margin-top:3px}
        .count{font-size:13px;color:#667085;font-weight:800}
        .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px}
        .card{position:relative;display:flex;flex-direction:column;min-height:188px;background:#fff;border:1px solid #e4e7ec;border-radius:8px;padding:16px;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}
        .card:hover{transform:translateY(-2px);border-color:#c2410c;box-shadow:0 12px 28px rgba(16,24,40,.1)}
        .card.read{opacity:.62}
        .badge{width:max-content;border-radius:6px;background:#fff1e8;color:#c2410c;font-size:11px;font-weight:900;padding:4px 7px;text-transform:uppercase;margin-bottom:10px}
        .card h3{font-size:15px;line-height:1.45;margin:0;color:#111827;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
        .card-foot{margin-top:auto;padding-top:16px;display:flex;align-items:center;justify-content:space-between;gap:12px;color:#667085;font-size:12px;font-weight:700}
        .open{color:#0f2d52;font-weight:900}
        .empty,.loading{text-align:center;background:#fff;border:1px solid #e4e7ec;border-radius:8px;padding:52px 20px;color:#667085}
        .empty strong{display:block;color:#111827;font-size:18px;margin-bottom:6px}
        .toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#111827;color:#fff;border-radius:999px;padding:12px 18px;font-size:14px;font-weight:800;box-shadow:0 12px 28px rgba(16,24,40,.24);z-index:30}
        .footer{border-top:1px solid #e4e7ec;color:#667085;text-align:center;font-size:13px;padding:24px 20px;background:#fff}
        @media(max-width:720px){
          .topbar-inner{height:auto;padding:12px;align-items:flex-start}
          .brand-sub{display:none}
          .top-actions{flex-wrap:wrap;justify-content:flex-end}
          .hero-inner{padding:34px 16px 64px}
          .main{padding:0 12px 40px}
          .stats{grid-template-columns:1fr}
          .search-panel{grid-template-columns:1fr}
          .source-head{align-items:flex-start;flex-direction:column}
          .grid{grid-template-columns:1fr}
          .btn{padding:9px 11px}
        }
      `}</style>

      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-mark">VN</div>
            <div>
              <div className="brand-title">{t.title}</div>
              <div className="brand-sub">{t.footer}</div>
            </div>
          </div>
          <div className="top-actions">
            <div className="lang">
              <button className={lang === 'vi' ? 'on' : ''} onClick={() => switchLang('vi')}>VI</button>
              <button className={lang === 'en' ? 'on' : ''} onClick={() => switchLang('en')}>EN</button>
            </div>
            <button className="btn" onClick={markAllSeen}>{t.markAllRead}</button>
            <button className="btn primary" onClick={triggerFetch} disabled={fetching}>
              {fetching ? t.updating : t.update}
            </button>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <div className="eyebrow">{t.eyebrow}</div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
          <div className="stats">
            <div className="stat"><strong>{totalArticles}</strong><span>{t.articles}</span></div>
            <div className="stat"><strong>{data.sources.length}</strong><span>{t.sources}</span></div>
            <div className="stat"><strong>{unreadCount}</strong><span>{t.unread}</span></div>
          </div>
        </div>
      </section>

      <main className="main">
        <div className="search-panel">
          <div className="search-box">
            <span aria-hidden="true">⌕</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.search} />
          </div>
          <button className="btn" onClick={() => setSearch('')} disabled={!search}>{lang === 'vi' ? 'Xóa lọc' : 'Clear'}</button>
        </div>

        <div className="meta-row">
          <div>
            {t.lastUpdated}: <b>{data.lastUpdated ? formatDate(data.lastUpdated, true) : '...'}</b>
          </div>
          <div>{totalArticles} {t.articles} · {data.sources.length} {t.sources}</div>
        </div>

        {data.sources.length > 0 && (
          <div className="filters">
            <button className={activeCountry === 'all' ? 'chip on' : 'chip'} onClick={() => setActiveCountry('all')}>
              {t.all} · {totalArticles}
            </button>
            {countryButtons.map((item) => (
              <button
                key={item.key}
                className={activeCountry === item.key ? 'chip on' : 'chip'}
                onClick={() => setActiveCountry(item.key)}
              >
                {item.flag} {item.label} · {item.count}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="loading">{t.loading}</div>
        ) : data.sources.length === 0 ? (
          <div className="empty">
            <strong>{t.noData}</strong>
            <span>{t.noDataSub}</span>
          </div>
        ) : filteredSources.length === 0 ? (
          <div className="empty">
            <strong>{t.noResult}</strong>
            <span>{search}</span>
          </div>
        ) : (
          filteredSources.map((source) => (
            <section className="source" key={source.country}>
              <div className="source-head">
                <div>
                  <div className="source-name">
                    <span className="source-line" style={{ background: source.color }} />
                    <span>{source.flag} {source.name}</span>
                  </div>
                  <div className="source-sub">{t.official} · {formatDate(source.updatedAt, true)}</div>
                </div>
                <div className="count">{source.articles.length} {t.articles}</div>
              </div>
              <div className="grid">
                {source.articles.map((article) => {
                  const id = getArticleId(article);
                  const isRead = readSet.has(id);
                  const isNew = !seenSet.has(id);
                  return (
                    <a
                      className={isRead ? 'card read' : 'card'}
                      href={article.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={id}
                      onClick={() => markRead(article)}
                    >
                      {isNew && !isRead && <span className="badge">{t.new}</span>}
                      <h3>{article.title}</h3>
                      <div className="card-foot">
                        <span>{formatDate(article.date)}</span>
                        <span className="open">{isRead ? t.read : t.open}</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </main>

      <footer className="footer">{t.footer}</footer>
      {message && <div className="toast">{message}</div>}
    </div>
  );
}
