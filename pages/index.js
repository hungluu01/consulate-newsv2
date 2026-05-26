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

const DESTINATION_ALBUMS = {
  japan: {
    title: 'Nhật Bản',
    flag: '🇯🇵',
    mood: 'Đền cổ, phố đêm, đô thị hiện đại và mùa hoa.',
    images: [
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&q=82',
      'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=900&q=82',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=900&q=82',
      'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=900&q=82',
      'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=900&q=82',
      'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=900&q=82',
      'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=900&q=82',
      'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=900&q=82',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=900&q=82',
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=900&q=82',
    ],
  },
  usa: {
    title: 'Mỹ',
    flag: '🇺🇸',
    mood: 'Thành phố lớn, công viên quốc gia, bờ Tây và bờ Đông.',
    images: [
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=900&q=82',
      'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=900&q=82',
      'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=900&q=82',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=82',
      'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?w=900&q=82',
      'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&q=82',
      'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=900&q=82',
      'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=900&q=82',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&q=82',
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&q=82',
    ],
  },
  australia: {
    title: 'Úc',
    flag: '🇦🇺',
    mood: 'Biển, skyline, đại học, cảng và thiên nhiên rộng mở.',
    images: [
      'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=900&q=82',
      'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=900&q=82',
      'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?w=900&q=82',
      'https://images.unsplash.com/photo-1524293581917-878a6d017c71?w=900&q=82',
      'https://images.unsplash.com/photo-1549180030-48bf079fb38a?w=900&q=82',
      'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=900&q=82',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=82',
      'https://images.unsplash.com/photo-1516941064643-74aacd84843c?w=900&q=82',
      'https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?w=900&q=82',
      'https://images.unsplash.com/photo-1493375366763-3ed5e0e6d8ec?w=900&q=82',
    ],
  },
  canada: {
    title: 'Canada',
    flag: '🇨🇦',
    mood: 'Thiên nhiên lạnh, thành phố sạch, hồ lớn và rừng núi.',
    images: [
      'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=900&q=82',
      'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=900&q=82',
      'https://images.unsplash.com/photo-1609954584977-747e9ce78b78?w=900&q=82',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=82',
      'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=900&q=82',
      'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=900&q=82',
      'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=900&q=82',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=82',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=82',
      'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=900&q=82',
    ],
  },
  europe: {
    title: 'Châu Âu',
    flag: '🇪🇺',
    mood: 'Schengen, phố cổ, bảo tàng, quảng trường và kiến trúc.',
    images: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=82',
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=900&q=82',
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&q=82',
      'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=900&q=82',
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=900&q=82',
      'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=900&q=82',
      'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=900&q=82',
      'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=900&q=82',
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=900&q=82',
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=900&q=82',
    ],
  },
  korea: {
    title: 'Hàn Quốc',
    flag: '🇰🇷',
    mood: 'Seoul hiện đại, văn hóa, học tập, làm việc và giải trí.',
    images: [
      'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=900&q=82',
      'https://images.unsplash.com/photo-1538485399081-7c8ed1f9f152?w=900&q=82',
      'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=900&q=82',
      'https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?w=900&q=82',
      'https://images.unsplash.com/photo-1506816561089-5cc37b3aa9b0?w=900&q=82',
      'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?w=900&q=82',
      'https://images.unsplash.com/photo-1578637387939-43c525550085?w=900&q=82',
      'https://images.unsplash.com/photo-1521208916309-4a8f5e8e4b1c?w=900&q=82',
      'https://images.unsplash.com/photo-1558979158-65a1eaa08691?w=900&q=82',
      'https://images.unsplash.com/photo-1540960228859-3f2f9c8b9f9f?w=900&q=82',
    ],
  },
};

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

const SCHENGEN_VFS_ADDRESS = 'REE Tower, tầng 3B, 9 Đoàn Văn Bơ, Phường 13, Quận 4, TP.HCM';
const SCHENGEN_VFS_MAP = 'https://www.google.com/maps/search/?api=1&query=REE+Tower+9+Doan+Van+Bo+District+4+Ho+Chi+Minh';

function makeSchengenCentre({ key, country, flag, code }) {
  return {
    key,
    country,
    flag,
    partner: `VFS Global Schengen - ${country}`,
    city: 'TP.HCM',
    address: SCHENGEN_VFS_ADDRESS,
    phone: 'Theo tổng đài/biểu mẫu hỗ trợ trên trang VFS Global của từng quốc gia',
    email: 'Theo biểu mẫu hỗ trợ VFS Global',
    hours: 'Theo lịch hẹn và khung giờ trung tâm VFS tại 9 Đoàn Văn Bơ',
    overview: `${country} thuộc khối Schengen. Hồ sơ được quản lý theo checklist của cơ quan lãnh sự và luồng đặt lịch VFS Global tại TP.HCM.`,
    documents: 'Hộ chiếu, đơn Schengen, ảnh, bảo hiểm du lịch, lịch trình, chứng minh tài chính/công việc, giấy tờ mục đích chuyến đi và checklist theo từng nước.',
    appointment: `https://visa.vfsglobal.com/vnm/en/${code}/`,
    news: `https://visa.vfsglobal.com/vnm/en/${code}/`,
    map: SCHENGEN_VFS_MAP,
    source: `VFS Global ${country} Vietnam`,
  };
}

const SCHENGEN_VFS_CENTRES = [
  { key: 'austria', country: 'Áo', flag: '🇦🇹', code: 'aut' },
  { key: 'belgium', country: 'Bỉ', flag: '🇧🇪', code: 'bel' },
  { key: 'bulgaria', country: 'Bulgaria', flag: '🇧🇬', code: 'bgr' },
  { key: 'croatia', country: 'Croatia', flag: '🇭🇷', code: 'hrv' },
  { key: 'czech', country: 'Séc', flag: '🇨🇿', code: 'cze' },
  { key: 'denmark', country: 'Đan Mạch', flag: '🇩🇰', code: 'dnk' },
  { key: 'estonia', country: 'Estonia', flag: '🇪🇪', code: 'est' },
  { key: 'finland', country: 'Phần Lan', flag: '🇫🇮', code: 'fin' },
  { key: 'germany', country: 'Đức', flag: '🇩🇪', code: 'deu' },
  { key: 'greece', country: 'Hy Lạp', flag: '🇬🇷', code: 'grc' },
  { key: 'hungary', country: 'Hungary', flag: '🇭🇺', code: 'hun' },
  { key: 'iceland', country: 'Iceland', flag: '🇮🇸', code: 'isl' },
  { key: 'italy', country: 'Ý', flag: '🇮🇹', code: 'ita' },
  { key: 'latvia', country: 'Latvia', flag: '🇱🇻', code: 'lva' },
  { key: 'liechtenstein', country: 'Liechtenstein', flag: '🇱🇮', code: 'lie' },
  { key: 'lithuania', country: 'Lithuania', flag: '🇱🇹', code: 'ltu' },
  { key: 'luxembourg', country: 'Luxembourg', flag: '🇱🇺', code: 'lux' },
  { key: 'malta', country: 'Malta', flag: '🇲🇹', code: 'mlt' },
  { key: 'netherlands', country: 'Hà Lan', flag: '🇳🇱', code: 'nld' },
  { key: 'norway', country: 'Na Uy', flag: '🇳🇴', code: 'nor' },
  { key: 'poland', country: 'Ba Lan', flag: '🇵🇱', code: 'pol' },
  { key: 'portugal', country: 'Bồ Đào Nha', flag: '🇵🇹', code: 'prt' },
  { key: 'romania', country: 'Romania', flag: '🇷🇴', code: 'rou' },
  { key: 'slovakia', country: 'Slovakia', flag: '🇸🇰', code: 'svk' },
  { key: 'slovenia', country: 'Slovenia', flag: '🇸🇮', code: 'svn' },
  { key: 'spain', country: 'Tây Ban Nha', flag: '🇪🇸', code: 'esp' },
  { key: 'sweden', country: 'Thụy Điển', flag: '🇸🇪', code: 'swe' },
  { key: 'switzerland', country: 'Thụy Sĩ', flag: '🇨🇭', code: 'che' },
].map(makeSchengenCentre);

const VFS_CENTRES = [
  {
    key: 'canada',
    country: 'Canada',
    flag: '🇨🇦',
    partner: 'Canada Visa Application Centre',
    city: 'TP.HCM',
    address: 'Tầng 9, Tháp Cienco 4, 180 Nguyễn Thị Minh Khai, Phường Xuân Hòa, TP.HCM',
    phone: '+84 28 3622 0988',
    email: 'Liên hệ qua biểu mẫu/email trên trang VAC Canada hoặc Canada.ca',
    hours: 'Thứ Hai - Thứ Sáu, 09:00 - 17:00',
    overview: 'Canada VAC hỗ trợ sinh trắc học, đặt lịch hẹn, nhận hồ sơ/hộ chiếu và các dịch vụ theo quy trình IRCC.',
    documents: 'BIL nếu có, hộ chiếu, thư yêu cầu nộp hộ chiếu/tài liệu bổ sung, giấy hẹn và giấy tờ theo checklist IRCC.',
    appointment: 'https://visa.vfsglobal.com/vnm/en/can/',
    news: 'https://www.canada.ca/en.html',
    map: 'https://www.google.com/maps/search/?api=1&query=180+Nguyen+Thi+Minh+Khai+Cienco+4+Tower+Ho+Chi+Minh',
    source: 'Canada.ca / VFS Canada Vietnam',
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
    overview: 'VFS Global hỗ trợ dịch vụ sinh trắc học và dịch vụ liên quan cho Bộ Nội vụ Úc tại Việt Nam.',
    documents: 'Hộ chiếu, giấy hẹn sinh trắc học, thư yêu cầu sinh trắc học và giấy tờ theo hồ sơ ImmiAccount.',
    appointment: 'https://visa.vfsglobal.com/vnm/en/aus/',
    news: 'https://www.homeaffairs.gov.au/#',
    map: 'https://www.google.com/maps/search/?api=1&query=Australian+Biometric+Collection+Centre+VFS+Ho+Chi+Minh',
    source: 'Home Affairs Australia / VFS Australia Vietnam',
  },
  {
    key: 'uk',
    country: 'Anh Quốc',
    flag: '🇬🇧',
    partner: 'UK Visa Application Centre',
    city: 'TP.HCM',
    address: 'Theo trang Find a centre của VFS UKVI Vietnam',
    phone: 'Theo kênh hỗ trợ VFS/UKVI trên trang chính thức',
    email: 'Theo biểu mẫu hỗ trợ VFS/UKVI',
    hours: 'Theo lịch hẹn đang mở trên VFS UKVI',
    overview: 'VFS Global là đối tác của UK Visas and Immigration, hỗ trợ đặt lịch và tiếp nhận sinh trắc học/hồ sơ theo quy trình UKVI.',
    documents: 'Checklist UKVI, hộ chiếu, giấy hẹn, tài liệu hỗ trợ đã tải lên hoặc bản giấy theo yêu cầu từng diện.',
    appointment: 'https://visa.vfsglobal.com/vnm/en/gbr/',
    news: 'https://visa.vfsglobal.com/vnm/en/gbr/',
    map: 'https://www.google.com/maps/search/?api=1&query=VFS+Global+UK+Visa+Application+Centre+Ho+Chi+Minh',
    source: 'VFS UKVI Vietnam',
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
    hours: '08:30 - 12:00 và 13:00 - 16:00; nộp hồ sơ 08:30 - 12:00 và 13:00 - 15:00',
    overview: 'Trung tâm tiếp nhận hồ sơ visa Nhật Bản tại TP.HCM, có phí dịch vụ theo thông báo VFS.',
    documents: 'Hộ chiếu, đơn xin visa, ảnh, giấy tờ chứng minh mục đích chuyến đi và checklist theo diện nộp.',
    appointment: 'https://visa.vfsglobal.com/vnm/vi/jpn/',
    news: 'https://visa.vfsglobal.com/vnm/vi/jpn/',
    map: 'https://www.google.com/maps/search/?api=1&query=93+Nguyen+Du+President+Tower+Ho+Chi+Minh',
    source: 'VFS Japan Vietnam',
  },
  {
    key: 'france',
    country: 'Pháp',
    flag: '🇫🇷',
    partner: 'TLScontact France Visa Application Centre',
    city: 'TP.HCM',
    address: 'TLScontact tại Vincom Center Đồng Khởi, Quận 1, TP.HCM',
    phone: 'Theo kênh chính thức France-Visas/TLScontact',
    email: 'Theo biểu mẫu chính thức France-Visas/TLScontact',
    hours: 'Theo lịch hẹn TLScontact',
    overview: 'Pháp dùng France-Visas và TLScontact tại TP.HCM; mục này tách riêng khỏi cụm VFS Schengen để tránh nhầm luồng đặt lịch.',
    documents: 'Hồ sơ Schengen Pháp, bảo hiểm, lịch trình, chứng minh tài chính/công việc và giấy tờ theo checklist France-Visas.',
    appointment: 'https://france-visas.gouv.fr/',
    news: 'https://france-visas.gouv.fr/',
    map: 'https://www.google.com/maps/search/?api=1&query=TLScontact+Vincom+Center+Dong+Khoi+Ho+Chi+Minh',
    source: 'France-Visas / TLScontact',
  },
  ...SCHENGEN_VFS_CENTRES,
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
  const [vfsGroup, setVfsGroup] = useState('all');
  const [activeAlbum, setActiveAlbum] = useState('japan');
  const [backStack, setBackStack] = useState([]);
  const [forwardStack, setForwardStack] = useState([]);
  const [customArticles, setCustomArticles] = useState([]);
  const [draftArticle, setDraftArticle] = useState({ title: '', url: '', country: 'my' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLogin, setAdminLogin] = useState({ username: '', password: '' });
  const [adminError, setAdminError] = useState('');

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
    fetch('/api/admin-session')
      .then((res) => res.json())
      .then((session) => setIsAdmin(Boolean(session.isAdmin)))
      .catch(() => setIsAdmin(false));
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

  function viewSnapshot() {
    return { page, activeCountry, activeVfs, vfsTab, activeAlbum };
  }

  function applySnapshot(snapshot) {
    setPage(snapshot.page);
    setActiveCountry(snapshot.activeCountry);
    setActiveVfs(snapshot.activeVfs);
    setVfsTab(snapshot.vfsTab);
    setActiveAlbum(snapshot.activeAlbum);
  }

  function rememberCurrent() {
    setBackStack((stack) => [...stack, viewSnapshot()].slice(-24));
    setForwardStack([]);
  }

  function goBack() {
    setBackStack((stack) => {
      if (stack.length === 0) return stack;
      const previous = stack[stack.length - 1];
      setForwardStack((future) => [viewSnapshot(), ...future].slice(0, 24));
      applySnapshot(previous);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return stack.slice(0, -1);
    });
  }

  function goForward() {
    setForwardStack((future) => {
      if (future.length === 0) return future;
      const next = future[0];
      setBackStack((stack) => [...stack, viewSnapshot()].slice(-24));
      applySnapshot(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return future.slice(1);
    });
  }

  function navigate(nextPage) {
    rememberCurrent();
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
    rememberCurrent();
    setActiveCountry(country);
    setPage('news');
    setExpandedSources({});
    setTimeout(() => {
      document.getElementById('news-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  function selectVfs(key) {
    rememberCurrent();
    setActiveVfs(key);
    setVfsTab('overview');
  }

  function selectVfsTab(key) {
    rememberCurrent();
    setVfsTab(key);
  }

  function selectAlbum(key) {
    rememberCurrent();
    setActiveAlbum(key);
  }

  async function handleAdminLogin() {
    setAdminError('');
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminLogin),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Không thể đăng nhập');
      setIsAdmin(true);
      setAdminLogin({ username: '', password: '' });
    } catch (error) {
      setAdminError(error.message || 'Không thể đăng nhập');
    }
  }

  async function handleAdminLogout() {
    await fetch('/api/admin-logout', { method: 'POST' });
    setIsAdmin(false);
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
  const selectedAlbum = DESTINATION_ALBUMS[activeAlbum] || DESTINATION_ALBUMS.japan;
  const visibleVfsCentres = VFS_CENTRES.filter((centre) => {
    if (vfsGroup === 'schengen') return SCHENGEN_VFS_CENTRES.some((item) => item.key === centre.key);
    if (vfsGroup === 'other') return !SCHENGEN_VFS_CENTRES.some((item) => item.key === centre.key);
    return true;
  });

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
        .page{min-height:100vh;background:
          radial-gradient(circle at 8% 7%,rgba(245,188,115,.36),transparent 26%),
          radial-gradient(circle at 84% 12%,rgba(45,75,255,.18),transparent 30%),
          radial-gradient(circle at 70% 72%,rgba(14,165,233,.10),transparent 28%),
          linear-gradient(180deg,#fff7ef 0%,#f8fafc 34%,#f4f7fb 100%);font-size:var(--site-scale)}
        .page::before{content:"";position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(15,23,42,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(15,23,42,.045) 1px,transparent 1px);background-size:42px 42px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.55),transparent 66%);z-index:0}
        .page::after{content:"";position:fixed;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 0%,rgba(255,255,255,.46) 42%,transparent 58%);mix-blend-mode:overlay;animation:pageGlow 12s ease-in-out infinite;z-index:0}
        @keyframes pageGlow{0%,100%{transform:translateX(-28%)}50%{transform:translateX(24%)}}
        .nav,.hero,.main,.footer{position:relative;z-index:1}
        .nav{position:sticky;top:0;z-index:40;background:rgba(255,255,255,.82);backdrop-filter:blur(24px);border-bottom:1px solid rgba(226,232,240,.78);box-shadow:0 14px 44px rgba(15,23,42,.06)}
        .nav-inner{max-width:1500px;margin:0 auto;min-height:78px;padding:12px 28px;display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:18px}
        .brand{border:0;background:transparent;display:flex;align-items:center;gap:10px;color:#cf7135;font-size:23px;font-weight:950;letter-spacing:0;padding:8px 0;white-space:nowrap}
        .brand-mark{font-size:25px;filter:drop-shadow(0 5px 10px rgba(210,113,53,.25))}
        .nav-links{display:grid;grid-template-columns:repeat(6,max-content);align-items:center;justify-content:end;gap:10px;min-width:0}
        .nav-link{border:1px solid transparent;background:transparent;color:#465268;border-radius:14px;padding:10px 15px;font-weight:900;font-size:15px;white-space:nowrap;min-width:0}
        .nav-link:hover,.nav-link.on{background:linear-gradient(135deg,#fff7eb,#fff);border-color:#f7d7aa;color:#ce7036;box-shadow:0 12px 26px rgba(206,112,54,.12)}
        .nav-link.outline{background:linear-gradient(135deg,#fff7eb,#fff);color:#ce7036}
        .quick-nav{position:fixed;inset:0;z-index:42;pointer-events:none}
        .quick-btn{position:absolute;top:50%;transform:translateY(-50%);pointer-events:auto;border:1px solid rgba(245,188,115,.72);background:rgba(255,255,255,.72);backdrop-filter:blur(18px);color:#ce7036;border-radius:999px;width:42px;height:42px;padding:0;font-size:20px;font-weight:950;box-shadow:0 16px 36px rgba(206,112,54,.18)}
        .quick-left{left:16px}
        .quick-right{right:16px}
        .quick-btn:disabled{opacity:.36;cursor:not-allowed}
        .quick-btn:not(:disabled):hover{color:#101828;border-color:#ce7036;transform:translateY(-2px)}
        .hero{position:relative;overflow:hidden;color:white;min-height:430px;background:#151022;border-bottom:1px solid rgba(255,255,255,.5)}
        .hero.compact{min-height:260px}
        .hero-bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:0;transform:scale(1.04);transition:opacity 1.2s ease,transform 6s ease}
        .hero-bg.active{opacity:1;transform:scale(1.1)}
        .hero::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(35,19,39,.92),rgba(206,112,54,.72) 43%,rgba(255,255,255,.78));z-index:1}
        .hero::before{content:"";position:absolute;inset:0;background:linear-gradient(120deg,transparent 0%,rgba(255,255,255,.2) 45%,transparent 70%);mix-blend-mode:soft-light;animation:sheen 10s ease-in-out infinite;z-index:2;pointer-events:none}
        @keyframes sheen{0%,100%{transform:translateX(-35%)}50%{transform:translateX(28%)}}
        .hero-inner{position:relative;z-index:3;max-width:1500px;margin:0 auto;padding:70px 28px 76px;display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:32px;align-items:center}
        .hero.compact .hero-inner{padding:44px 28px 52px}
        .hero-copy{text-align:var(--site-align)}
        .hero h1{font-family:"Playfair Display",Georgia,"Times New Roman",serif;font-size:clamp(36px,4.1vw,62px);line-height:1.08;letter-spacing:0;margin:0 0 18px;max-width:820px;text-wrap:balance}
        .hero p{font-size:18px;line-height:1.6;margin:0;color:rgba(255,255,255,.94);max-width:760px;font-weight:700}
        .hero-actions{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:28px}
        .btn{border:1px solid rgba(245,188,115,.7);background:linear-gradient(135deg,#fff,#fff7eb);color:#ce7036;border-radius:14px;padding:14px 20px;font-weight:950;box-shadow:0 18px 35px rgba(122,63,28,.16)}
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
        .future-strip{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin:0 0 26px}
        .future-tile{position:relative;overflow:hidden;border:1px solid rgba(245,188,115,.54);border-radius:18px;background:linear-gradient(135deg,rgba(255,255,255,.86),rgba(255,247,235,.72));backdrop-filter:blur(16px);padding:18px;box-shadow:0 18px 40px rgba(206,112,54,.09)}
        .future-tile::after{content:"";position:absolute;right:-22px;top:-22px;width:78px;height:78px;border-radius:50%;background:radial-gradient(circle,rgba(206,112,54,.22),transparent 68%)}
        .future-tile b{display:block;font-size:26px;line-height:1;color:#101828}
        .future-tile span{display:block;margin-top:8px;color:#697386;font-size:12px;font-weight:950;text-transform:uppercase;letter-spacing:.06em}
        .category-card{position:relative;border:1px solid rgba(226,232,240,.86);background:rgba(255,255,255,.78);backdrop-filter:blur(18px);border-radius:var(--card-radius);overflow:hidden;text-align:left;box-shadow:0 18px 42px rgba(15,23,42,.08);transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}
        .category-card::after{content:"";position:absolute;inset:auto 18px 18px auto;width:90px;height:90px;border-radius:50%;background:radial-gradient(circle,rgba(245,188,115,.38),transparent 66%);pointer-events:none}
        .category-card:hover{transform:translateY(-7px);box-shadow:0 30px 70px rgba(15,23,42,.14);border-color:#f5bc73}
        .category-img{height:210px;background-size:cover;background-position:center;filter:saturate(1.06) contrast(1.02)}
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
        .panel{background:rgba(255,255,255,.84);backdrop-filter:blur(18px);border:1px solid rgba(226,232,240,.84);border-radius:var(--card-radius);padding:44px;box-shadow:0 24px 60px rgba(15,23,42,.08);text-align:var(--site-align)}
        .panel h2{font-family:"Playfair Display",Georgia,"Times New Roman",serif;color:#ce7036;font-size:36px;line-height:1.18;margin:0 0 12px;letter-spacing:0;text-wrap:balance}
        .panel p{font-size:17px;line-height:1.65;color:#697386}
        .procedure-list{border-left:4px solid #d57435;padding-left:22px;margin-top:30px;display:grid;gap:18px}
        .procedure-list b{color:#465268}
        .gallery-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}
        .gallery-item{height:210px;background-size:cover;background-position:center;border-radius:13px;border:1px solid #e2e8f0;box-shadow:0 12px 28px rgba(15,23,42,.06)}
        .album-tabs{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin:22px 0}
        .album-tab{border:1px solid #e2e8f0;background:#fff;border-radius:14px;padding:13px 12px;font-weight:950;color:#465268;text-align:left;box-shadow:0 10px 22px rgba(15,23,42,.04)}
        .album-tab.on{background:#172033;color:#fff;border-color:#172033}
        .album-hero{border:1px solid #e2e8f0;background:linear-gradient(135deg,#fff,#fff7eb);border-radius:18px;padding:20px;margin:6px 0 18px;display:flex;align-items:center;justify-content:space-between;gap:16px}
        .album-hero h3{margin:0;font-size:24px;color:#101828}
        .album-hero p{margin:6px 0 0;color:#697386;font-weight:700}
        .vfs-shell{display:grid;grid-template-columns:310px minmax(0,1fr);gap:20px}
        .vfs-list{display:grid;gap:10px;align-content:start;max-height:780px;overflow:auto;padding-right:4px}
        .vfs-list::-webkit-scrollbar{width:6px}.vfs-list::-webkit-scrollbar-thumb{background:#f5bc73;border-radius:999px}
        .vfs-filter{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-bottom:4px;position:sticky;top:0;z-index:2;background:rgba(248,250,252,.92);backdrop-filter:blur(10px);padding-bottom:8px}
        .vfs-filter button{border:1px solid #e2e8f0;background:#fff;border-radius:999px;padding:9px 8px;font-size:12px;font-weight:950;color:#465268}
        .vfs-filter button.on{background:#172033;color:#fff;border-color:#172033}
        .vfs-country{border:1px solid rgba(226,232,240,.9);background:rgba(255,255,255,.86);border-radius:14px;padding:14px;text-align:left;font-weight:950;color:#465268;box-shadow:0 10px 24px rgba(15,23,42,.04)}
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
        .admin-lock{max-width:560px;margin:0 auto;text-align:left}
        .admin-lock-card{border:1px solid rgba(245,188,115,.72);background:linear-gradient(135deg,#fff,#fff7eb);border-radius:22px;padding:26px;box-shadow:0 22px 52px rgba(206,112,54,.12)}
        .admin-lock-card h2{margin-top:0}
        .empty,.loading{text-align:center;background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:52px 20px;color:#697386;font-weight:800}
        .to-top{position:fixed;right:28px;bottom:28px;width:56px;height:56px;border-radius:50%;border:0;background:#d57435;color:#fff;font-size:26px;box-shadow:0 18px 36px rgba(213,116,53,.35);z-index:50}
        .toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:#172033;color:white;border-radius:999px;padding:13px 20px;font-weight:900;box-shadow:0 16px 34px rgba(15,23,42,.22);z-index:60}
        .footer{border-top:1px solid #e2e8f0;background:#fff;text-align:center;color:#97a1b3;padding:25px;font-weight:750}
        .designer{margin-top:8px;color:#ce7036;font-weight:950}
        @media(max-width:1000px){
          .nav-inner{grid-template-columns:1fr}.nav-links{justify-content:stretch;grid-template-columns:repeat(3,minmax(0,1fr));width:100%}.nav-link{text-align:center;padding:10px 8px;font-size:14px}
          .hero-inner{grid-template-columns:1fr}.hero-card{display:none}.home-grid,.article-grid{grid-template-columns:1fr 1fr}.gallery-grid{grid-template-columns:1fr 1fr}.future-strip{grid-template-columns:repeat(2,minmax(0,1fr))}
          .vfs-shell,.vfs-grid,.admin-grid{grid-template-columns:1fr}
        }
        @media(max-width:720px){
          .nav-inner{padding:10px 14px;align-items:flex-start;gap:10px}.nav-links{width:100%;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.nav-link{padding:9px 6px;font-size:12px}
          .brand{font-size:20px}.hero{min-height:360px}.hero-inner{padding:42px 16px 56px}.hero h1{font-size:36px}.hero p{font-size:15px}
          .main{padding:24px 14px 52px}.home-grid,.article-grid,.gallery-grid,.future-strip{grid-template-columns:1fr}.search-row{grid-template-columns:1fr}.source-head{align-items:flex-start;flex-direction:column}
          .sitemap{grid-template-columns:repeat(2,minmax(0,1fr))}.panel{padding:26px}.panel h2{font-size:29px}.gallery-item{height:220px}
          .quick-btn{top:auto;bottom:82px}.quick-left{left:14px}.quick-right{right:14px}.to-top{right:18px;bottom:18px}.album-hero{align-items:flex-start;flex-direction:column}
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

      <div className="quick-nav" aria-label="Điều hướng nhanh">
        <button className="quick-btn quick-left" onClick={goBack} disabled={backStack.length === 0} title="Quay trở lại">‹</button>
        <button className="quick-btn quick-right" onClick={goForward} disabled={forwardStack.length === 0} title="Quay tới">›</button>
      </div>

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
            <div className="future-strip">
              <div className="future-tile">
                <b>{totalArticles}</b>
                <span>Bài tin đang theo dõi</span>
              </div>
              <div className="future-tile">
                <b>{data.sources.length}</b>
                <span>Nguồn lãnh sự tự động</span>
              </div>
              <div className="future-tile">
                <b>{VFS_CENTRES.length}</b>
                <span>Hồ sơ VFS/TLS/VAC</span>
              </div>
              <div className="future-tile">
                <b>{Object.keys(DESTINATION_ALBUMS).length}</b>
                <span>Album destination</span>
              </div>
            </div>
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
              <div className="vfs-filter">
                {[
                  ['all', 'Tất cả'],
                  ['schengen', 'Schengen'],
                  ['other', 'Khác'],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    className={vfsGroup === key ? 'on' : ''}
                    onClick={() => setVfsGroup(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {visibleVfsCentres.map((centre) => (
                <button
                  key={centre.key}
                  className={`vfs-country ${activeVfs === centre.key ? 'on' : ''}`}
                  onClick={() => selectVfs(centre.key)}
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
                    onClick={() => selectVfsTab(key)}
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
            <p>Thư viện ảnh landscape thực tế phục vụ thiết kế nội dung truyền thông tư vấn, chia theo từng destination để chọn nhanh đúng ngữ cảnh.</p>
            <div className="album-tabs">
              {Object.entries(DESTINATION_ALBUMS).map(([key, album]) => (
                <button
                  key={key}
                  className={`album-tab ${activeAlbum === key ? 'on' : ''}`}
                  onClick={() => selectAlbum(key)}
                >
                  {album.flag} {album.title}
                </button>
              ))}
            </div>
            <div className="album-hero">
              <div>
                <h3>{selectedAlbum.flag} Album {selectedAlbum.title}</h3>
                <p>{selectedAlbum.mood}</p>
              </div>
              <span className="btn soft" style={{ background: '#fff7eb', color: '#ce7036', borderColor: '#f5bc73' }}>
                {selectedAlbum.images.length} pictures
              </span>
            </div>
            <div className="gallery-grid">
              {selectedAlbum.images.map((image, index) => (
                <div
                  className="gallery-item"
                  key={`${activeAlbum}-${image}-${index}`}
                  style={{ backgroundImage: `url(${image})` }}
                  title={`${selectedAlbum.title} ${index + 1}`}
                />
              ))}
            </div>
          </section>
        )}

        {page === 'admin' && (
          <section className="panel">
            {!isAdmin ? (
              <div className="admin-lock">
                <div className="admin-lock-card">
                  <h2>🔐 Khu vực quản trị</h2>
                  <p>Chỉ tài khoản được anh cấp quyền mới chỉnh sửa được nội dung, giao diện và bài viết thủ công.</p>
                  <div className="admin-field">
                    <label>Tài khoản</label>
                    <input value={adminLogin.username} onChange={(event) => setAdminLogin({ ...adminLogin, username: event.target.value })} placeholder="username" />
                  </div>
                  <div className="admin-field" style={{ marginTop: 12 }}>
                    <label>Mật khẩu</label>
                    <input type="password" value={adminLogin.password} onChange={(event) => setAdminLogin({ ...adminLogin, password: event.target.value })} placeholder="password" onKeyDown={(event) => { if (event.key === 'Enter') handleAdminLogin(); }} />
                  </div>
                  {adminError && <p style={{ color: '#b42318', fontWeight: 900 }}>{adminError}</p>}
                  <div className="admin-actions">
                    <button className="btn" onClick={handleAdminLogin}>Đăng nhập quản trị</button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h2>⚙️ Quản trị nội dung nhanh</h2>
                <p>Phần này hoạt động như một bảng tùy biến đơn giản: chỉnh chữ, căn lề, cỡ font và bo góc giao diện ngay trên trình duyệt. Dữ liệu tin tức vẫn chạy tự động như cũ.</p>
                <div className="admin-actions">
                  <button className="btn" onClick={handleAdminLogout}>Đăng xuất quản trị</button>
                </div>
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
              </>
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
