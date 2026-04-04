# BinGenZ Website

Landing page t)nh cho `bingenz.com`, build t� th� m�c `public/` sang `dist/` v� deploy qua Cloudflare.

## C�u tr�c repo

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
|-- dist/
|-- .github/workflows/deploy-worker.yml
|-- wrangler.jsonc
|-- package.json
`-- README.md
```

## File n�o ch�nh ph�n g�

`public/index.html`

- C�u tr�c trang.
- N�i dung section, modal, popup, social links, s� i�n tho�i.
- Metadata chia s� m�ng x� h�i nh� `title`, `description`, `og:*`, `twitter:*`.

`public/assets/css/main.css`

- To�n b� giao di�n: m�u, gradient, spacing, card, button, popup, responsive.

`public/assets/js/products.js`

- D� li�u s�n ph�m.
- Gi�, badge, tag, �nh, th� t� hi�n th�.

`public/assets/js/app.js`

- Logic popup, modal, copy s� i�n tho�i, toast, chuy�n h��ng.

`public/assets/js/head.js`

- Logic kh�i t�o s�m trong ph�n `<head>`.

`public/assets/images/`

- �nh s�n ph�m, �nh th��ng hi�u, logo d�ng trong UI.

## Metadata chia s� link

Metadata hi�n ��c �t tr�c ti�p trong `public/index.html`.

N�u mu�n ch�nh preview khi chia s� l�n Facebook, Zalo, Telegram, Messenger:

- s�a `<title>`
- s�a `<meta name="description">`
- s�a `og:title`
- s�a `og:description`
- s�a `twitter:title`
- s�a `twitter:description`

L�u �:

- `og:image` hi�n ang � tr�ng. N�u mu�n card chia s� c� �nh c� �nh, h�y th�m URL �nh public h�p l� v�o `og:image`.
- Sau khi s�a metadata, c�n build l�i � c�p nh�t `dist/`.

## Ch�y local

```bash
npm install
npm run build
npm run check
```

� ngh)a:

- `npm run build`: copy to�n b� site t� `public/` sang `dist/`
- `npm run check`: ki�m tra `dist/index.html`, asset refs v� ch�y `wrangler check`

Mu�n xem nhanh local:

```bash
cd dist
python -m http.server 4173
```

M� [http://localhost:4173](http://localhost:4173).

## Quy tr�nh ch�nh s�a

1. S�a file trong `public/`
2. Ch�y `npm run build`
3. Ch�y `npm run check`
4. Xem l�i local preview
5. Commit v� push l�n `main`

## Deploy

Repo ang d�ng GitHub Actions qua `.github/workflows/deploy-worker.yml`.

Khi push l�n `main`, workflow s� deploy b�n m�i l�n Cloudflare.

Secret b�t bu�c:

- `CLOUDFLARE_API_TOKEN`

## L�u �

- Kh�ng s�a tr�c ti�p trong `dist/`
- `dist/` lu�n l� output build t� `public/`
- N�u social preview ch�a c�p nh�t ngay sau deploy, c�c n�n t�ng m�ng x� h�i c� th� ang cache metadata ci

## License

Copyright (c) 2026 BinGenZ.
