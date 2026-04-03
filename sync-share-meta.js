/**
 * sync-share-meta.js
 *
 * DO NOT EDIT THE GENERATED META BLOCK IN public/index.html BY HAND.
 * Edit share-meta.js, then run: `node sync-share-meta.js`
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = __dirname;
const META_PATH = path.join(ROOT, "share-meta.js");
const INDEX_PATH = path.join(ROOT, "public", "index.html");

const META_START = "<!-- sync-share-meta:start -->";
const META_END = "<!-- sync-share-meta:end -->";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function loadShareMeta() {
  const source = fs.readFileSync(META_PATH, "utf8");
  const transformed = source
    .replace(/export\s+const\s+SHARE_META\s*=/, "const SHARE_META =")
    .replace(/export\s+default\s+SHARE_META;?/g, "")
    .concat("\nmodule.exports = { SHARE_META };\n");

  const sandbox = { module: { exports: {} }, exports: {} };
  vm.runInNewContext(transformed, sandbox, { filename: "share-meta.js" });

  const shareMeta = sandbox.module.exports.SHARE_META || {};
  return {
    title: String(shareMeta.title || "BinGenZ · AI & PREMIUM ACCOUNT"),
    description: String(shareMeta.description || ""),
  };
}

function buildMetaBlock(shareMeta) {
  const title = escapeHtml(shareMeta.title);
  const description = escapeHtml(shareMeta.description);

  return [
    META_START,
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
    META_END,
  ].join("\n");
}

function updateIndex(metaBlock) {
  const html = fs.readFileSync(INDEX_PATH, "utf8");
  const markerRegex = new RegExp(
    `${META_START.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${META_END.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`
  );

  if (markerRegex.test(html)) {
    return html.replace(markerRegex, metaBlock);
  }

  const viewportRegex = /(<meta name="viewport"[^>]*>\s*)/i;
  if (!viewportRegex.test(html)) {
    throw new Error("Could not find viewport meta tag in public/index.html");
  }

  return html.replace(viewportRegex, `$1${metaBlock}\n`);
}

function main() {
  const shareMeta = loadShareMeta();
  const metaBlock = buildMetaBlock(shareMeta);
  const nextHtml = updateIndex(metaBlock);
  fs.writeFileSync(INDEX_PATH, nextHtml, "utf8");
  console.log("Synced share meta from share-meta.js -> public/index.html");
}

main();
