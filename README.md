# BinGenZ Web

Repo nay chua source cua landing page BinGenZ. Tai lieu nay chi tap trung vao cach sua noi dung, giao dien va nang cap tinh nang. Khong huong dan deploy.

## Cau truc chinh

- `public/index.html`: khung trang chinh, section, modal, thong tin lien he.
- `public/assets/css/main.css`: toan bo style giao dien.
- `public/assets/js/app.js`: tuong tac modal, copy Zalo, toast, popup.
- `public/assets/js/products.js`: du lieu san pham premium.
- `public/assets/icons/zalo.svg`: icon Zalo dang dung trong giao dien.
- `public/assets/images/`: anh san pham va anh thuong hieu.
- `share-meta.js`: tieu de va mo ta chia se.
- `sync-share-meta.js`: dong bo meta vao `public/index.html`.
- `scripts/build.mjs`: tao lai thu muc `dist/` tu `public/`.
- `scripts/check.mjs`: kiem tra asset sau khi build.

## Bat dau

Yeu cau:

- Node.js 20 tro len
- npm

Lenh can dung:

```bash
npm install
npm run build
npm run check
```

`npm run build` se tao lai thu muc `dist/` tu source trong `public/`.

## Cach sua nhanh

Sua noi dung trang:

- Mo [public/index.html](C:/Users/Acer/Downloads/binpinkgold2-main/public/index.html) de thay text, section, link mang xa hoi, so Zalo.
- Mo [public/assets/js/products.js](C:/Users/Acer/Downloads/binpinkgold2-main/public/assets/js/products.js) de them, xoa hoac sua goi san pham.

Sua giao dien:

- Mo [public/assets/css/main.css](C:/Users/Acer/Downloads/binpinkgold2-main/public/assets/css/main.css) de doi mau, khoang cach, button, modal, responsive.

Sua thong tin chia se:

- Mo [share-meta.js](C:/Users/Acer/Downloads/binpinkgold2-main/share-meta.js), sua `title` va `description`, sau do chay:

```bash
npm run build
```

## Nang cap repo

- Muon them san pham moi: them object moi trong `window.PRODUCTS`.
- Muon doi icon Zalo: thay file [public/assets/icons/zalo.svg](C:/Users/Acer/Downloads/binpinkgold2-main/public/assets/icons/zalo.svg).
- Muon doi anh san pham: thay file trong `public/assets/images/` va cap nhat duong dan trong `products.js`.
- Muon tach noi dung ra gon hon: dua cac doan HTML lap lai thanh template trong JS hoac tach thanh partial neu sau nay chuyen qua framework.

## Luu y khi chinh sua

- Repo nay dang uu tien sua truc tiep tren file tinh, khong can them huong dan deploy cho khach.
- `dist/` la thu muc build lai duoc, khong nen sua tay.
- Neu doi text co dau tieng Viet, nen luu file bang UTF-8 de tranh loi font/ky tu.

## Thong tin lien he

- Zalo: `0898908101`
- Facebook: [https://www.facebook.com/share/1AUUKX6NHa/](https://www.facebook.com/share/1AUUKX6NHa/)
- TikTok: [https://www.tiktok.com/@bingenz_](https://www.tiktok.com/@bingenz_)
- Telegram: [https://t.me/binpinkgold](https://t.me/binpinkgold)
- GitHub: [https://github.com/bingenz](https://github.com/bingenz)
