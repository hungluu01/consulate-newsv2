import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';

const STORAGE_KEY = 'consulate_news_read';
const SEEN_KEY = 'consulate_news_seen';
const PAGE_TITLES = {
  home: 'Trang Chủ',
  news: 'Tin tức Lãnh sự',
  procedures: 'Thủ tục Visa',
  gallery: 'Album Hình Ảnh',
};

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1800&q=82',
  'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=1800&q=82',
  'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1800&q=82',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1800&q=82',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1800&q=82',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1800&q=82',
  'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1800&q=82',
  'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1800&q=82',
  'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=1800&q=82',
  'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1800&q=82',
  'https://images.unsplash.com/photo-1470004914212-05527e49370b?w=1800&q=82',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=82',
  'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=1800&q=82',
  'https://images.unsplash.com/photo-1538485399081-7c8ed1f9f152?w=1800&q=82',
  'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=1800&q=82',
  'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=1800&q=82',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1800&q=82',
  'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=1800&q=82',
  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1800&q=82',
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1800&q=82',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&q=82',
  'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1800&q=82',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1800&q=82',
  'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1800&q=82',
  'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=1800&q=82',
  'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=1800&q=82',
  'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1800&q=82',
  'https://images.unsplash.com/photo-1548013146-72479768bada?w=1800&q=82',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1800&q=82',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1800&q=82',
  'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=1800&q=82',
  'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=1800&q=82',
];

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&q=82',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=900&q=82',
  'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=900&q=82',
  'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=900&q=82',
  'https://images.unsplash.com/photo-1470004914212-05527e49370b?w=900&q=82',
  'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=900&q=82',
  'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=900&q=82',
  'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=900&q=82',
  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&q=82',
  'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=900&q=82',
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=900&q=82',
  'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=900&q=82',
];

const COUNTRY_LABELS = {
  my: 'Mỹ',
  nhat: 'Nhật Bản',
  han: 'Hàn Quốc',
  kvac: 'KVAC',
  uc: 'Úc',
  canada: 'Canada',
  daiLoan: 'Đài Loan',
};

const PROCEDURE_ITEMS = [
  {
    title: 'Nhóm hồ sơ nhân thân',
    text: 'Hộ chiếu còn hạn trên 6 tháng, căn cước công dân, ảnh thẻ và tờ khai theo mẫu của quốc gia tiếp nhận.',
  },
  {
    title: 'Nhóm chứng minh tài chính',
    text: 'Sổ tiết kiệm, sao kê tài khoản 3-6 tháng, giấy tờ tài sản và hồ sơ chứng minh nguồn thu ổn định.',
  },
  {
    title: 'Nhóm chứng minh công việc',
    text: 'Hợp đồng lao động, xác nhận công tác, quyết định bổ nhiệm hoặc giấy phép kinh doanh nếu là chủ doanh nghiệp.',
  },
  {
    title: 'Nhóm lịch trình và bảo hiểm',
    text: 'Lịch trình chuyến đi, đặt vé/khách sạn phù hợp, bảo hiểm du lịch và thư mời nếu có.',
  },
];

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
  const [page, setPage] = useState('home');
  const [data, setData] = useState({ lastUpdated: null, sources: [] });
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [activeCountry, setActiveCountry] = useState('all');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [readSet, setReadSet] = useState(new Set());
  const [seenSet, setSeenSet] = useState(new Set());
  const [expandedSources, setExpandedSources] = useState({});
  const [heroIndex, setHeroIndex] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    setReadSet(readStoredSet(STORAGE_KEY));
    setSeenSet(readStoredSet(SEEN_KEY));
    loadNews();

    const imageTimer = setInterval(() => {
      setHeroIndex((index) => (index + 1) % HERO_IMAGES.length);
    }, 4200);
    const onScroll = () => setShowTop(window.scrollY > 420);
    window.addEventListener('scroll', onScroll);

    return () => {
      clearInterval(imageTimer);
      window.removeEventListener('scroll', onScroll);
    };
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
      setMessage('Không thể kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  }

  async function triggerFetch() {
    setFetching(true);
    setMessage('Đang cập nhật...');
    try {
      const res = await fetch('/api/fetch-news', {
        method: 'POST',
        headers: { 'x-cron-secret': process.env.NEXT_PUBLIC_CRON_SECRET || '' },
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Không thể cập nhật');
      setMessage(`${json.total} bài đã được cập nhật`);
      await loadNews();
    } catch (error) {
      setMessage(error.message || 'Không thể kết nối máy chủ');
    } finally {
      setFetching(false);
      setTimeout(() => setMessage(''), 4200);
    }
  }

  function navigate(nextPage) {
    if (nextPage === 'home') {
      setActiveCountry('all');
      setSearch('');
      setExpandedSources({});
    }
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  function selectCountry(country) {
    setActiveCountry(country);
    setPage('news');
    setExpandedSources({});
    setTimeout(() => {
      document.getElementById('news-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  const totalArticles = data.sources.reduce((sum, source) => sum + source.articles.length, 0);
  const unreadCount = data.sources.reduce((sum, source) => {
    return sum + source.articles.filter((article) => !seenSet.has(getArticleId(article))).length;
  }, 0);
  const selectedSource = data.sources.find((source) => source.country === activeCountry);

  const filteredSources = useMemo(() => {
    const query = search.trim().toLowerCase();
    return data.sources
      .filter((source) => activeCountry === 'all' || source.country === activeCountry)
      .map((source) => ({
        ...source,
        articles: source.articles.filter((article) => {
          if (!query) return true;
          return [article.title, source.name, COUNTRY_LABELS[source.country]]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query);
        }),
      }))
      .filter((source) => source.articles.length > 0);
  }, [activeCountry, data.sources, search]);

  const categoryCards = [
    {
      page: 'news',
      title: 'Tin tức Thị Thực & Lãnh Sự',
      text: 'Bảng theo dõi thông báo visa, lịch hẹn trống và tin mới từ cơ quan lãnh sự.',
      image: HERO_IMAGES[0],
      icon: '🍊',
    },
    {
      page: 'procedures',
      title: 'Thủ tục Visa',
      text: 'Khung chuẩn bị hồ sơ, chứng minh tài chính, lịch trình và giấy tờ hỗ trợ.',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=82',
      icon: '📚',
    },
    {
      page: 'gallery',
      title: 'Album hình ảnh các nước',
      text: 'Kho ảnh landscape quốc tế dùng làm tư liệu truyền thông và nhận diện điểm đến.',
      image: HERO_IMAGES[6],
      icon: '🖼️',
    },
  ];

  return (
    <div className="page">
      <Head>
        <title>ConsulateNews - Hệ thống giám sát visa</title>
        <meta name="description" content="Hệ thống tổng hợp tin tức thị thực và lãnh sự toàn cầu." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style>{`
        *{box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{margin:0;background:#f8fafc;color:#172033;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        button,input{font:inherit}
        button{cursor:pointer}
        a{color:inherit;text-decoration:none}
        .page{min-height:100vh;background:#f8fafc}
        .nav{position:sticky;top:0;z-index:40;background:rgba(255,255,255,.96);backdrop-filter:blur(18px);border-bottom:1px solid #edf1f5}
        .nav-inner{max-width:1500px;margin:0 auto;min-height:78px;padding:12px 28px;display:flex;align-items:center;justify-content:space-between;gap:18px}
        .brand{border:0;background:transparent;display:flex;align-items:center;gap:10px;color:#cf7135;font-size:23px;font-weight:950;letter-spacing:0;padding:8px 0}
        .brand-mark{font-size:25px;filter:drop-shadow(0 5px 10px rgba(210,113,53,.25))}
        .nav-links{display:flex;align-items:center;justify-content:flex-end;gap:12px;flex-wrap:wrap}
        .nav-link{border:0;background:transparent;color:#465268;border-radius:10px;padding:11px 18px;font-weight:900;font-size:15px}
        .nav-link:hover,.nav-link.on{background:#fff7eb;color:#ce7036}
        .nav-link.outline{border:2px solid #171717;color:#ce7036;background:#fff}
        .hero{position:relative;overflow:hidden;color:white;min-height:430px;background:#d87436}
        .hero.compact{min-height:260px}
        .hero-bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:0;transform:scale(1.04);transition:opacity 1.2s ease,transform 6s ease}
        .hero-bg.active{opacity:1;transform:scale(1.1)}
        .hero::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(201,105,42,.92),rgba(214,128,58,.68) 45%,rgba(255,255,255,.76));z-index:1}
        .hero-inner{position:relative;z-index:2;max-width:1500px;margin:0 auto;padding:78px 28px 86px;display:grid;grid-template-columns:minmax(0,1fr) 290px;gap:32px;align-items:center}
        .hero.compact .hero-inner{padding:44px 28px 52px}
        .hero h1{font-family:Georgia,"Times New Roman",serif;font-size:clamp(38px,5vw,72px);line-height:1.04;letter-spacing:0;margin:0 0 18px;max-width:860px}
        .hero p{font-size:19px;line-height:1.6;margin:0;color:rgba(255,255,255,.92);max-width:780px;font-weight:650}
        .hero-actions{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:28px}
        .btn{border:0;background:#fff;color:#ce7036;border-radius:12px;padding:14px 20px;font-weight:950;box-shadow:0 18px 35px rgba(122,63,28,.16)}
        .btn.soft{background:rgba(255,255,255,.18);color:#fff;border:1px solid rgba(255,255,255,.38);box-shadow:none}
        .toolbar .btn.soft{background:#fff7eb;color:#ce7036;border-color:#f5bc73}
        .hero-card{justify-self:end;width:250px;min-height:210px;border:1px solid rgba(255,255,255,.35);border-radius:22px;background:rgba(255,255,255,.16);backdrop-filter:blur(10px);display:grid;place-items:center;text-align:center;padding:22px}
        .clock-face{width:138px;height:138px;border:8px solid #d57435;background:#fff;border-radius:50%;position:relative;margin:0 auto 14px}
        .clock-face::before{content:"";position:absolute;left:50%;top:50%;width:6px;height:6px;background:#d57435;border-radius:50%;transform:translate(-50%,-50%)}
        .hand{position:absolute;left:50%;top:50%;height:4px;transform-origin:left center;background:#1f2937;border-radius:999px}
        .hand.h1{width:42px;transform:rotate(-55deg)}
        .hand.h2{width:52px;transform:rotate(8deg);background:#d57435}
        .clock-label{font-weight:950;text-transform:uppercase;color:#fff}
        .hero-country{margin-top:18px;display:inline-flex;border:1px solid rgba(255,255,255,.38);background:rgba(255,255,255,.14);border-radius:999px;padding:9px 14px;font-size:13px;font-weight:900}
        .main{max-width:1500px;margin:0 auto;padding:34px 28px 72px}
        .section-title{font-size:28px;margin:0 0 22px;font-weight:950;color:#101828}
        .home-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}
        .category-card{border:1px solid #e2e8f0;background:#fff;border-radius:16px;overflow:hidden;text-align:left;box-shadow:0 18px 42px rgba(15,23,42,.06);transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}
        .category-card:hover{transform:translateY(-5px);box-shadow:0 24px 55px rgba(15,23,42,.12);border-color:#f5bc73}
        .category-img{height:184px;background-size:cover;background-position:center}
        .category-body{padding:22px}
        .category-body h3{font-size:22px;margin:0 0 10px;color:#101828}
        .category-body p{font-size:15px;line-height:1.55;color:#697386;margin:0}
        .toolbar{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:18px;box-shadow:0 16px 40px rgba(15,23,42,.06);margin-bottom:18px}
        .search-row{display:grid;grid-template-columns:1fr auto auto;gap:12px;align-items:center}
        .search{height:48px;border:1px solid #e2e8f0;background:#f8fafc;border-radius:12px;padding:0 15px;outline:none;color:#101828}
        .tiny-meta{color:#7b8496;font-weight:750;font-size:14px}
        .sitemap{display:grid;grid-template-columns:repeat(auto-fit,minmax(112px,1fr));gap:10px;margin-top:15px}
        .chip{min-height:42px;border:1px solid #e2e8f0;background:#fff;border-radius:12px;color:#465268;font-weight:950}
        .chip.on{background:#fff7eb;border-color:#f5bc73;color:#ce7036}
        .news-source{margin:28px 0 42px}
        .source-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:14px}
        .source-title{display:flex;gap:10px;align-items:center;font-size:22px;font-weight:950;color:#172033}
        .source-line{width:5px;height:30px;border-radius:999px}
        .source-sub{color:#7b8496;font-size:13px;font-weight:750;margin-top:4px}
        .article-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
        .article-card{min-height:165px;background:#fff;border:1px solid #dfe7f0;border-radius:14px;padding:20px 20px 15px;display:flex;flex-direction:column;box-shadow:0 12px 28px rgba(15,23,42,.04);transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}
        .article-card:hover{transform:translateY(-3px);border-color:#f5bc73;box-shadow:0 20px 36px rgba(160,91,32,.12)}
        .article-card.read{opacity:.62}
        .article-card h3{font-size:16px;line-height:1.45;margin:0;color:#1d2939}
        .article-top{display:flex;gap:12px}
        .dot{width:8px;height:8px;border-radius:50%;background:#cbd5e1;margin-top:8px;flex:0 0 auto}
        .new-badge{width:max-content;background:#fff0e5;color:#ce7036;border-radius:7px;padding:4px 8px;font-size:11px;font-weight:950;margin-bottom:8px}
        .article-foot{margin-top:auto;border-top:1px dashed #e5eaf0;padding-top:13px;color:#73809a;font-size:13px;font-weight:800}
        .show-all{width:100%;border:1px dashed #cfd8e3;background:#fff;border-radius:12px;padding:16px;font-weight:950;color:#465268;margin-top:18px}
        .show-all:hover{border-color:#f5bc73;color:#ce7036;background:#fffaf2}
        .panel{background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:44px;box-shadow:0 18px 42px rgba(15,23,42,.05)}
        .panel h2{font-family:Georgia,"Times New Roman",serif;color:#ce7036;font-size:36px;margin:0 0 12px}
        .panel p{font-size:17px;line-height:1.65;color:#697386}
        .procedure-list{border-left:4px solid #d57435;padding-left:22px;margin-top:30px;display:grid;gap:18px}
        .procedure-list b{color:#465268}
        .gallery-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}
        .gallery-item{height:210px;background-size:cover;background-position:center;border-radius:13px;border:1px solid #e2e8f0;box-shadow:0 12px 28px rgba(15,23,42,.06)}
        .empty,.loading{text-align:center;background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:52px 20px;color:#697386;font-weight:800}
        .to-top{position:fixed;right:28px;bottom:28px;width:56px;height:56px;border-radius:50%;border:0;background:#d57435;color:#fff;font-size:26px;box-shadow:0 18px 36px rgba(213,116,53,.35);z-index:50}
        .toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:#172033;color:white;border-radius:999px;padding:13px 20px;font-weight:900;box-shadow:0 16px 34px rgba(15,23,42,.22);z-index:60}
        .footer{border-top:1px solid #e2e8f0;background:#fff;text-align:center;color:#97a1b3;padding:25px;font-weight:750}
        @media(max-width:1000px){
          .hero-inner{grid-template-columns:1fr}.hero-card{display:none}.home-grid,.article-grid{grid-template-columns:1fr 1fr}.gallery-grid{grid-template-columns:1fr 1fr}
        }
        @media(max-width:720px){
          .nav-inner{padding:10px 14px;align-items:flex-start;gap:10px;flex-direction:column}.nav-links{width:100%;justify-content:space-between;gap:6px}.nav-link{flex:1;padding:9px 6px;font-size:13px}
          .brand{font-size:20px}.hero{min-height:390px}.hero-inner{padding:48px 16px 62px}.hero h1{font-size:39px}.hero p{font-size:16px}
          .main{padding:24px 14px 52px}.home-grid,.article-grid,.gallery-grid{grid-template-columns:1fr}.search-row{grid-template-columns:1fr}.source-head{align-items:flex-start;flex-direction:column}
          .sitemap{grid-template-columns:repeat(2,minmax(0,1fr))}.panel{padding:26px}.panel h2{font-size:29px}.gallery-item{height:220px}
          .to-top{right:18px;bottom:18px}
        }
      `}</style>

      <header className="nav">
        <div className="nav-inner">
          <button className="brand" onClick={() => navigate('home')} aria-label="Về trang chủ">
            <span className="brand-mark">🍊</span>
            <span>ConsulateNews</span>
          </button>
          <nav className="nav-links">
            {Object.entries(PAGE_TITLES).map(([key, label]) => (
              <button
                key={key}
                className={`nav-link ${page === key ? 'on' : ''} ${key === 'gallery' && page === key ? 'outline' : ''}`}
                onClick={() => navigate(key)}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <section className={`hero ${page === 'home' ? '' : 'compact'}`}>
        {HERO_IMAGES.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className={`hero-bg ${index === heroIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        <div className="hero-inner">
          <div>
            <h1>Hệ thống Giám sát Tin tức Thị thực & Lãnh sự Toàn cầu</h1>
            <p>Hệ thống tổng hợp và phân tích thông báo từ cơ quan ngoại giao ngoại bang.</p>
            <div className="hero-actions">
              <button className="btn" onClick={triggerFetch} disabled={fetching}>
                {fetching ? 'Đang cập nhật...' : '🔄 Cập nhật ngay'}
              </button>
              <span className="btn soft">Đồng bộ: {data.lastUpdated ? formatDate(data.lastUpdated, true) : 'chưa có dữ liệu'}</span>
            </div>
            <div className="hero-country">
              {activeCountry === 'all'
                ? 'Đang hiển thị: Tất cả quốc gia'
                : `Đang hiển thị: ${selectedSource?.name || COUNTRY_LABELS[activeCountry]}`}
            </div>
          </div>
          <div className="hero-card">
            <div>
              <div className="clock-face">
                <span className="hand h1" />
                <span className="hand h2" />
              </div>
              <div className="clock-label">Hồ Chí Minh Time</div>
            </div>
          </div>
        </div>
      </section>

      <main className="main">
        {page === 'home' && (
          <>
            <h2 className="section-title">Danh Mục Quản Trị Hệ Thống</h2>
            <div className="home-grid">
              {categoryCards.map((card) => (
                <button className="category-card" key={card.page} onClick={() => navigate(card.page)}>
                  <div className="category-img" style={{ backgroundImage: `url(${card.image})` }} />
                  <div className="category-body">
                    <h3>{card.icon} {card.title}</h3>
                    <p>{card.text}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {page === 'news' && (
          <section id="news-content">
            <div className="toolbar">
              <div className="search-row">
                <input
                  className="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Tìm kiếm theo tiêu đề, quốc gia hoặc nguồn tin..."
                />
                <button className="btn" onClick={() => setSearch('')} disabled={!search}>Xóa lọc</button>
                <button className="btn soft" onClick={markAllSeen}>Đánh dấu đã xem</button>
              </div>
              <div className="sitemap">
                <button className={`chip ${activeCountry === 'all' ? 'on' : ''}`} onClick={() => selectCountry('all')}>
                  Tất cả · {totalArticles}
                </button>
                {data.sources.map((source) => (
                  <button
                    key={source.country}
                    className={`chip ${activeCountry === source.country ? 'on' : ''}`}
                    onClick={() => selectCountry(source.country)}
                    title={source.name}
                  >
                    {source.flag} {COUNTRY_LABELS[source.country] || source.country}
                  </button>
                ))}
              </div>
            </div>
            <div className="tiny-meta">
              {totalArticles} bài · {data.sources.length} nguồn · {unreadCount} bài chưa đọc
            </div>

            {loading ? (
              <div className="loading">Đang tải dữ liệu...</div>
            ) : data.sources.length === 0 ? (
              <div className="empty">Chưa có dữ liệu. Bấm Cập nhật ngay để tải tin lần đầu.</div>
            ) : filteredSources.length === 0 ? (
              <div className="empty">Không tìm thấy tin phù hợp.</div>
            ) : (
              filteredSources.map((source) => {
                const expanded = expandedSources[source.country];
                const visibleArticles = expanded ? source.articles : source.articles.slice(0, 10);
                const hiddenCount = Math.max(source.articles.length - visibleArticles.length, 0);
                return (
                  <section className="news-source" key={source.country}>
                    <div className="source-head">
                      <div>
                        <div className="source-title">
                          <span className="source-line" style={{ background: source.color }} />
                          <span>{source.flag} {source.name}</span>
                        </div>
                        <div className="source-sub">Cập nhật: {formatDate(source.updatedAt, true)}</div>
                      </div>
                      <div className="tiny-meta">{source.articles.length} bài</div>
                    </div>
                    <div className="article-grid">
                      {visibleArticles.map((article) => {
                        const id = getArticleId(article);
                        const isRead = readSet.has(id);
                        const isNew = !seenSet.has(id);
                        return (
                          <a
                            className={`article-card ${isRead ? 'read' : ''}`}
                            href={article.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={id}
                            onClick={() => markRead(article)}
                          >
                            {isNew && !isRead && <span className="new-badge">Mới</span>}
                            <div className="article-top">
                              <span className="dot" />
                              <h3>{article.title}</h3>
                            </div>
                            <div className="article-foot">🗓 {formatDate(article.date)}</div>
                          </a>
                        );
                      })}
                    </div>
                    {hiddenCount > 0 && (
                      <button
                        className="show-all"
                        onClick={() => setExpandedSources((current) => ({ ...current, [source.country]: true }))}
                      >
                        ▼ Xem tất cả bài viết (+{hiddenCount} bài viết cũ hơn)
                      </button>
                    )}
                  </section>
                );
              })
            )}
          </section>
        )}

        {page === 'procedures' && (
          <section className="panel">
            <h2>📚 Hướng Dẫn Hồ Sơ Thủ Tục Visa</h2>
            <p>Cơ sở dữ liệu đang cấu trúc hóa các bước chuẩn bị hồ sơ cho những thị trường chính ngạch. Phần này có thể mở rộng thành checklist theo từng quốc gia ở bản tiếp theo.</p>
            <div className="procedure-list">
              {PROCEDURE_ITEMS.map((item, index) => (
                <div key={item.title}>
                  <b>{index + 1}. {item.title}:</b> {item.text}
                </div>
              ))}
            </div>
          </section>
        )}

        {page === 'gallery' && (
          <section className="panel">
            <h2>🖼️ Không Gian Tư Liệu Hình Ảnh Quốc Tế</h2>
            <p>Thư viện ảnh landscape thực tế phục vụ thiết kế nội dung truyền thông tư vấn.</p>
            <div className="gallery-grid">
              {GALLERY_IMAGES.map((image) => (
                <div className="gallery-item" key={image} style={{ backgroundImage: `url(${image})` }} />
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        🍊 Consulate News Dashboard Portal · © 2026<br />
        Hệ thống đồng bộ dữ liệu tự động hoàn toàn lúc 7:00 SA mỗi ngày
      </footer>

      {showTop && (
        <button className="to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Lên đầu trang">
          ↑
        </button>
      )}
      {message && <div className="toast">{message}</div>}
    </div>
  );
}
