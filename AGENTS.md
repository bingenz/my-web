# AGENTS.md

Tai lieu nay danh cho AI agent khi lam viec trong repo nay.

## Muc tieu du an

- Day la website ban tai khoan Premium va dich vu lien quan.
- Uu tien cao nhat la giu site hoat dong on dinh, khong lam hong luong ban hang, luong lien he, va luong dieu huong nguoi dung.
- Khi toi uu hoac phat trien, uu tien cac thay doi an toan, nho, de kiem tra, de rollback.

## Nguyen tac quan trong

- Khong tu y thay doi logic ban hang hien tai neu khong co yeu cau ro rang.
- Khong tu y doi text kinh doanh, gia, san pham, CTA, link lien he, hoac thu tu section neu chua duoc yeu cau.
- Khong xoa cac co che bao ve logic welcome popup, info toast, modal san pham, fee calculator, va redirect domain cu neu chua hieu ro luong hoat dong.
- Moi thay doi phai uu tien khong gay loi tren production.
- Neu co nhieu cach lam, chon cach it rui ro hon.

## Nguon su that quan trong

### Share metadata

- File nguon duy nhat de sua caption khi share link la `share-meta.js`.
- Khong sua thu cong caption share trong nhieu file khac.
- `functions/_middleware.js` doc metadata tu `share-meta.js` de phuc vu social crawler.
- `encode-html.js` inject metadata tu `share-meta.js` vao `index.html` khi build.
- `index.src.html` chi la source HTML; metadata o do phai duoc xem la fallback/cau truc build, khong phai noi de sua caption thu cong moi lan.

### Giao dien va logic chinh

- `index.src.html` la source chinh cua giao dien va script client.
- `index.html` la file build sinh ra tu `index.src.html`. Khong chinh tay `index.html` roi bo qua source.
- Neu sua giao dien hoac script chinh, uu tien sua trong `index.src.html`, sau do build lai `index.html`.

### Middleware

- `functions/_middleware.js` xu ly:
  - social crawler response
  - metadata cho share
  - redirect domain cu sang domain moi
- Khong mo rong redirect mot cach qua tay, dac biet khong redirect tat ca preview host neu khong can thiet.

## Cac logic nhay cam can giu

### Welcome popup va info toast

- Toast khong duoc hien trong khi welcome popup con mo.
- Chi sau khi dong welcome popup moi duoc kich hoat observer/toast lien quan.
- Moi thay doi lien quan popup/toast phai kiem tra lai desktop va mobile.

### Fee calculator

- Nguoi dung phai nhap duoc du lieu de tinh phi.
- Khong duoc chan copy/paste, select, hoac thao tac input thong thuong trong o nhap.
- Neu co script bao ve, phai cho phep input, textarea, va vung editable hoat dong binh thuong.

### Product modal va CTA

- Nut mo san pham, modal mo ta, CTA dang ky, va cac link lien he la mot phan cua luong chuyen doi.
- Khong doi id, ten ham, hook DOM, hay thu tu xu ly neu khong can thiet.

## Cach lam viec an toan

- Truoc khi sua, doc cac file lien quan va hieu luong hien tai.
- Uu tien thay doi nho, ro pham vi.
- Sau khi sua source co lien quan HTML/build, build lai `index.html`.
- Neu sua metadata, chi can sua `share-meta.js`, sau do build lai neu can cho `index.html`.
- Khong xoa code chi vi trong co ve du neu chua xac minh no khong anh huong production.

## Checklist truoc khi ket thuc

- Caption share van dung theo `share-meta.js`.
- Welcome popup va info toast van dung thu tu.
- Fee calculator van nhap va tinh duoc.
- CTA, modal, va section san pham van hoat dong.
- Khong lam hong redirect host cu.
- Neu co sua build logic, da rebuild `index.html`.

## Neu can toi uu

- Uu tien toi uu toc do tai trang, do on dinh, kha nang bao tri, va do an toan.
- Khong toi uu kieu "dep code" ma vo tinh doi hanh vi.
- Neu de xuat refactor lon, phai neu ro rui ro va cach verify.

## Ghi chu xu ly cac case button hero va responsive tuong tu

### Khi nao can nghi den loi nay

- 2 button trong hero/banner bi xuong dong tren mobile pho bien khoang 390px den 430px.
- 2 button dung canh nhau nhung nhin khong can doi: 1 nut to hon, 1 nut day hon, hoặc khoang cach qua sat.
- Button gradient/pill bi khuyet nen hoac khuyet vien o 2 dau bo tron.
- Cum CTA va cum chip/stats ben duoi nhin bi dinh vao nhau, thieu khoang tho.
- URL bi giu lai hash noi bo nhu `#home`, `#products`, `#contact` sau redirect hoac sau khi vao link cu.

### Cach xu ly an toan uu tien

- Uu tien chi sua CSS o khu vuc hero truoc, khong doi logic click, id, hook DOM, hay text kinh doanh neu chua can.
- Neu 2 button bi xuong dong tren mobile hep:
  - dung media query nho, uu tien moc `max-width: 430px`
  - cho 2 button `flex: 1 1 0`
  - them `min-width: 0`
  - neu can thi `flex-wrap: nowrap`
  - giam `min-height`, `padding`, `font-size` de button thon hon
- Neu 2 button khong can doi:
  - dat style chung rieng trong `.hero-cta-row` de can `min-height`, `padding`, `font-size`, `line-height`, `border-radius`
  - khong sua class global neu chua can, tranh anh huong CTA o noi khac
- Neu button gradient/pill bi khuyet vien:
  - kiem tra no co dang ke thua `border` tu class base hay khong
  - uu tien set ro `border: 0`
  - co the them `background-clip: padding-box`
  - kiem tra `appearance`, `-webkit-appearance`, `overflow`
- Neu cum CTA va chip/stats qua sat:
  - tang `margin-bottom` cua `.hero-cta-row`
  - hoac them `margin-top` nho cho `.hero-stats`
- Neu URL con giu hash noi bo:
  - khong giu `location.hash` khi redirect domain cu sang domain moi neu khong can
  - co the dung `history.replaceState(null, "", location.pathname + location.search)` de lam sach hash noi bo sau khi load

### Checklist rieng cho case nay

- 2 button hero van cung 1 hang tren mobile 390px den 430px.
- Button nhin thon gon, khong bi "u".
- Button gradient khong bi khuyet 2 dau bo tron.
- Khoang cach giua CTA va 4 chip/stats du de tach thanh 2 tang thi giac.
- Khong doi text CTA neu chua duoc yeu cau.
- Sau khi sua `index.src.html`, phai build lai `index.html`.

### Prompt mau co the dung lai

```text
Hay sua 2 button trong hero/banner.

Yeu cau:
- 2 button phai nam cung 1 hang tren mobile pho bien khoang 390px den 430px, khong bi xuong dong.
- 2 button phai nhin thon gon hon, can doi nhau ve chieu cao, padding, font-size va border-radius.
- Button gradient khong duoc bi khuyet nen/khuyet vien o 2 dau bo tron.
- Uu tien chi sua CSS trong hero, khong doi logic click, id, hook DOM, hay text kinh doanh neu chua that su can.
- Neu can, dung media query de giam min-height, padding, font-size, cho 2 button chia deu chieu ngang bang flex va tranh wrap.
- Neu URL con hash noi bo nhu #home, #products thi lam sach bang cach an toan ma khong reload trang.
- Sau khi sua, build lai `index.html` tu `index.src.html`.
```

## Ghi chu kich hoat audit hoac debug toan du an

### Dieu kien kich hoat

- Chi kich hoat muc nay khi nguoi dung yeu cau ro rang mot trong cac y sau:
  - kiem tra toan bo du an
  - audit toan bo project
  - debug toan bo du an
  - ra soat tong the website
- Neu nguoi dung chi yeu cau sua 1 loi cu the hoac 1 section cu the, khong tu dong chay quy trinh audit tong the nay.

### Muc tieu khi kich hoat

- Doc va hieu cau truc du an truoc khi ket luan.
- Uu tien tim bug thuc te, bug tiem an, va rui ro production.
- Uu tien sua nho, an toan, de test, de rollback.
- Khong tu y doi text kinh doanh, gia, CTA, link lien he, hoac logic ban hang neu chua duoc yeu cau.

### Prompt audit-debug toan du an

```text
Hay dong vai senior frontend/debug engineer va audit toan bo project website nay theo huong production-safe.

Boi canh:
- Day la landing page ban tai khoan Premium va dich vu lien quan.
- Uu tien cao nhat la khong lam hong luong ban hang, CTA, modal, popup, redirect, contact link va mobile UX.
- Moi de xuat phai uu tien sua nho, an toan, de test, de rollback.

Yeu cau audit toan dien:
1. Doc va hieu cau truc du an truoc khi ket luan.
2. Xac dinh source of truth:
   - index.src.html la file nguon chinh
   - index.html la file build
   - functions/_middleware.js xu ly middleware, redirect, social metadata
   - share-meta.js la nguon metadata share
3. Kiem tra toan bo cac nhom sau:
   - layout desktop va mobile
   - responsive tren mobile nho
   - topbar, hero, CTA, button, chip, product card, service card
   - bottom nav mobile
   - welcome popup
   - confirm toast / info toast / redirect toast
   - product modal
   - dev service modal
   - fee calculator
   - contact links
   - redirect domain cu sang domain moi
   - hash tren URL nhu #home, #products
   - scroll behavior giua cac section
   - pointer-events, z-index, overlay, fixed elements
   - script co the nuot touch/click tren mobile
   - hieu nang mobile, dac biet voi blur, shadow, toast, popup
4. Tim loi thuc te va nguy co tiem an, khong chi doc code cho co.
5. Uu tien phat hien:
   - bug tren mobile
   - click khong an
   - toast/popup hien sai thoi diem
   - scroll sai section
   - phan tu fixed chan thao tac
   - loi race condition giua popup / toast / observer / scroll
   - loi build source va production file khong dong bo
   - loi middleware hoac redirect co the anh huong production
6. Neu phat hien van de:
   - giai thich nguyen nhan goc
   - chi ro file lien quan
   - neu muc do nghiem trong
   - de xuat cach sua it rui ro nhat
7. Neu sua code:
   - chi sua trong file nguon phu hop
   - khong sua bua index.html neu chua sua index.src.html
   - sau khi sua phai build lai index.html
8. Sau cung tra ket qua theo format:
   - Findings
   - Root cause
   - Safe fix proposal
   - Files involved
   - What to verify manually
9. Neu khong thay bug ro rang, van phai neu:
   - cac vung rui ro cao
   - cac luong can test tay
   - cac diem de gay loi ve sau

Luu y dac biet:
- Khong tu y doi text kinh doanh, gia, CTA, link lien he neu khong co yeu cau.
- Khong refactor lon neu chua can.
- Khong duoc lam thay doi hanh vi ban hang ngoai pham vi bugfix.
- Neu co nhieu cach sua, chon cach an toan nhat cho production.

Muc tieu cuoi:
- debug toan bo du an
- tim bug thuc te + bug tiem an
- dua ra danh sach fix an toan, ro rang, co the ap dung ngay
```

## Cach ra quyet dinh

- Neu yeu cau mo ho, uu tien giu nguyen hanh vi hien tai.
- Neu co xung dot giua dep code va an toan production, uu tien an toan production.
- Neu mot thay doi co the anh huong doanh thu hoac luong chuyen doi, dung lai va yeu cau xac nhan.
