/**
 * encode-html.js v7
 * Dùng innerHTML inject thay document.write
 * → DevTools Sources chỉ thấy file encode, không thấy source gốc
 *
 * v7: Tự động sync meta/OG tags từ index.src.html vào _middleware.js
 *     → Chỉ cần sửa 1 file duy nhất (index.src.html)
 */

const fs   = require("fs");
const path = require("path");

// ─── HELPER: extract meta tags từ HTML source ───────────────────────────────

function extractMeta(raw) {
  // Lấy title
  const titleMatch = raw.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : "BinGenZ";

  // Extract tất cả meta tags (trừ charset và viewport)
  const metaRegex = /<meta\s[^>]+>/gi;
  const allMetas = raw.match(metaRegex) || [];
  const seoMetas = allMetas.filter(m => {
    const lower = m.toLowerCase();
    if (lower.includes("charset=")) return false;
    if (lower.includes('name="viewport"') || lower.includes("name='viewport'")) return false;
    return true;
  }).map(m => m.trim());

  return { title, seoMetas };
}

// ─── 1. ENCODE index.src.html → index.html ──────────────────────────────────

function encodeFile(srcName, destName) {
  const SRC  = path.join(__dirname, srcName);
  const DEST = path.join(__dirname, destName);

  if (!fs.existsSync(SRC)) {
    console.warn(`⚠️  Không tìm thấy ${srcName}, bỏ qua.`);
    return null;
  }

  const raw     = fs.readFileSync(SRC, "utf8");
  const encoded = Buffer.from(raw, "utf8").toString("base64");
  const { title, seoMetas } = extractMeta(raw);

  const shell = `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>${seoMetas.join("")}</head><body><script>!function(){try{var e="${encoded}",d=atob(e),b=new Uint8Array(d.length);for(var i=0;i<d.length;i++)b[i]=d.charCodeAt(i);var h=new TextDecoder("utf-8").decode(b);var doc=document.implementation.createHTMLDocument("");doc.documentElement.innerHTML=h;var scripts=doc.querySelectorAll("script");var headHTML=doc.head.innerHTML;var bodyHTML=doc.body.innerHTML;document.head.innerHTML=headHTML;document.body.innerHTML=bodyHTML;scripts.forEach(function(s){var ns=document.createElement("script");if(s.src)ns.src=s.src;else ns.textContent=s.textContent;document.body.appendChild(ns);});}catch(e){document.body.innerHTML="<p>Lỗi tải trang.</p>";}}();<\/script></body></html>`;

  fs.writeFileSync(DEST, shell, "utf8");
  console.log(`✅ ${srcName} → ${destName}`);

  return { title, seoMetas };
}

// ─── 2. SYNC meta tags vào _middleware.js (SHELL_HTML) ──────────────────────

function syncMiddlewareMeta(title, seoMetas) {
  const MIDDLEWARE = path.join(__dirname, "functions", "_middleware.js");

  if (!fs.existsSync(MIDDLEWARE)) {
    console.warn("⚠️  Không tìm thấy functions/_middleware.js, bỏ qua sync.");
    return;
  }

  const middlewareContent = fs.readFileSync(MIDDLEWARE, "utf8");

  // Build <head> mới cho SHELL_HTML (giữ indent 2 spaces cho dễ đọc)
  const metaLines = seoMetas.map(m => `  ${m}`).join("\n");
  const newHead = [
    `  <meta charset="UTF-8">`,
    `  <meta name="viewport" content="width=device-width,initial-scale=1">`,
    `  <title>${title}</title>`,
    metaLines,
  ].join("\n");

  // Thay thế toàn bộ <head>...</head> bên trong SHELL_HTML
  // Dùng marker: từ "<head>" đến "</head>" trong block template literal của SHELL_HTML
  const updated = middlewareContent.replace(
    /(<head>)[\s\S]*?(<\/head>)/,
    `<head>\n${newHead}\n</head>`
  );

  if (updated === middlewareContent) {
    console.warn("⚠️  Không tìm thấy <head>...</head> trong SHELL_HTML để sync.");
    return;
  }

  // Xóa comment cảnh báo "nhớ cập nhật thủ công" vì giờ đã tự động
  const cleaned = updated.replace(
    /\/\/ ⚠️.*?nhớ cập nhật SHELL_HTML.*?\n/,
    "// ✅ Meta tags được tự động sync từ index.src.html bởi encode-html.js\n"
  );

  fs.writeFileSync(MIDDLEWARE, cleaned, "utf8");
  console.log(`✅ Meta synced → functions/_middleware.js`);
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

const result = encodeFile("index.src.html", "index.html");
if (result) {
  syncMiddlewareMeta(result.title, result.seoMetas);
}
