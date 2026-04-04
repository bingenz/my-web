# BinGenZ Website

Static landing page cho `bingenz.com`, build tu thu muc `public/` sang `dist/` va deploy qua Cloudflare.

## Cau truc repo

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

## File nao chinh phan gi

`public/index.html`

- Cau truc trang.
- Noi dung section, modal, popup, social links, so dien thoai.
- Metadata chia se mang xa hoi nhu `title`, `description`, `og:*`, `twitter:*`.

`public/assets/css/main.css`

- Toan bo giao dien: mau, gradient, spacing, card, button, popup, responsive.

`public/assets/js/products.js`

- Du lieu san pham.
- Gia, badge, tag, anh, thu tu hien thi.

`public/assets/js/app.js`

- Logic popup, modal, copy so dien thoai, toast, chuyen huong.

`public/assets/js/head.js`

- Logic khoi tao som trong phan `<head>`.

`public/assets/images/`

- Anh san pham, anh thuong hieu, logo dung trong UI.

## Metadata chia se link

Metadata hien duoc dat truc tiep trong `public/index.html`.

Neu muon chinh preview khi chia se len Facebook, Zalo, Telegram, Messenger:

- sua `<title>`
- sua `<meta name="description">`
- sua `og:title`
- sua `og:description`
- sua `twitter:title`
- sua `twitter:description`

Luu y:

- `og:image` hien de trong. Neu muon card chia se co anh co dinh, hay them URL anh public hop le vao `og:image`.
- Sau khi sua metadata, can build lai de cap nhat `dist/`.

## Chay local

```bash
npm install
npm run build
npm run check
```

Y nghia:

- `npm run build`: copy toan bo site tu `public/` sang `dist/`
- `npm run check`: kiem tra `dist/index.html`, asset refs va chay `wrangler check`

Muon xem nhanh local:

```bash
cd dist
python -m http.server 4173
```

Mo [http://localhost:4173](http://localhost:4173).

## Quy trinh chinh sua

1. Sua file trong `public/`
2. Chay `npm run build`
3. Chay `npm run check`
4. Xem lai local preview
5. Commit va push len `main`

## Deploy

Repo dang dung GitHub Actions qua `.github/workflows/deploy-worker.yml`.

Khi push len `main`, workflow se deploy ban moi len Cloudflare.

Secret bat buoc:

- `CLOUDFLARE_API_TOKEN`

## Luu y

- Khong sua truc tiep trong `dist/`
- `dist/` luon la output build tu `public/`
- Neu social preview chua cap nhat ngay sau deploy, cac nen tang mang xa hoi co the dang cache metadata cu

## License

Copyright (c) 2026 BinGenZ.
