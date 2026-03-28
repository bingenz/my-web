// functions/_middleware.js -- Cloudflare Worker Middleware + Visitor Tracking

import { SHARE_META } from "../share-meta.js";

const BOT_UA_PATTERNS = [
  /bot/i, /crawl/i, /spider/i, /scraper/i,
  /facebookexternalhit/i, /Facebot/i,
  /TelegramBot/i, /WhatsApp/i,
  /Twitterbot/i, /LinkedInBot/i,
  /Slackbot/i, /Discordbot/i,
  /ZaloPC/i, /ZaloApp/i, /zalo/i,
  /Pinterest/i,
  /Googlebot/i, /bingbot/i, /YandexBot/i,
  /DuckDuckBot/i, /Baiduspider/i,
  /TravelFox/i, /CocCoc/i, /coccoc/i,
  /curl/i, /wget/i, /python/i, /axios/i,
  /node-fetch/i, /Go-http-client/i, /okhttp/i,
  /HeadlessChrome/i, /PhantomJS/i, /Puppeteer/i, /Playwright/i,
  /preview/i, /metadata/i, /unfurl/i, /opengraph/i,
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const SHARE_TITLE = escapeHtml(SHARE_META.title);
const SHARE_DESCRIPTION = escapeHtml(SHARE_META.description);

function applyNoStoreHeaders(headers) {
  headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0");
  headers.set("Pragma", "no-cache");
  headers.set("Expires", "0");
  headers.set("CDN-Cache-Control", "no-store");
  headers.set("Cloudflare-CDN-Cache-Control", "no-store");
}

// Chinh caption share mang xa hoi tai ../share-meta.js.
const SHELL_HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${SHARE_TITLE}</title>
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://bingenz.com">
  <meta property="og:title" content="${SHARE_TITLE}">
  <meta property="og:description" content="${SHARE_DESCRIPTION}">
  <meta property="og:image" content="https://bingenz.com/assets/images/fhd.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="vi_VN">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${SHARE_TITLE}">
  <meta name="twitter:description" content="${SHARE_DESCRIPTION}">
  <meta name="twitter:image" content="https://bingenz.com/assets/images/fhd.jpg">
  <meta name="description" content="${SHARE_DESCRIPTION}">
</head>
<body><p>Vui long mo tren trinh duyet de xem noi dung.</p></body>
</html>`;

function getDeviceType(ua) {
  if (/Mobile|Android|iPhone|iPad|iPod/i.test(ua)) {
    if (/iPad/i.test(ua)) return "Tablet";
    return "Mobile";
  }
  return "Desktop";
}

function getOS(ua) {
  if (/Windows/i.test(ua)) return "Windows";
  if (/Android/i.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/Mac OS X/i.test(ua)) return "macOS";
  if (/Linux/i.test(ua)) return "Linux";
  return "Unknown";
}

function getBrowser(ua) {
  if (/CocCoc/i.test(ua)) return "Coc Coc";
  if (/Edg/i.test(ua)) return "Edge";
  if (/OPR|Opera/i.test(ua)) return "Opera";
  if (/Chrome/i.test(ua)) return "Chrome";
  if (/Firefox/i.test(ua)) return "Firefox";
  if (/Safari/i.test(ua)) return "Safari";
  return "Other";
}

async function trackVisitor(request, env) {
  try {
    const kv = env.bin;
    if (!kv) return;

    const ua = request.headers.get("User-Agent") || "";
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const now = new Date();

    // Dung timezone +7
    const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const dateStr = vnTime.toISOString().slice(0, 10); // YYYY-MM-DD
    const timeStr = vnTime.toISOString().slice(11, 16); // HH:MM

    // Dedup: cung IP trong cung ngay khong tinh lai
    const dedupKey = `dedup:${dateStr}:${ip}`;
    const alreadyCounted = await kv.get(dedupKey);
    if (alreadyCounted) return;

    // Luu dedup flag, TTL 48 gio
    await kv.put(dedupKey, "1", { expirationTtl: 172800 });

    // Lay log ngay hien tai
    const logKey = `log:${dateStr}`;
    const existing = await kv.get(logKey, { type: "json" }) || [];

    const entry = {
      ip,
      time: timeStr,
      device: getDeviceType(ua),
      os: getOS(ua),
      browser: getBrowser(ua),
      ua: ua.slice(0, 120),
    };

    existing.push(entry);
    // Luu log, TTL 30 ngay
    await kv.put(logKey, JSON.stringify(existing), { expirationTtl: 2592000 });

    // Cap nhat tong theo ngay
    const totalKey = `total:${dateStr}`;
    const total = parseInt(await kv.get(totalKey) || "0", 10) + 1;
    await kv.put(totalKey, String(total), { expirationTtl: 2592000 });
  } catch (e) {
    // Khong lam crash middleware neu KV loi
    console.error("Tracker error:", e);
  }
}

export default {
  async fetch(request, env, ctx) {
    const ua = request.headers.get("User-Agent") || "";
    const url = new URL(request.url);
    const NEW_ORIGIN = "https://bingenz.com";
    const legacyHosts = new Set([
      "binpinkgold.lnth.workers.dev",
      "www.bingenz.com",
    ]);

    // Redirect domain cu sang domain moi
    if (legacyHosts.has(url.hostname)) {
      const target = NEW_ORIGIN + url.pathname + url.search;
      const redirectHeaders = new Headers({
        Location: target,
      });
      applyNoStoreHeaders(redirectHeaders);
      return new Response(null, {
        status: 308,
        headers: redirectHeaders,
      });
    }

    // Bo qua tracking cho /stats
    if (url.pathname === "/stats") {
      return env.ASSETS.fetch(request);
    }

    // Chi serve encoded page cho browser that, con lai tra SHELL_HTML cho crawler doc meta
    const isRealBrowser = ua.length > 20
      && /Mozilla\/5\.0/i.test(ua)
      && /(Chrome|Firefox|Safari|Edg|OPR|CocCoc)\/[\d.]+/i.test(ua)
      && !BOT_UA_PATTERNS.some((pattern) => pattern.test(ua));

    if (!isRealBrowser) {
      const shellHeaders = new Headers({
        "Content-Type": "text/html; charset=utf-8",
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "no-referrer",
        "X-DNS-Prefetch-Control": "off",
        "Permissions-Policy": "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
      });
      applyNoStoreHeaders(shellHeaders);
      return new Response(SHELL_HTML, {
        status: 200,
        headers: shellHeaders,
      });
    }

    // Track visitor (khong await de khong lam cham response)
    ctx.waitUntil(trackVisitor(request, env));

    // Serve static asset + them security headers
    const response = await env.ASSETS.fetch(request);
    const newHeaders = new Headers(response.headers);
    newHeaders.set("X-Frame-Options", "DENY");
    newHeaders.set("X-Content-Type-Options", "nosniff");
    newHeaders.set("X-XSS-Protection", "1; mode=block");
    newHeaders.set("Referrer-Policy", "no-referrer");
    newHeaders.set("X-DNS-Prefetch-Control", "off");
    newHeaders.set("X-Robots-Tag", "noindex, nofollow");
    newHeaders.set("Permissions-Policy", "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()");
    applyNoStoreHeaders(newHeaders);

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  },
};
