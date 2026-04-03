# BINGENZ.COM
Landing page giới thiệu và bán tài khoản Premium của BinGenZ, dịch vụ thiết kế website, bot Telegram và cộng đồng GenZ Đam Mê IT.

README này chỉ tập trung vào cách đọc cấu trúc, sửa nội dung, đổi giao diện và nâng cấp tính năng của web.

## Nội dung hiện có trên web

- Hero giới thiệu BinGenZ với 2 mảng chính: tài khoản Premium và dịch vụ lập trình.
- Danh sách sản phẩm Premium: ChatGPT Plus, Grok Super, Gemini Pro, YouTube Premium, CapCut Pro.
- Phân loại gói `CÁ NHÂN` và `CHÍNH CHỦ`.
- Khối cộng đồng dẫn về group Facebook.
- Khối dịch vụ lập trình: thiết kế website, bot Telegram, hỗ trợ bài tập lập trình.
- Popup và nút liên hệ Zalo để mở nhanh hoặc copy số.
- Thanh social gồm Facebook, TikTok, GitHub, Telegram.

## Cấu trúc chính

- [public/index.html](C:/Users/Acer/Downloads/binpinkgold2-main/public/index.html): toàn bộ khung trang, section, modal, popup Zalo, social link, block dịch vụ.
- [public/assets/css/main.css](C:/Users/Acer/Downloads/binpinkgold2-main/public/assets/css/main.css): style giao diện, responsive, animation, modal, button.
- [public/assets/js/app.js](C:/Users/Acer/Downloads/binpinkgold2-main/public/assets/js/app.js): logic mở modal, copy Zalo, toast, popup welcome, render hành vi trang.
- [public/assets/js/products.js](C:/Users/Acer/Downloads/binpinkgold2-main/public/assets/js/products.js): dữ liệu sản phẩm Premium và thứ tự hiển thị.
- [public/assets/images](C:/Users/Acer/Downloads/binpinkgold2-main/public/assets/images): ảnh sản phẩm, ảnh thương hiệu và icon Zalo đang dùng trên web.
- [share-meta.js](C:/Users/Acer/Downloads/binpinkgold2-main/share-meta.js): tiêu đề và mô tả chia sẻ.
- [sync-share-meta.js](C:/Users/Acer/Downloads/binpinkgold2-main/sync-share-meta.js): đồng bộ metadata vào `public/index.html`.
- [scripts/build.mjs](C:/Users/Acer/Downloads/binpinkgold2-main/scripts/build.mjs): build thư mục `dist/` từ `public/`.
- [scripts/check.mjs](C:/Users/Acer/Downloads/binpinkgold2-main/scripts/check.mjs): kiểm tra asset sau khi build.
- [wrangler.jsonc](C:/Users/Acer/Downloads/binpinkgold2-main/wrangler.jsonc): cấu hình worker hiện tại.

## Cách chạy khi chỉnh sửa

Yêu cầu:

- Node.js 20+
- npm

Lệnh cơ bản:

```bash
npm install
npm run build
npm run check
```

`npm run build` sẽ sync metadata rồi tạo lại `dist/` từ source trong `public/`.

## Chỉnh sửa theo nhu cầu

Đổi nội dung trang:

- Sửa text, tiêu đề section, link mạng xã hội, số Zalo, popup liên hệ trong [public/index.html](C:/Users/Acer/Downloads/binpinkgold2-main/public/index.html).

Đổi danh sách sản phẩm:

- Sửa object trong [public/assets/js/products.js](C:/Users/Acer/Downloads/binpinkgold2-main/public/assets/js/products.js).
- Muốn đổi thứ tự card thì sửa `window.DISPLAY_ORDER`.

Đổi giao diện:

- Sửa màu sắc, spacing, button, modal, responsive trong [public/assets/css/main.css](C:/Users/Acer/Downloads/binpinkgold2-main/public/assets/css/main.css).

Đổi ảnh:

- Ảnh sản phẩm và ảnh thương hiệu nằm trong [public/assets/images](C:/Users/Acer/Downloads/binpinkgold2-main/public/assets/images).
- Icon Zalo hiện đang dùng file [public/assets/images/zalo.svg](C:/Users/Acer/Downloads/binpinkgold2-main/public/assets/images/zalo.svg).

Đổi thông tin chia sẻ:

- Sửa [share-meta.js](C:/Users/Acer/Downloads/binpinkgold2-main/share-meta.js), sau đó chạy lại:

```bash
npm run build
```

## Gợi ý nâng cấp

- Tách dữ liệu social link và contact link ra file JS riêng để đỡ sửa lặp trong HTML.
- Gom các block Zalo lặp lại thành template render chung.
- Tách block dịch vụ lập trình và block cộng đồng thành component nếu sau này chuyển sang framework.
- Chuẩn hóa UTF-8 cho các file dữ liệu nếu muốn tránh lỗi ký tự tiếng Việt ở một số file JS cũ.

## Lưu ý

- `dist/` là thư mục build, không nên sửa tay.
- Web này đang ưu tiên sửa trực tiếp trên source tĩnh để bàn giao nhanh.
- Nếu thay ảnh hoặc sửa metadata, nên build lại ngay để tránh lệch giữa source và bản build.

## Liên hệ
ZALO: 08989 08101

## License

Copyright (c) 2026 BINGENZ.COM. All rights reserved.

Dự án này của **BINGENZ.COM**. Không được sao chép, chỉnh sửa, phân phối, công khai hoặc tái sử dụng mã nguồn, giao diện, tài nguyên và nội dung của dự án khi chưa có sự cho phép từ **BINGENZ.COM**.

