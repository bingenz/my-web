# BINGENZ.COM

Landing page static deploy bằng Cloudflare Worker.

README này chỉ tập trung vào 3 việc:
- file nào dùng để làm gì
- muốn sửa phần nào thì vào file nào
- build và deploy ra sao

## Cây thư mục chính

```text
bingenz-my-web/
├─ public/
│  ├─ index.html                # Khung trang, section, popup, modal, link liên hệ
│  ├─ _headers                  # Header cho static asset
│  └─ assets/
│     ├─ css/
│     │  └─ main.css            # Toàn bộ giao diện, responsive, spacing, shadow, gradient
│     ├─ js/
│     │  ├─ app.js              # Logic popup, modal, copy, toast, tương tác UI
│     │  ├─ products.js         # Dữ liệu sản phẩm và thứ tự hiển thị
│     │  └─ head.js             # Script phụ cho head/boot
│     ├─ images/                # Ảnh sản phẩm, ảnh thương hiệu, icon
│     └─ fonts/                 # Font web
├─ dist/                        # Bản build tạo ra từ public/, không sửa tay
├─ scripts/
│  ├─ build.mjs                 # Build từ public/ sang dist/
│  └─ check.mjs                 # Check nhanh sau build
├─ .github/
│  └─ workflows/
│     └─ deploy-worker.yml      # Auto deploy khi push lên main
├─ share-meta.js                # Tiêu đề, mô tả, ảnh share
├─ sync-share-meta.js           # Đồng bộ meta vào public/index.html
├─ wrangler.jsonc               # Cấu hình Cloudflare Worker
├─ package.json                 # Script npm
└─ README.md
```

## Muốn sửa gì thì vào đâu

Sửa nội dung trang:
- `public/index.html`
- Dùng khi cần đổi tiêu đề, đoạn mô tả, text nút, link social, số điện thoại, block cộng đồng, popup liên hệ.

Sửa giao diện:
- `public/assets/css/main.css`
- Dùng khi cần đổi màu, gradient, shadow, bo góc, khoảng cách, responsive, style card, style button.

Sửa danh sách sản phẩm:
- `public/assets/js/products.js`
- Dùng khi cần thêm sản phẩm, đổi giá, đổi badge, đổi ảnh, đổi thứ tự hiển thị.

Sửa hành vi popup và tương tác:
- `public/assets/js/app.js`
- Dùng khi cần đổi logic mở popup, modal, copy số, toast, chuyển hướng, hiệu ứng tương tác.

Sửa ảnh:
- `public/assets/images/`
- Dùng khi cần thay icon, logo, ảnh sản phẩm.

Sửa thông tin chia sẻ link:
- `share-meta.js`
- Sau khi sửa file này nên chạy lại build để meta được sync vào HTML.

Sửa cấu hình deploy:
- `wrangler.jsonc`
- `.github/workflows/deploy-worker.yml`

## Một số tác vụ thường gặp

Đổi số Zalo:
- tìm trong `public/index.html`
- nếu logic popup/copy có liên quan thì sửa thêm trong `public/assets/js/app.js`

Đổi màu nút và card:
- sửa trong `public/assets/css/main.css`

Thêm sản phẩm mới:
- thêm object trong `public/assets/js/products.js`

Đổi thứ tự sản phẩm:
- sửa mảng thứ tự hiển thị trong `public/assets/js/products.js`

Đổi icon Zalo hoặc ảnh sản phẩm:
- thay file trong `public/assets/images/`

Đổi tiêu đề khi share Facebook/Zalo:
- sửa `share-meta.js`

## Chạy local

```bash
npm install
npm run build
npm run check
```

Ý nghĩa:
- `npm run build`: sync meta rồi build từ `public/` sang `dist/`
- `npm run check`: kiểm tra nhanh asset và cấu hình sau build

## Deploy

Repo đã có auto-deploy.

Luồng deploy:
1. sửa source trong `public/` hoặc file config liên quan
2. commit
3. push lên `main`
4. GitHub Actions chạy workflow `deploy-worker.yml`
5. Cloudflare Worker cập nhật site

Secret cần có trên GitHub:
- `CLOUDFLARE_API_TOKEN`

## Lưu ý

- Không sửa tay thư mục `dist/`
- Muốn web đổi thật thì sửa source ở `public/` hoặc file config gốc
- Nếu sửa `share-meta.js`, nên chạy `npm run build`
- Nếu web chưa đổi sau deploy, thử `Ctrl+F5`

## License

Copyright (c) 2026 BINGENZ.COM. All rights reserved.
