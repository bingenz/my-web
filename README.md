# BINGENZ.COM

Landing page bán tài khoản Premium và giới thiệu dịch vụ nâng cấp web của **BINGENZ.COM**.

README này tập trung vào 4 việc chính:
- sửa nội dung giao diện;
- thêm hoặc nâng cấp tính năng;
- đổi style, ảnh, link liên hệ;
- hiểu nhanh cấu trúc file để chỉnh đúng chỗ.

## 1) Chạy project khi cần chỉnh sửa

Yêu cầu:
- Node.js 20+
- npm

Lệnh cơ bản:

```bash
npm install
npm run build
npm run check
```

Ghi chú:
- Source chính nằm trong `public/`.
- `npm run build` sẽ đồng bộ metadata rồi tạo lại thư mục `dist/`.
- Không nên sửa tay file trong `dist/`.

## 2) Sửa nhanh theo từng nhu cầu

### Đổi tên, text, nội dung hiển thị
Sửa trong `public/index.html`.

Thường dùng khi cần:
- đổi tiêu đề trang;
- sửa tên thương hiệu, slogan, mô tả;
- đổi nội dung hero, dịch vụ, CTA;
- đổi link Facebook, TikTok, Telegram, GitHub, Zalo.

### Đổi danh sách sản phẩm Premium
Sửa trong `public/assets/js/products.js`.

Thường dùng khi cần:
- thêm sản phẩm mới;
- sửa tên gói, giá, mô tả, ảnh;
- đổi thứ tự card hiển thị qua `window.DISPLAY_ORDER`.

### Đổi giao diện, responsive, hiệu ứng
Sửa trong `public/assets/css/main.css`.

Thường dùng khi cần:
- đổi màu chủ đạo;
- chỉnh khoảng cách, font, button, card;
- sửa layout mobile/tablet/desktop;
- tinh chỉnh popup, modal, animation.

### Đổi logic tương tác
Sửa trong `public/assets/js/app.js`.

Thường dùng khi cần:
- sửa popup Zalo;
- sửa copy số liên hệ;
- chỉnh toast thông báo;
- thay hành vi mở modal hoặc hiệu ứng tương tác.

### Đổi ảnh, logo, icon
Sửa file trong `public/assets/images/`.

Ví dụ:
- ảnh sản phẩm;
- ảnh banner;
- icon Zalo `public/assets/images/zalo.svg`.

### Đổi thông tin chia sẻ khi gửi link
Sửa trong `share-meta.js`, sau đó build lại:

```bash
npm run build
```

## 3) Cách thêm tính năng mới

### Thêm một sản phẩm mới
1. Mở `public/assets/js/products.js`.
2. Thêm object sản phẩm mới theo đúng cấu trúc đang có.
3. Nếu cần, thêm ảnh mới vào `public/assets/images/`.
4. Kiểm tra lại thứ tự hiển thị trong `window.DISPLAY_ORDER`.

### Thêm một nút hoặc khu vực mới trên trang
1. Thêm block HTML trong `public/index.html`.
2. Thêm class CSS tương ứng trong `public/assets/css/main.css`.
3. Nếu có hành vi click, popup, copy, toggle..., bổ sung JS trong `public/assets/js/app.js`.

### Thêm một kênh liên hệ mới
1. Sửa block liên hệ trong `public/index.html`.
2. Nếu cần icon riêng, thêm file SVG hoặc ảnh vào `public/assets/images/`.
3. Nếu có logic riêng như copy link hoặc mở popup, thêm xử lý trong `public/assets/js/app.js`.

### Thêm popup / modal mới
1. Tạo HTML modal trong `public/index.html`.
2. Style modal trong `public/assets/css/main.css`.
3. Viết hàm mở/đóng trong `public/assets/js/app.js`.

## 4) Gợi ý nâng cấp web

### Nâng cấp dễ làm ngay
- Tách dữ liệu social link và contact link sang file JS riêng để tránh sửa lặp nhiều chỗ.
- Gom các block Zalo lặp lại thành 1 template render chung.
- Gom hằng số như số điện thoại, link social, tên brand về một chỗ để dễ bảo trì.
- Tách từng section lớn thành partial/component nếu sau này muốn chuyển sang framework.

### Nâng cấp kỹ thuật nên làm tiếp
- Thêm lazy-load cho ảnh nếu web có nhiều ảnh hơn.
- Chuẩn hóa lại class CSS để dễ maintain về sau.
- Tách các hàm UI trong `app.js` thành nhóm rõ ràng: modal, toast, contact, popup.
- Thêm script kiểm tra nhanh link hỏng hoặc asset thiếu trước khi deploy.

## 5) Sơ đồ cấu trúc file

```text
my-web-main/
|-- public/
|   |-- index.html
|   |-- assets/
|   |   |-- css/
|   |   |   `-- main.css
|   |   |-- js/
|   |   |   |-- app.js
|   |   |   |-- head.js
|   |   |   `-- products.js
|   |   |-- images/
|   |   |   |-- *.jpg / *.svg
|   |   `-- fonts/
|   |       `-- geist-sans-variable.woff2
|   `-- _headers
|-- scripts/
|   |-- build.mjs
|   `-- check.mjs
|-- share-meta.js
|-- sync-share-meta.js
|-- package.json
|-- package-lock.json
`-- wrangler.jsonc
```

## 6) Giải thích từng file dùng để làm gì

### `public/index.html`
File khung chính của toàn bộ landing page.

Dùng để:
- dựng section hero, sản phẩm, dịch vụ, liên hệ;
- sửa text trực tiếp;
- thêm bớt block HTML;
- chỉnh CTA, social link, số Zalo, popup, modal.

### `public/assets/css/main.css`
File CSS tổng của project.

Dùng để:
- chỉnh toàn bộ giao diện;
- sửa layout responsive;
- đổi màu, border, shadow, spacing;
- style card, modal, button, social, contact box.

### `public/assets/js/app.js`
File JS xử lý hành vi chính của trang.

Dùng để:
- mở/đóng popup;
- copy số Zalo;
- hiển thị toast;
- xử lý tương tác giao diện;
- gắn các sự kiện click.

### `public/assets/js/products.js`
File dữ liệu và cấu hình hiển thị sản phẩm.

Dùng để:
- lưu thông tin các gói Premium;
- render danh sách sản phẩm;
- sắp xếp thứ tự hiển thị;
- thêm hoặc ẩn bớt sản phẩm.

### `public/assets/js/head.js`
File JS nhỏ cho phần head hoặc cấu hình bổ trợ ban đầu của trang.

Dùng khi cần thêm xử lý nhẹ liên quan tới phần tải trang hoặc cấu hình chung.

### `public/assets/images/`
Thư mục ảnh và icon.

Dùng để:
- chứa ảnh sản phẩm;
- chứa ảnh thương hiệu;
- chứa icon SVG như Zalo.

### `public/assets/fonts/`
Thư mục font custom của website.

### `public/_headers`
File cấu hình header khi deploy static.

Thường dùng để:
- thêm rule cache;
- thêm security header;
- cấu hình response header cho hosting.

### `scripts/build.mjs`
Script build project.

Dùng để:
- đồng bộ metadata;
- copy source từ `public/` sang `dist/`;
- chuẩn bị bản deploy.

### `scripts/check.mjs`
Script kiểm tra sau build.

Dùng để:
- rà lại asset;
- kiểm tra thiếu file hoặc lỗi cấu trúc trước khi deploy.

### `share-meta.js`
Nguồn dữ liệu metadata chia sẻ.

Dùng để:
- sửa title;
- sửa description;
- đổi thông tin preview khi share link.

### `sync-share-meta.js`
Script đồng bộ metadata từ `share-meta.js` vào file public.

### `wrangler.jsonc`
File cấu hình deploy hiện tại.

Dùng khi cần chỉnh cấu hình môi trường chạy hoặc cách publish.

## 7) Lưu ý khi sửa

- Nếu sửa text hoặc layout: kiểm tra lại cả desktop và mobile.
- Nếu thêm ảnh mới: đặt đúng đường dẫn trong `public/assets/images/`.
- Nếu sửa metadata hoặc ảnh chia sẻ: luôn chạy lại `npm run build`.
- Nếu thêm tính năng có nhiều logic: nên tách hàm rõ ràng trong `app.js` để sau này dễ nâng cấp.

## Liên hệ

<p>
  <a href="https://zalo.me/0898908101" target="_blank" rel="noopener noreferrer" aria-label="Zalo" title="Zalo 0898908101">
    <img src="./public/assets/images/zalo.svg" alt="Zalo" width="24" height="24">
  </a>
  <strong>0898908101</strong>
  &nbsp;&nbsp;
  <a href="https://www.facebook.com/share/1AUUKX6NHa/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook">
    <img src="https://cdn.simpleicons.org/facebook/1877F2" alt="Facebook" width="24" height="24">
  </a>
  &nbsp;
  <a href="https://www.tiktok.com/@bingenz_" target="_blank" rel="noopener noreferrer" aria-label="TikTok" title="TikTok">
    <img src="https://cdn.simpleicons.org/tiktok/000000" alt="TikTok" width="24" height="24">
  </a>
  &nbsp;
  <a href="https://t.me/binpinkgold" target="_blank" rel="noopener noreferrer" aria-label="Telegram" title="Telegram">
    <img src="https://cdn.simpleicons.org/telegram/26A5E4" alt="Telegram" width="24" height="24">
  </a>
  &nbsp;
  <a href="https://github.com/bingenz" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">
    <img src="https://cdn.simpleicons.org/github/181717" alt="GitHub" width="24" height="24">
  </a>
</p>
