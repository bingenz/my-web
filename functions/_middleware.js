// functions/_middleware.js — Cloudflare Worker Middleware + Visitor Tracking

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

// ⚠️  QUAN TRỌNG: Khi cập nhật title/description/og tags trong index.src.html,
//    nhớ cập nhật SHELL_HTML bên dưới cho đồng bộ (dùng cho bot/crawler).
const SHELL_HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>BinGenZ · AI & PREMIUM ACCOUNT STORE</title>
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://bingenz.com">
  <meta property="og:title" content="BinGenZ · AI & PREMIUM ACCOUNT STORE">
  <meta property="og:description" content="ChatGPT Plus Codex, Gemini Pro, YouTube Premium, CapCut Pro, Netflix Cao Cấp. Nhận thanh toán Visa, Mastercard, PayPal và nhận Code Bot Telegram.">
  <meta property="og:locale" content="vi_VN">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="BinGenZ · AI & PREMIUM ACCOUNT STORE">
  <meta name="twitter:description" content="ChatGPT Plus Codex, Gemini Pro, YouTube Premium, CapCut Pro, Netflix Cao Cấp.">
  <meta name="description" content="ChatGPT Plus Codex, Gemini Pro, YouTube Premium, CapCut Pro, Netflix Cao Cấp. Nhận thanh toán Visa, Mastercard, PayPal và nhận Code Bot Telegram.">
</head>
<body><p>Vui lòng mở trên trình duyệt để xem nội dung.</p></body>
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
  if (/CocCoc/i.test(ua)) return "Cốc Cốc";
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

    // Dùng timezone +7
    const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const dateStr = vnTime.toISOString().slice(0, 10); // YYYY-MM-DD
    const timeStr = vnTime.toISOString().slice(11, 16); // HH:MM

    // Dedup: cùng IP trong cùng ngày không tính lại
    const dedupKey = `dedup:${dateStr}:${ip}`;
    const alreadyCounted = await kv.get(dedupKey);
    if (alreadyCounted) return;

    // Lưu dedup flag, TTL 48 giờ
    await kv.put(dedupKey, "1", { expirationTtl: 172800 });

    // Lấy log ngày hiện tại
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
    // Lưu log, TTL 30 ngày
    await kv.put(logKey, JSON.stringify(existing), { expirationTtl: 2592000 });

    // Cập nhật tổng theo ngày
    const totalKey = `total:${dateStr}`;
    const total = parseInt(await kv.get(totalKey) || "0") + 1;
    await kv.put(totalKey, String(total), { expirationTtl: 2592000 });

  } catch (e) {
    // Không làm crash middleware nếu KV lỗi
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
    ]);

    // ✅ Redirect domain cũ sang domain mới
    if (legacyHosts.has(url.hostname) || url.hostname.endsWith(".workers.dev")) {
      const target = NEW_ORIGIN + url.pathname + url.search + url.hash;
      return Response.redirect(target, 308);
    }

    // Bỏ qua tracking cho /stats
    if (url.pathname === "/stats") {
      return env.ASSETS.fetch(request);
    }

    // Chỉ serve encoded page cho browser thật, còn lại trả SHELL_HTML cho crawler đọc meta
    const isRealBrowser = ua.length > 20
      && /Mozilla\/5\.0/i.test(ua)
      && /(Chrome|Firefox|Safari|Edg|OPR|CocCoc)\/[\d.]+/i.test(ua)
      && !BOT_UA_PATTERNS.some(p => p.test(ua));

    if (!isRealBrowser) {
      return new Response(SHELL_HTML, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Frame-Options": "DENY",
          "X-Content-Type-Options": "nosniff",
          "X-XSS-Protection": "1; mode=block",
          "Referrer-Policy": "no-referrer",
          "X-DNS-Prefetch-Control": "off",
          "Permissions-Policy": "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
        },
      });
    }

    // Track visitor (không await để không làm chậm response)
    ctx.waitUntil(trackVisitor(request, env));

    // Serve static asset + thêm security headers
    const response = await env.ASSETS.fetch(request);
    const newHeaders = new Headers(response.headers);
    newHeaders.set("X-Frame-Options", "DENY");
    newHeaders.set("X-Content-Type-Options", "nosniff");
    newHeaders.set("X-XSS-Protection", "1; mode=block");
    newHeaders.set("Referrer-Policy", "no-referrer");
    newHeaders.set("X-DNS-Prefetch-Control", "off");
    newHeaders.set("Cache-Control", "no-store, no-cache");
    newHeaders.set("X-Robots-Tag", "noindex, nofollow");
    newHeaders.set("Permissions-Policy", "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()");

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  }
};
