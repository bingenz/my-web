/**
 * encode-html.js
 * Build index.html from index.src.html and inject share metadata from share-meta.js.
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function loadShareMeta() {
  const metaPath = path.join(__dirname, "share-meta.js");
  const source = fs.readFileSync(metaPath, "utf8");
  const transformed = source
    .replace(/export\s+const\s+SHARE_META\s*=/, "const SHARE_META =")
    .replace(/export\s+default\s+SHARE_META;?/g, "")
    .concat("\nmodule.exports = { SHARE_META };\n");

  const sandbox = { module: { exports: {} }, exports: {} };
  vm.runInNewContext(transformed, sandbox, { filename: "share-meta.js" });

  const shareMeta = sandbox.module.exports.SHARE_META;

  return {
    title: String(shareMeta?.title || "BinGenZ"),
    description: String(shareMeta?.description || ""),
  };
}

function buildShareMetaTags(shareMeta) {
  const title = escapeHtml(shareMeta.title);
  const description = escapeHtml(shareMeta.description);

  return [
    `<title>${title}</title>`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:url" content="https://bingenz.com">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:locale" content="vi_VN">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    `<meta name="description" content="${description}">`,
  ].join("");
}

function stripExistingShareMeta(raw) {
  return raw
    .replace(/<title>[\s\S]*?<\/title>\s*/i, "")
    .replace(/<meta\s+property="og:type"[^>]*>\s*/gi, "")
    .replace(/<meta\s+property="og:url"[^>]*>\s*/gi, "")
    .replace(/<meta\s+property="og:title"[^>]*>\s*/gi, "")
    .replace(/<meta\s+property="og:description"[^>]*>\s*/gi, "")
    .replace(/<meta\s+property="og:locale"[^>]*>\s*/gi, "")
    .replace(/<meta\s+name="twitter:card"[^>]*>\s*/gi, "")
    .replace(/<meta\s+name="twitter:title"[^>]*>\s*/gi, "")
    .replace(/<meta\s+name="twitter:description"[^>]*>\s*/gi, "")
    .replace(/<meta\s+name="description"[^>]*>\s*/gi, "");
}

function injectShareMeta(raw, shareMeta) {
  const shareTags = buildShareMetaTags(shareMeta);
  const cleaned = stripExistingShareMeta(raw);

  return cleaned.replace(
    /(<meta name="viewport"[^>]*>\s*)/i,
    `$1  ${shareTags}\n`
  );
}

function extractSeoMetas(raw) {
  const metaRegex = /<meta\s[^>]+>/gi;
  const allMetas = raw.match(metaRegex) || [];

  return allMetas
    .filter((meta) => {
      const lower = meta.toLowerCase();
      if (lower.includes("charset=")) return false;
      if (lower.includes('name="viewport"') || lower.includes("name='viewport'")) return false;
      return true;
    })
    .map((meta) => meta.trim());
}

function buildShell(html, shareMeta) {
  const encoded = Buffer.from(html, "utf8").toString("base64");
  const seoMetas = extractSeoMetas(html);
  const title = escapeHtml(shareMeta.title);

  return `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>${seoMetas.join("")}</head><body><script>!function(){try{var e="${encoded}",d=atob(e),b=new Uint8Array(d.length);for(var i=0;i<d.length;i++)b[i]=d.charCodeAt(i);var h=new TextDecoder("utf-8").decode(b);var doc=document.implementation.createHTMLDocument("");doc.documentElement.innerHTML=h;var scripts=doc.querySelectorAll("script");var headHTML=doc.head.innerHTML;var bodyHTML=doc.body.innerHTML;document.head.innerHTML=headHTML;document.body.innerHTML=bodyHTML;scripts.forEach(function(s){var ns=document.createElement("script");if(s.src)ns.src=s.src;else ns.textContent=s.textContent;document.body.appendChild(ns);});}catch(e){document.body.innerHTML="<p>Loi tai trang.</p>";}}();<\/script></body></html>`;
}

async function main() {
  const srcPath = path.join(__dirname, "index.src.html");
  const destPath = path.join(__dirname, "index.html");
  const shareMeta = await loadShareMeta();
  const srcHtml = fs.readFileSync(srcPath, "utf8");
  const html = injectShareMeta(srcHtml, shareMeta);
  const shell = buildShell(html, shareMeta);

  fs.writeFileSync(destPath, shell, "utf8");
  console.log("index.src.html -> index.html");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
