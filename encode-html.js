/**
 * encode-html.js v6
 * Dùng innerHTML inject thay document.write
 * → DevTools Sources chỉ thấy file encode, không thấy source gốc
 */

const fs   = require("fs");
const path = require("path");

function encodeFile(srcName, destName) {
  const SRC  = path.join(__dirname, srcName);
  const DEST = path.join(__dirname, destName);

  if (!fs.existsSync(SRC)) {
    console.warn(`⚠️  Không tìm thấy ${srcName}, bỏ qua.`);
    return;
  }

  const raw     = fs.readFileSync(SRC, "utf8");
  const encoded = Buffer.from(raw, "utf8").toString("base64");

  // Tách <head> và <body> để inject đúng chỗ
  const headMatch = raw.match(/<head>([\s\S]*?)<\/head>/i);
  const headContent = headMatch ? headMatch[1].trim() : "";

  // Chỉ lấy title và meta viewport từ head gốc cho shell
  const titleMatch = raw.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : "Binpinkgold Code Store";

  const shell = `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head><body><script>!function(){try{var e="${encoded}",d=atob(e),b=new Uint8Array(d.length);for(var i=0;i<d.length;i++)b[i]=d.charCodeAt(i);var h=new TextDecoder("utf-8").decode(b);var doc=document.implementation.createHTMLDocument("");doc.documentElement.innerHTML=h;var scripts=doc.querySelectorAll("script");var headHTML=doc.head.innerHTML;var bodyHTML=doc.body.innerHTML;document.head.innerHTML=headHTML;document.body.innerHTML=bodyHTML;scripts.forEach(function(s){var ns=document.createElement("script");if(s.src)ns.src=s.src;else ns.textContent=s.textContent;document.body.appendChild(ns);});}catch(e){document.body.innerHTML="<p>Lỗi tải trang.</p>";}}();<\/script></body></html>`;

  fs.writeFileSync(DEST, shell, "utf8");
  console.log(`✅ ${srcName} → ${destName}`);
}

encodeFile("index.src.html", "index.html");
encodeFile("kho.src.html",   "kho.html");
