# BINGENZ.COM

Website landing page tĩnh được triển khai bằng Cloudflare Worker.

Tài liệu này tập trung vào các nội dung cần thiết cho việc bàn giao và chỉnh sửa:
- cấu trúc thư mục chính
- chức năng của từng file quan trọng
- muốn chỉnh phần nào thì cần sửa ở đâu
- quy trình build và deploy

## Cấu trúc thư mục

```text
bingenz-my-web/
├─ public/
│  ├─ index.html                # Cấu trúc trang, section, popup, modal, thông tin liên hệ
│  ├─ _headers                  # Header cho static asset
│  └─ assets/
│     ├─ css/
│     │  └─ main.css            # Toàn bộ giao diện: màu sắc, spacing, responsive, shadow, button
│     ├─ js/
│     │  ├─ app.js              # Logic popup, modal, copy, toast và tương tác UI
│     │  ├─ products.js         # Dữ liệu sản phẩm và thứ tự hiển thị
│     │  └─ head.js             # Script phụ cho phần head/khởi tạo
│     ├─ images/                # Ảnh sản phẩm, logo, icon
│     └─ fonts/                 # Font sử dụng trên website
├─ dist/                        # Bản build sinh ra từ public/, không chỉnh sửa trực tiếp
├─ scripts/
│  ├─ build.mjs                 # Build source từ public/ sang dist/
│  └─ check.mjs                 # Kiểm tra nhanh sau build
├─ .github/
│  └─ workflows/
│     └─ deploy-worker.yml      # Workflow auto-deploy khi push lên main
├─ share-meta.js                # Metadata dùng khi chia sẻ link
├─ sync-share-meta.js           # Đồng bộ metadata vào public/index.html
├─ wrangler.jsonc               # Cấu hình Cloudflare Worker
├─ package.json                 # Script npm
└─ README.md
```

## Hướng dẫn chỉnh sửa

Chỉnh nội dung hiển thị trên trang:
- `public/index.html`
- Dùng khi cần thay tiêu đề, mô tả, text nút, link mạng xã hội, số điện thoại, popup liên hệ hoặc nội dung section.

Chỉnh giao diện:
- `public/assets/css/main.css`
- Dùng khi cần thay màu sắc, gradient, khoảng cách, bo góc, shadow, responsive, card và button.

Chỉnh danh sách sản phẩm:
- `public/assets/js/products.js`
- Dùng khi cần thêm sản phẩm, sửa giá, đổi badge, thay ảnh hoặc đổi thứ tự hiển thị.

Chỉnh hành vi popup và tương tác:
- `public/assets/js/app.js`
- Dùng khi cần cập nhật logic mở popup, modal, copy số, toast, chuyển hướng hoặc hiệu ứng tương tác.

Chỉnh hình ảnh và icon:
- `public/assets/images/`
- Dùng khi cần thay logo, ảnh sản phẩm hoặc icon thương hiệu.

Chỉnh metadata khi chia sẻ link:
- `share-meta.js`
- Sau khi thay đổi file này, cần chạy lại `npm run build` để đồng bộ vào HTML.

Chỉnh cấu hình deploy:
- `wrangler.jsonc`
- `.github/workflows/deploy-worker.yml`

## Tác vụ thường gặp

Đổi số Zalo:
- sửa nội dung trong `public/index.html`
- nếu liên quan đến popup hoặc nút copy, sửa thêm trong `public/assets/js/app.js`

Đổi màu nút, card hoặc khoảng cách:
- sửa trong `public/assets/css/main.css`

Thêm sản phẩm mới:
- thêm object mới trong `public/assets/js/products.js`

Đổi thứ tự sản phẩm:
- chỉnh mảng thứ tự hiển thị trong `public/assets/js/products.js`

Đổi icon Zalo hoặc ảnh sản phẩm:
- thay file tương ứng trong `public/assets/images/`

Đổi tiêu đề và mô tả khi chia sẻ Facebook/Zalo:
- sửa `share-meta.js`

## Chạy local

```bash
npm install
npm run build
npm run check
```

Ý nghĩa các lệnh:
- `npm run build`: đồng bộ metadata và build từ `public/` sang `dist/`
- `npm run check`: kiểm tra nhanh asset và cấu hình sau build

## Deploy

Repository đã được cấu hình auto-deploy.

Quy trình triển khai:
1. Chỉnh sửa source trong `public/` hoặc file cấu hình liên quan
2. Commit thay đổi
3. Push lên nhánh `main`
4. GitHub Actions chạy workflow `deploy-worker.yml`
5. Cloudflare Worker cập nhật website

GitHub secret bắt buộc:
- `CLOUDFLARE_API_TOKEN`

## Lưu ý

- Không chỉnh sửa trực tiếp thư mục `dist/`
- Mọi thay đổi cần thực hiện ở source gốc trong `public/` hoặc file cấu hình tương ứng
- Nếu chỉnh `share-meta.js`, nên chạy lại `npm run build`
- Nếu website chưa cập nhật ngay sau deploy, thử tải lại bằng `Ctrl+F5`

## License

Copyright (c) 2026 BINGENZ.COM. All rights reserved.
