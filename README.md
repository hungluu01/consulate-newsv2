# Kênh Cập Nhật Tin Tức Visa

Website Next.js theo dõi tin tức visa/lãnh sự từ các nguồn chính thống và lưu dữ liệu vào Upstash Redis.

## Tính năng

- Giao diện tiếng Việt/tiếng Anh.
- Lọc theo quốc gia/nguồn tin.
- Tìm kiếm nhanh theo tiêu đề hoặc nguồn.
- Đánh dấu tin đã đọc và tin mới trên từng trình duyệt.
- API cập nhật RSS thủ công hoặc tự động bằng Vercel Cron.

## Chạy thử trên máy

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

## Biến môi trường cần có

Tạo file `.env.local` khi chạy trên máy hoặc thêm trực tiếp trong Vercel:

```env
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
CRON_SECRET=mot-chuoi-bi-mat
NEXT_PUBLIC_CRON_SECRET=mot-chuoi-bi-mat
ADMIN_USER=hungluu
ADMIN_PASS=mat-khau-rieng-cua-anh
```

Ghi chú:

- `UPSTASH_REDIS_REST_URL` và `UPSTASH_REDIS_REST_TOKEN` dùng để lưu dữ liệu tin tức.
- `CRON_SECRET` bảo vệ API cập nhật tin.
- `NEXT_PUBLIC_CRON_SECRET` giúp nút Cập nhật trên giao diện gọi được API. Nếu không muốn lộ secret trên trình duyệt, hãy bỏ nút cập nhật công khai và chỉ dùng Vercel Cron.
- `ADMIN_USER` và `ADMIN_PASS` dùng để đăng nhập tab Quản trị.
- Nếu muốn cấp quyền cho nhiều người, dùng `ADMIN_USERS` thay cho `ADMIN_USER/ADMIN_PASS`, ví dụ:

```env
ADMIN_USERS=[{"username":"hungluu","password":"mat-khau-1"},{"username":"staff","password":"mat-khau-2"}]
```

## Deploy lên Vercel

1. Đẩy code lên GitHub.
2. Vào Vercel, chọn **Add New Project**.
3. Import repo GitHub mới.
4. Thêm các biến môi trường ở phần **Settings → Environment Variables**.
5. Deploy.
6. Sau deploy, mở `/api/fetch-news` một lần hoặc bấm nút **Cập nhật** trên web để tạo dữ liệu ban đầu.

Lịch tự động nằm trong `vercel.json`. Vercel Cron dùng UTC, nên cấu hình hiện tại `0 0 * * *` tương ứng 7:00 sáng tại Việt Nam.
