import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';

const STORAGE_KEY = 'consulate_news_read';
const SEEN_KEY = 'consulate_news_seen';
const CUSTOM_ARTICLES_KEY = 'consulate_custom_articles';
const PAGE_TITLES = {
  home: 'Trang Chủ',
  news: 'Tin tức Lãnh sự',
  vfs: 'VFS Global',
  procedures: 'Thủ tục Visa',
  gallery: 'Album Hình Ảnh',
  admin: 'Quản trị',
};

const DEFAULT_SITE_SETTINGS = {
  heroTitle: 'Hệ thống Giám sát Tin tức Thị thực & Lãnh sự Toàn cầu',
  heroSubtitle: 'Hệ thống tổng hợp và phân tích thông báo từ cơ quan ngoại giao ngoại bang.',
  homeLead: 'Bảng điều khiển nhanh cho các mảng nội dung visa, lãnh sự, VFS và tư liệu hình ảnh.',
  textAlign: 'left',
  fontScale: 100,
  cardRadius: 16,
  designer: 'Hungluu',
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

const VFS_CENTRES = [
  {
    key: 'canada',
    country: 'Canada',
    flag: '🇨🇦',
    partner: 'Canada Visa Application Centre',
    city: 'TP.HCM',
    address: 'Tầng 9, Tháp Cienco 4, 180 Nguyễn Thị Minh Khai, Phường Xuân Hòa, TP.HCM',
    phone: '+84 28 3622 0988',
    email: 'Liên hệ qua biểu mẫu/email trên trang VFS Canada',
    hours: 'Thứ Hai - Thứ Sáu, 09:00 - 17:00',
    overview: 'Trung tâm hỗ trợ sinh trắc học, đặt lịch hẹn, nhận hồ sơ/hộ chiếu cho các diện thị thực tạm trú, học tập và làm việc theo quy trình IRCC.',
    documents: 'BIL nếu có, hộ chiếu, thư yêu cầu nộp hộ chiếu/tài liệu bổ sung, giấy hẹn và giấy tờ theo checklist IRCC.',
    appointment: 'https://visa.vfsglobal.com/vnm/en/can/',
    news: 'https://visa.vfsglobal.com/vnm/en/can/',
    map: 'https://www.google.com/maps/search/?api=1&query=180+Nguyen+Thi+Minh+Khai+Cienco+4+Tower+Ho+Chi+Minh',
    source: 'VFS Canada Vietnam',
  },
  {
    key: 'uk',
    country: 'Anh Quốc',
    flag: '🇬🇧',
    partner: 'UK Visa Application Centre',
    city: 'TP.HCM',
    address: 'Xem địa chỉ mới nhất trong mục Find a centre của VFS UKVI Vietnam',
    phone: 'Theo kênh hỗ trợ VFS/UKVI trên trang chính thức',
    email: 'Theo biểu mẫu hỗ trợ VFS/UKVI',
    hours: 'Cần kiểm tra theo lịch hẹn đang mở trên VFS UKVI',
    overview: 'VFS Global là đối tác chính thức của UK Visas and Immigration, hỗ trợ đặt lịch và tiếp nhận sinh trắc học/hồ sơ theo quy trình UKVI.',
    documents: 'Checklist UKVI, hộ chiếu, giấy hẹn, tài liệu hỗ trợ đã tải lên hoặc bản giấy theo yêu cầu từng diện.',
    appointment: 'https://visa.vfsglobal.com/vnm/en/gbr/',
    news: 'https://visa.vfsglobal.com/vnm/en/gbr/',
    map: 'https://www.google.com/maps/search/?api=1&query=VFS+Global+UK+Visa+Application+Centre+Ho+Chi+Minh',
    source: 'VFS UKVI Vietnam',
  },
  {
    key: 'australia',
    country: 'Úc',
    flag: '🇦🇺',
    partner: 'Australian Biometric Collection Centre',
    city: 'TP.HCM',
    address: 'Xem địa chỉ mới nhất trong mục Find a centre của VFS Australia Vietnam',
    phone: 'Theo kênh hỗ trợ VFS Australia',
    email: 'Theo biểu mẫu hỗ trợ VFS Australia',
    hours: 'Theo lịch hẹn và giờ mở cửa hiển thị trong Find a centre',
    overview: 'VFS Global hỗ trợ dịch vụ sinh trắc học và các dịch vụ liên quan cho Bộ Nội vụ Úc tại Việt Nam.',
    documents: 'Hộ chiếu, giấy hẹn sinh trắc học, thư yêu cầu sinh trắc học và giấy tờ theo hồ sơ ImmiAccount.',
    appointment: 'https://visa.vfsglobal.com/vnm/en/aus/',
    news: 'https://visa.vfsglobal.com/vnm/en/aus/',
    map: 'https://www.google.com/maps/search/?api=1&query=Australian+Biometric+Collection+Centre+VFS+Ho+Chi+Minh',
    source: 'VFS Australia Vietnam',
  },
  {
    key: 'japan',
    country: 'Nhật Bản',
    flag: '🇯🇵',
    partner: 'Trung tâm tiếp nhận hồ sơ xin thị thực Nhật Bản',
    city: 'TP.HCM',
    address: 'Toà nhà President, Lầu 11, 93 Nguyễn Du, phường Bến Nghé, Quận 1, TP.HCM',
    phone: 'Theo kênh hỗ trợ trên trang VFS Nhật Bản',
    email: 'Theo biểu mẫu hỗ trợ trên trang VFS Nhật Bản',
    hours: 'Hoạt động 08:30 - 12:00 và 13:00 - 16:00; nộp hồ sơ 08:30 - 12:00 và 13:00 - 15:00',
    overview: 'Trung tâm tiếp nhận hồ sơ visa Nhật Bản tại TP.HCM, có phí dịch vụ theo thông báo VFS.',
    documents: 'Hộ chiếu, đơn xin visa, ảnh, giấy tờ chứng minh mục đích chuyến đi và checklist theo diện nộp.',
    appointment: 'https://visa.vfsglobal.com/vnm/vi/jpn/',
    news: 'https://visa.vfsglobal.com/vnm/vi/jpn/',
    map: 'https://www.google.com/maps/search/?api=1&query=93+Nguyen+Du+President+Tower+Ho+Chi+Minh',
    source: 'VFS Japan Vietnam',
  },
  {
    key: 'switzerland',
    country: 'Thụy Sĩ',
    flag: '🇨🇭',
    partner: 'Switzerland Visa Application Centre',
    city: 'TP.HCM',
    address: 'REE Tower, 3B Floor, 9 Đoàn Văn Bơ, Phường 13, Quận 4, TP.HCM',
    phone: 'Theo kênh hỗ trợ trên trang VFS Switzerland',
    email: 'Theo biểu mẫu hỗ trợ VFS Switzerland',
    hours: 'Thứ Hai - Thứ Sáu, 08:30 - 12:00 và 13:00 - 16:30',
    overview: 'Trung tâm tiếp nhận hồ sơ Schengen Thụy Sĩ tại TP.HCM; một số dịch vụ có phí trung tâm bổ sung.',
    documents: 'Hộ chiếu, đơn Schengen, ảnh, bảo hiểm du lịch, lịch trình, chứng minh tài chính/công việc và giấy tờ theo checklist.',
    appointment: 'https://visa.vfsglobal.com/vnm/en/che/',
    news: 'https://visa.vfsglobal.com/vnm/en/che/',
    map: 'https://www.google.com/maps/search/?api=1&query=REE+Tower+9+Doan+Van+Bo+District+4+Ho+Chi+Minh',
    source: 'VFS Switzerland Vietnam',
  },
  {
    key: 'netherlands',
    country: 'Hà Lan',
    flag: '🇳🇱',
    partner: 'Netherlands Visa Application Centre',
    city: 'TP.HCM',
    address: 'Xem địa chỉ mới nhất trong mục Find a centre của VFS Hà Lan Vietnam',
    phone: 'Theo kênh hỗ trợ VFS Netherlands',
    email: 'Theo biểu mẫu hỗ trợ VFS Netherlands',
    hours: 'Theo lịch trung tâm VFS Hà Lan tại TP.HCM',
    overview: 'VFS Global là đối tác tiếp nhận dịch vụ lãnh sự cho Vương quốc Hà Lan tại Việt Nam; tại TP.HCM có đại diện cho Slovenia và Luxembourg diện ngắn hạn.',
    documents: 'Hồ sơ Schengen, bảo hiểm, lịch trình, chứng minh tài chính/công việc và giấy tờ theo checklist từng diện.',
    appointment: 'https://visa.vfsglobal.com/vnm/en/nld/',
    news: 'https://visa.vfsglobal.com/vnm/en/nld/',
    map: 'https://www.google.com/maps/search/?api=1&query=VFS+Global+Netherlands+Ho+Chi+Minh',
    source: 'VFS Netherlands Vietnam',
  },
  {
    key: 'france',
    country: 'Pháp',
    flag: '🇫🇷',
    partner: 'Ghi chú: hồ sơ Pháp thường theo France-Visas/TLScontact, không mặc định là VFS',
    city: 'TP.HCM',
    address: 'Cần kiểm tra trên France-Visas hoặc TLScontact trước khi tư vấn lịch hẹn',
    phone: 'Theo kênh chính thức France-Visas/TLScontact',
    email: 'Theo biểu mẫu chính thức France-Visas/TLScontact',
    hours: 'Theo lịch hẹn trung tâm được chỉ định',
    overview: 'Mục này được giữ để anh quản lý nhu cầu khách hỏi visa Pháp, nhưng cần xác minh nhà cung cấp tiếp nhận hiện hành trước khi đặt lịch.',
    documents: 'Hồ sơ Schengen Pháp, bảo hiểm, lịch trình, chứng minh tài chính/công việc và giấy tờ theo checklist France-Visas.',
    appointment: 'https://france-visas.gouv.fr/',
    news: 'https://france-visas.gouv.fr/',
    map: 'https://www.google.com/maps/search/?api=1&query=France+Visa+Application+Centre+Ho+Chi+Minh',
    source: 'France-Visas / cần xác minh nhà tiếp nhận',
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

function DigitalClock({ label = 'Việt Nam' }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now);

  const date = new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
  }).format(now);

  return (
    <div className="digital-clock">
      <div className="digital-label">{label}</div>
      <div className="digital-time">{time}</div>
      <div className="digital-date">{date}</div>
    </div>
  );
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
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SITE_SETTINGS);
  const [activeVfs, setActiveVfs] = useState(VFS_CENTRES[0].key);
  const [vfsTab, setVfsTab] = useState('overview');
  const [customArticles, setCustomArticles] = useState([]);
  const [draftArticle, setDraftArticle] = useState({ title: '', url: '', country: 'my' });

  useEffect(() => {
    setReadSet(readStoredSet(STORAGE_KEY));
    setSeenSet(readStoredSet(SEEN_KEY));
    try {
      const savedSettings = JSON.parse(localStorage.getItem('consulate_site_settings') || 'null');
      if (savedSettings) setSiteSettings({ ...DEFAULT_SITE_SETTINGS, ...savedSettings });
    } catch {}
    try {
      const savedArticles = JSON.parse(localStorage.getItem(CUSTOM_ARTICLES_KEY) || '[]');
      if (Array.isArray(savedArticles)) setCustomArticles(savedArticles);
    } catch {}
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

  function updateSiteSetting(key, value) {
    const next = { ...siteSettings, [key]: value };
    setSiteSettings(next);
    localStorage.setItem('consulate_site_settings', JSON.stringify(next));
  }

  function resetSiteSettings() {
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    localStorage.setItem('consulate_site_settings', JSON.stringify(DEFAULT_SITE_SETTINGS));
  }

  function saveCustomArticles(nextArticles) {
    setCustomArticles(nextArticles);
    localStorage.setItem(CUSTOM_ARTICLES_KEY, JSON.stringify(nextArticles));
  }

  function addCustomArticle() {
    if (!draftArticle.title.trim()) return;
    const nextArticle = {
      title: draftArticle.title.trim(),
      url: draftArticle.url.trim() || '#',
      country: draftArticle.country,
      date: new Date().toISOString(),
      manual: true,
    };
    saveCustomArticles([nextArticle, ...customArticles]);
    setDraftArticle({ title: '', url: '', country: draftArticle.country });
  }

  function removeCustomArticle(index) {
    saveCustomArticles(customArticles.filter((_, itemIndex) => itemIndex !== index));
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

  const manualSource = customArticles.length
    ? [{
        country: 'manual',
        flag: '✍️',
        name: 'Tin chỉnh tay từ quản trị',
        color: '#ce7036',
        updatedAt: customArticles[0]?.date,
        articles: customArticles,
      }]
    : [];
  const allSources = [...manualSource, ...data.sources];
  const totalArticles = allSources.reduce((sum, source) => sum + source.articles.length, 0);
  const unreadCount = allSources.reduce((sum, source) => {
    return sum + source.articles.filter((article) => !seenSet.has(getArticleId(article))).length;
  }, 0);
  const selectedSource = data.sources.find((source) => source.country === activeCountry);
  const selectedVfs = VFS_CENTRES.find((item) => item.key === activeVfs) || VFS_CENTRES[0];

  const filteredSources = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allSources
      .filter((source) => {
        if (activeCountry === 'all') return true;
        if (source.country === 'manual') return source.articles.some((article) => article.country === activeCountry);
        return source.country === activeCountry;
      })
      .map((source) => ({
        ...source,
        articles: source.articles.filter((article) => {
          if (activeCountry !== 'all' && source.country === 'manual' && article.country !== activeCountry) return false;
          if (!query) return true;
          return [article.title, source.name, COUNTRY_LABELS[source.country]]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query);
        }),
      }))
      .filter((source) => source.articles.length > 0);
  }, [activeCountry, allSources, search]);

  const categoryCards = [
    {
      page: 'news',
      title: 'Tin tức Thị Thực & Lãnh Sự',
      text: 'Bảng theo dõi thông báo visa, lịch hẹn trống và tin mới từ cơ quan lãnh sự.',
      image: HERO_IMAGES[0],
      icon: '🍊',
    },
    {
      page: 'vfs',
      title: 'VFS Global',
      text: 'Trung tâm tiếp nhận hồ sơ theo từng quốc gia: tổng quan, địa chỉ, giờ làm việc, đặt lịch và bản đồ.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=82',
      icon: '🌐',
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
    <div
      className="page"
      style={{
        '--site-align': siteSettings.textAlign,
        '--site-scale': `${siteSettings.fontScale}%`,
        '--card-radius': `${siteSettings.cardRadius}px`,
      }}
    >
      <Head>
        <title>ConsulateNews - Hệ thống giám sát visa</title>
        <meta name="description" content="Hệ thống tổng hợp tin tức thị thực và lãnh sự toàn cầu." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *{box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{margin:0;background:#f8fafc;color:#172033;font-family:"Be Vietnam Pro",Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;overflow-x:hidden}
        button,input{font:inherit}
        button{cursor:pointer}
        a{color:inherit;text-decoration:none}
        .page{min-height:100vh;background:#f8fafc;font-size:var(--site-scale)}
        .nav{position:sticky;top:0;z-index:40;background:rgba(255,255,255,.96);backdrop-filter:blur(18px);border-bottom:1px solid #edf1f5}
        .nav-inner{max-width:1500px;margin:0 auto;min-height:78px;padding:12px 28px;display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:18px}
        .brand{border:0;background:transparent;display:flex;align-items:center;gap:10px;color:#cf7135;font-size:23px;font-weight:950;letter-spacing:0;padding:8px 0;white-space:nowrap}
        .brand-mark{font-size:25px;filter:drop-shadow(0 5px 10px rgba(210,113,53,.25))}
        .nav-links{display:grid;grid-template-columns:repeat(6,max-content);align-items:center;justify-content:end;gap:10px;min-width:0}
        .nav-link{border:0;background:transparent;color:#465268;border-radius:10px;padding:10px 15px;font-weight:900;font-size:15px;white-space:nowrap;min-width:0}
        .nav-link:hover,.nav-link.on{background:#fff7eb;color:#ce7036}
        .nav-link.outline{background:#fff7eb;color:#ce7036}
        .hero{position:relative;overflow:hidden;color:white;min-height:395px;background:#d87436}
        .hero.compact{min-height:260px}
        .hero-bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:0;transform:scale(1.04);transition:opacity 1.2s ease,transform 6s ease}
        .hero-bg.active{opacity:1;transform:scale(1.1)}
        .hero::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(201,105,42,.92),rgba(214,128,58,.68) 45%,rgba(255,255,255,.76));z-index:1}
        .hero-inner{position:relative;z-index:2;max-width:1500px;margin:0 auto;padding:64px 28px 72px;display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:32px;align-items:center}
        .hero.compact .hero-inner{padding:44px 28px 52px}
        .hero-copy{text-align:var(--site-align)}
        .hero h1{font-family:"Playfair Display",Georgia,"Times New Roman",serif;font-size:clamp(36px,4.1vw,62px);line-height:1.08;letter-spacing:0;margin:0 0 18px;max-width:820px;text-wrap:balance}
        .hero p{font-size:18px;line-height:1.6;margin:0;color:rgba(255,255,255,.94);max-width:760px;font-weight:700}
        .hero-actions{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:28px}
        .btn{border:0;background:#fff;color:#ce7036;border-radius:12px;padding:14px 20px;font-weight:950;box-shadow:0 18px 35px rgba(122,63,28,.16)}
        .btn.soft{background:rgba(255,255,255,.18);color:#fff;border:1px solid rgba(255,255,255,.38);box-shadow:none}
        .toolbar .btn.soft{background:#fff7eb;color:#ce7036;border-color:#f5bc73}
        .hero-card{justify-self:end;width:260px;min-height:185px;border:1px solid rgba(255,255,255,.35);border-radius:22px;background:rgba(255,255,255,.16);backdrop-filter:blur(10px);display:grid;place-items:center;text-align:center;padding:20px}
        .digital-clock{width:100%;border-radius:18px;background:rgba(255,255,255,.9);color:#172033;padding:22px 18px;box-shadow:0 22px 42px rgba(99,50,21,.12)}
        .digital-label{font-size:13px;font-weight:950;color:#ce7036;text-transform:uppercase;letter-spacing:.08em}
        .digital-time{font-variant-numeric:tabular-nums;font-size:42px;line-height:1;font-weight:950;margin:12px 0 8px;color:#101828}
        .digital-date{font-size:13px;color:#667085;font-weight:800;text-transform:capitalize}
        .hero-country{margin-top:18px;display:inline-flex;border:1px solid rgba(255,255,255,.38);background:rgba(255,255,255,.14);border-radius:999px;padding:9px 14px;font-size:13px;font-weight:900}
        .main{max-width:1500px;margin:0 auto;padding:34px 28px 72px}
        .section-title{font-size:30px;margin:0 0 22px;font-weight:950;color:#101828}
        .home-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px}
        .home-lead{margin:-8px 0 24px;color:#697386;font-weight:650;line-height:1.7;max-width:760px;text-align:var(--site-align)}
        .category-card{border:1px solid #e2e8f0;background:#fff;border-radius:var(--card-radius);overflow:hidden;text-align:left;box-shadow:0 18px 42px rgba(15,23,42,.06);transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}
        .category-card:hover{transform:translateY(-5px);box-shadow:0 24px 55px rgba(15,23,42,.12);border-color:#f5bc73}
        .category-img{height:184px;background-size:cover;background-position:center}
        .category-body{padding:22px}
        .category-body h3{font-size:22px;margin:0 0 10px;color:#101828;line-height:1.25}
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
        .article-card{min-height:165px;background:#fff;border:1px solid #dfe7f0;border-radius:var(--card-radius);padding:20px 20px 15px;display:flex;flex-direction:column;box-shadow:0 12px 28px rgba(15,23,42,.04);transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}
        .article-card:hover{transform:translateY(-3px);border-color:#f5bc73;box-shadow:0 20px 36px rgba(160,91,32,.12)}
        .article-card.read{opacity:.62}
        .article-card h3{font-size:16px;line-height:1.45;margin:0;color:#1d2939}
        .article-top{display:flex;gap:12px}
        .dot{width:8px;height:8px;border-radius:50%;background:#cbd5e1;margin-top:8px;flex:0 0 auto}
        .new-badge{width:max-content;background:#fff0e5;color:#ce7036;border-radius:7px;padding:4px 8px;font-size:11px;font-weight:950;margin-bottom:8px}
        .article-foot{margin-top:auto;border-top:1px dashed #e5eaf0;padding-top:13px;color:#73809a;font-size:13px;font-weight:800}
        .show-all{width:100%;border:1px dashed #cfd8e3;background:#fff;border-radius:12px;padding:16px;font-weight:950;color:#465268;margin-top:18px}
        .show-all:hover{border-color:#f5bc73;color:#ce7036;background:#fffaf2}
        .panel{background:#fff;border:1px solid #e2e8f0;border-radius:var(--card-radius);padding:44px;box-shadow:0 18px 42px rgba(15,23,42,.05);text-align:var(--site-align)}
        .panel h2{font-family:"Playfair Display",Georgia,"Times New Roman",serif;color:#ce7036;font-size:36px;line-height:1.18;margin:0 0 12px;letter-spacing:0;text-wrap:balance}
        .panel p{font-size:17px;line-height:1.65;color:#697386}
        .procedure-list{border-left:4px solid #d57435;padding-left:22px;margin-top:30px;display:grid;gap:18px}
        .procedure-list b{color:#465268}
        .gallery-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}
        .gallery-item{height:210px;background-size:cover;background-position:center;border-radius:13px;border:1px solid #e2e8f0;box-shadow:0 12px 28px rgba(15,23,42,.06)}
        .vfs-shell{display:grid;grid-template-columns:280px minmax(0,1fr);gap:20px}
        .vfs-list{display:grid;gap:10px;align-content:start}
        .vfs-country{border:1px solid #e2e8f0;background:#fff;border-radius:14px;padding:14px;text-align:left;font-weight:950;color:#465268;box-shadow:0 10px 24px rgba(15,23,42,.04)}
        .vfs-country.on{border-color:#f5bc73;background:#fff7eb;color:#ce7036}
        .vfs-tabs{display:flex;gap:10px;flex-wrap:wrap;margin:20px 0}
        .vfs-tab{border:1px solid #e2e8f0;background:#fff;border-radius:999px;padding:10px 14px;font-weight:900;color:#465268}
        .vfs-tab.on{background:#ce7036;border-color:#ce7036;color:#fff}
        .vfs-grid{display:grid;grid-template-columns:minmax(0,1fr) 420px;gap:20px;align-items:start}
        .info-list{display:grid;gap:12px}
        .info-card{border:1px solid #e2e8f0;border-radius:14px;background:#fff;padding:16px;text-align:left}
        .info-card b{display:block;color:#101828;margin-bottom:5px}
        .map-frame{width:100%;height:390px;border:0;border-radius:16px;background:#eef2f7}
        .admin-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;text-align:left}
        .admin-field{display:grid;gap:8px}
        .admin-field label{font-weight:900;color:#465268}
        .admin-field input,.admin-field textarea,.admin-field select{border:1px solid #dfe7f0;border-radius:12px;padding:12px 13px;outline:none;color:#172033;background:#fff}
        .admin-field textarea{min-height:120px;resize:vertical}
        .admin-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px}
        .empty,.loading{text-align:center;background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:52px 20px;color:#697386;font-weight:800}
        .to-top{position:fixed;right:28px;bottom:28px;width:56px;height:56px;border-radius:50%;border:0;background:#d57435;color:#fff;font-size:26px;box-shadow:0 18px 36px rgba(213,116,53,.35);z-index:50}
        .toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:#172033;color:white;border-radius:999px;padding:13px 20px;font-weight:900;box-shadow:0 16px 34px rgba(15,23,42,.22);z-index:60}
        .footer{border-top:1px solid #e2e8f0;background:#fff;text-align:center;color:#97a1b3;padding:25px;font-weight:750}
        .designer{margin-top:8px;color:#ce7036;font-weight:950}
        @media(max-width:1000px){
          .nav-inner{grid-template-columns:1fr}.nav-links{justify-content:stretch;grid-template-columns:repeat(3,minmax(0,1fr));width:100%}.nav-link{text-align:center;padding:10px 8px;font-size:14px}
          .hero-inner{grid-template-columns:1fr}.hero-card{display:none}.home-grid,.article-grid{grid-template-columns:1fr 1fr}.gallery-grid{grid-template-columns:1fr 1fr}
          .vfs-shell,.vfs-grid,.admin-grid{grid-template-columns:1fr}
        }
        @media(max-width:720px){
          .nav-inner{padding:10px 14px;align-items:flex-start;gap:10px}.nav-links{width:100%;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.nav-link{padding:9px 6px;font-size:12px}
          .brand{font-size:20px}.hero{min-height:360px}.hero-inner{padding:42px 16px 56px}.hero h1{font-size:36px}.hero p{font-size:15px}
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
          <div className="hero-copy">
            <h1>{siteSettings.heroTitle}</h1>
            <p>{siteSettings.heroSubtitle}</p>
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
            <DigitalClock label="Việt Nam" />
          </div>
        </div>
      </section>

      <main className="main">
        {page === 'home' && (
          <>
            <p className="home-lead">{siteSettings.homeLead}</p>
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

        {page === 'vfs' && (
          <section className="vfs-shell">
            <aside className="vfs-list">
              {VFS_CENTRES.map((centre) => (
                <button
                  key={centre.key}
                  className={`vfs-country ${activeVfs === centre.key ? 'on' : ''}`}
                  onClick={() => {
                    setActiveVfs(centre.key);
                    setVfsTab('overview');
                  }}
                >
                  {centre.flag} {centre.country}
                  <div className="source-sub">{centre.partner}</div>
                </button>
              ))}
            </aside>

            <section className="panel">
              <h2>{selectedVfs.flag} VFS Global - {selectedVfs.country}</h2>
              <p>{selectedVfs.overview}</p>
              <div className="vfs-tabs">
                {[
                  ['overview', 'Tổng quát'],
                  ['news', 'Tin mới nhất'],
                  ['address', 'Địa chỉ'],
                  ['contact', 'SĐT / Mail'],
                  ['docs', 'Hồ sơ'],
                  ['appointment', 'Đặt lịch'],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    className={`vfs-tab ${vfsTab === key ? 'on' : ''}`}
                    onClick={() => setVfsTab(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="vfs-grid">
                <div className="info-list">
                  {vfsTab === 'overview' && (
                    <>
                      <div className="info-card"><b>Quốc gia</b>{selectedVfs.country}</div>
                      <div className="info-card"><b>Trung tâm</b>{selectedVfs.partner}</div>
                      <div className="info-card"><b>Tổng quát</b>{selectedVfs.overview}</div>
                      <div className="info-card"><b>Nguồn tham khảo</b>{selectedVfs.source}</div>
                    </>
                  )}
                  {vfsTab === 'news' && (
                    <>
                      <div className="info-card"><b>Tin tức mới nhất</b>Luồng tin chính thức nằm trên trang VFS của từng quốc gia. Bấm nút bên dưới để xem thông báo thời gian thực.</div>
                      <a className="btn" href={selectedVfs.news} target="_blank" rel="noopener noreferrer">Mở trang tin VFS</a>
                    </>
                  )}
                  {vfsTab === 'address' && (
                    <>
                      <div className="info-card"><b>Địa chỉ</b>{selectedVfs.address}</div>
                      <div className="info-card"><b>Thành phố</b>{selectedVfs.city}</div>
                      <a className="btn" href={selectedVfs.map} target="_blank" rel="noopener noreferrer">Mở Google Maps</a>
                    </>
                  )}
                  {vfsTab === 'contact' && (
                    <>
                      <div className="info-card"><b>Số điện thoại</b>{selectedVfs.phone}</div>
                      <div className="info-card"><b>Email</b>{selectedVfs.email}</div>
                      <div className="info-card"><b>Thời gian làm việc</b>{selectedVfs.hours}</div>
                    </>
                  )}
                  {vfsTab === 'docs' && (
                    <>
                      <div className="info-card"><b>Thủ tục hồ sơ</b>{selectedVfs.documents}</div>
                      <div className="info-card"><b>Lưu ý</b>Thông tin hồ sơ thay đổi theo từng diện visa. Luôn đối chiếu checklist chính thức trước khi khách nộp.</div>
                    </>
                  )}
                  {vfsTab === 'appointment' && (
                    <>
                      <div className="info-card"><b>Link đặt lịch hẹn</b>Đi tới cổng đặt lịch/chọn dịch vụ chính thức.</div>
                      <a className="btn" href={selectedVfs.appointment} target="_blank" rel="noopener noreferrer">Đặt lịch / xem hướng dẫn</a>
                    </>
                  )}
                </div>
                <iframe
                  className="map-frame"
                  title={`Google Map ${selectedVfs.country}`}
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedVfs.address)}&output=embed`}
                />
              </div>
            </section>
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

        {page === 'admin' && (
          <section className="panel">
            <h2>⚙️ Quản trị nội dung nhanh</h2>
            <p>Phần này hoạt động như một bảng tùy biến đơn giản: chỉnh chữ, căn lề, cỡ font và bo góc giao diện ngay trên trình duyệt. Dữ liệu tin tức vẫn chạy tự động như cũ.</p>
            <div className="admin-grid">
              <div className="admin-field">
                <label>Tiêu đề intro</label>
                <textarea value={siteSettings.heroTitle} onChange={(event) => updateSiteSetting('heroTitle', event.target.value)} />
              </div>
              <div className="admin-field">
                <label>Mô tả intro</label>
                <textarea value={siteSettings.heroSubtitle} onChange={(event) => updateSiteSetting('heroSubtitle', event.target.value)} />
              </div>
              <div className="admin-field">
                <label>Text trang chủ</label>
                <textarea value={siteSettings.homeLead} onChange={(event) => updateSiteSetting('homeLead', event.target.value)} />
              </div>
              <div className="admin-field">
                <label>Credit cuối trang</label>
                <input value={siteSettings.designer} onChange={(event) => updateSiteSetting('designer', event.target.value)} />
              </div>
              <div className="admin-field">
                <label>Căn lề chữ</label>
                <select value={siteSettings.textAlign} onChange={(event) => updateSiteSetting('textAlign', event.target.value)}>
                  <option value="left">Trái</option>
                  <option value="center">Giữa</option>
                  <option value="right">Phải</option>
                  <option value="justify">Đều hai bên</option>
                </select>
              </div>
              <div className="admin-field">
                <label>Cỡ font tổng thể: {siteSettings.fontScale}%</label>
                <input type="range" min="90" max="112" value={siteSettings.fontScale} onChange={(event) => updateSiteSetting('fontScale', Number(event.target.value))} />
              </div>
              <div className="admin-field">
                <label>Bo góc card: {siteSettings.cardRadius}px</label>
                <input type="range" min="6" max="28" value={siteSettings.cardRadius} onChange={(event) => updateSiteSetting('cardRadius', Number(event.target.value))} />
              </div>
            </div>
            <div className="admin-actions">
              <button className="btn" onClick={() => navigate('home')}>Xem trang chủ</button>
              <button className="btn" onClick={resetSiteSettings}>Khôi phục mặc định</button>
            </div>
            <div style={{ height: 28 }} />
            <h2>✍️ Can thiệp bài viết thủ công</h2>
            <p>Thêm nhanh một bài/ghi chú để hiển thị trong tab Tin tức Lãnh sự. Phần này lưu trên trình duyệt quản trị, không làm ảnh hưởng luồng RSS tự động.</p>
            <div className="admin-grid">
              <div className="admin-field">
                <label>Tiêu đề bài/ghi chú</label>
                <input value={draftArticle.title} onChange={(event) => setDraftArticle({ ...draftArticle, title: event.target.value })} placeholder="Ví dụ: Lưu ý lịch hẹn Canada hôm nay..." />
              </div>
              <div className="admin-field">
                <label>Link bài viết</label>
                <input value={draftArticle.url} onChange={(event) => setDraftArticle({ ...draftArticle, url: event.target.value })} placeholder="https://..." />
              </div>
              <div className="admin-field">
                <label>Gắn vào quốc gia</label>
                <select value={draftArticle.country} onChange={(event) => setDraftArticle({ ...draftArticle, country: event.target.value })}>
                  {data.sources.map((source) => (
                    <option key={source.country} value={source.country}>{COUNTRY_LABELS[source.country] || source.country}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="admin-actions">
              <button className="btn" onClick={addCustomArticle}>Thêm bài thủ công</button>
              <button className="btn" onClick={() => navigate('news')}>Xem trong Tin tức</button>
            </div>
            {customArticles.length > 0 && (
              <div className="info-list" style={{ marginTop: 18 }}>
                {customArticles.map((article, index) => (
                  <div className="info-card" key={`${article.title}-${index}`}>
                    <b>{COUNTRY_LABELS[article.country] || article.country}</b>
                    {article.title}
                    <div className="admin-actions">
                      <button className="btn" onClick={() => removeCustomArticle(index)}>Xóa</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="footer">
        🍊 Consulate News Dashboard Portal · © 2026<br />
        Hệ thống đồng bộ dữ liệu tự động hoàn toàn lúc 7:00 SA mỗi ngày
        <div className="designer">Designed by {siteSettings.designer}</div>
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
