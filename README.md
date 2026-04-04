# BinGenZ Website

Static landing page cho `bingenz.com`, build từ thư mục `public/` sang `dist/` và deploy qua Cloudflare.

## Cấu trúc repo

```text
my-web/
|-- public/
|   |-- index.html
|   |-- _headers
|   `-- assets/
|       |-- css/main.css
|       |-- js/
|       |   |-- app.js
|       |   |-- head.js
|       |   `-- products.js
|       |-- images/
|       `-- fonts/
|-- scripts/
|   |-- build.mjs
|   `-- check.mjs
|-- .github/workflows/deploy-worker.yml
|-- wrangler.jsonc
|-- package.json
`-- README.md
```

## File nào chính phần gì

`public/index.html`

- Cấu trúc trang.
- Nội dung section, modal, popup, social links, số điện thoại.
- Metadata chia sẻ mạng xã hội như `title`, `description`, `og:*`, `twitter:*`.

`public/assets/css/main.css`

- Toàn bộ giao diện: màu, gradient, spacing, card, button, popup, responsive.

`public/assets/js/products.js`

- Dữ liệu sản phẩm.
- Giá, badge, tag, ảnh, thứ tự hiển thị.

`public/assets/js/app.js`

- Logic popup, modal, copy số điện thoại, toast, chuyển hướng.

`public/assets/js/head.js`

- Logic khởi tạo sớm trong phần `<head>`.

`public/assets/images/`

- Ảnh sản phẩm, ảnh thương hiệu, logo dùng trong UI.

## Metadata chia sẻ link

Metadata hiện được đặt trực tiếp trong `public/index.html`.

Nếu muốn chỉnh preview khi chia sẻ lên Facebook, Zalo, Telegram, Messenger:

- sửa `<title>`
- sửa `<meta name="description">`
- sửa `og:title`
- sửa `og:description`
- sửa `twitter:title`
- sửa `twitter:description`

Lưu ý:

- `og:image` hiện để trống. Nếu muốn card chia sẻ có ảnh cố định, hãy thêm URL ảnh public hợp lệ vào `og:image`.
- Sau khi sửa metadata, cần build lại để cập nhật `dist/`.

## Chạy local

```bash
npm install
npm run build
npm run check
```

Ý nghĩa:

- `npm run build`: copy toàn bộ site từ `public/` sang `dist/`
- `npm run check`: kiểm tra `dist/index.html`, asset refs và chạy `wrangler check`

Muốn xem nhanh local:

```bash
cd dist
python -m http.server 4173
```

Mở [http://localhost:4173](http://localhost:4173).

## Quy trình chỉnh sửa

1. Sửa file trong `public/`
2. Chạy `npm run build`
3. Chạy `npm run check`
4. Xem lại local preview
5. Commit và push lên `main`

## Deploy

Repo đang dùng GitHub Actions qua `.github/workflows/deploy-worker.yml`.

Khi push lên `main`, workflow sẽ deploy bản mới lên Cloudflare.

Secret bắt buộc:

- `CLOUDFLARE_API_TOKEN`

## Lưu ý

- Không sửa trực tiếp trong `dist/`
- `dist/` luôn là output build từ `public/`
- Nếu social preview chưa cập nhật ngay sau deploy, các nền tảng mạng xã hội có thể đang cache metadata cũ

## License

Copyright (c) 2026 BinGenZ.
