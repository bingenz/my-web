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

## Cach ra quyet dinh

- Neu yeu cau mo ho, uu tien giu nguyen hanh vi hien tai.
- Neu co xung dot giua dep code va an toan production, uu tien an toan production.
- Neu mot thay doi co the anh huong doanh thu hoac luong chuyen doi, dung lai va yeu cau xac nhan.
