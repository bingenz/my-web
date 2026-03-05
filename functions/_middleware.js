// functions/_middleware.js — Cloudflare Pages Middleware + Visitor Tracking

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

const SHELL_HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Binpinkgold Code Store</title>
  <meta name="description" content="Dịch vụ code web, bot Telegram, tài khoản Premium.">
  <meta property="og:title" content="Binpinkgold Code Store">
  <meta property="og:description" content="Chuyên cung cấp tài khoản Premium giá rẻ, kho code và dịch vụ lập trình.">
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

async function trackVisitor(context) {
  try {
    const kv = context.env.bin;
    if (!kv) return;

    const request = context.request;
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

export async function onRequest(context) {
  const { request, next } = context;
  const ua = request.headers.get("User-Agent") || "";
  const url = new URL(request.url);

  // Bỏ qua tracking cho /stats
  if (url.pathname === "/stats") {
    return next();
  }

  // Chặn bot/crawler
  if (!ua || ua.length < 10 || BOT_UA_PATTERNS.some(p => p.test(ua))) {
    return new Response(SHELL_HTML, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  // Track visitor (không await để không làm chậm response)
  context.waitUntil(trackVisitor(context));

  // Cho qua, thêm security headers
  const response = await next();
  const newHeaders = new Headers(response.headers);
  newHeaders.set("X-Frame-Options", "DENY");
  newHeaders.set("X-Content-Type-Options", "nosniff");
  newHeaders.set("Referrer-Policy", "no-referrer");
  newHeaders.set("Cache-Control", "no-store, no-cache");
  newHeaders.set("X-Robots-Tag", "noindex, nofollow");

  return new Response(response.body, {
    status: response.status,
    headers: newHeaders,
  });
}
