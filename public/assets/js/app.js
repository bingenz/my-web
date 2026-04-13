history.scrollRestoration = "manual";

// ── Scroll lock ──────────────────────────────────────────────────────────────
// Dùng overflow:hidden thay vì position:fixed — position:fixed tạo stacking context
// khiến trust-proof-viewer (fixed child) bị trap, không hiện được trên modal
let _scrollLockCount = 0;
let _scrollLockY = 0;
function clearScrollLockState() {
  _scrollLockCount = 0;
  document.body.classList.remove("scroll-locked");
  document.documentElement.style.removeProperty("--scrollbar-width");
}
function scrollLock() {
  _scrollLockCount++;
  if (_scrollLockCount > 1) return;
  _scrollLockY = window.scrollY || window.pageYOffset || 0;
  var sw = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty("--scrollbar-width", sw + "px");
  document.body.classList.add("scroll-locked");
}
function scrollUnlock() {
  if (_scrollLockCount === 0) return;
  _scrollLockCount--;
  if (_scrollLockCount > 0) return;
  var y = _scrollLockY;
  clearScrollLockState();
  window.scrollTo(0, y);
}

const WELCOME_DISMISSED_KEY = "__bingenz_welcome_dismissed__";

function isWelcomeDismissed() {
  try {
    return localStorage.getItem(WELCOME_DISMISSED_KEY) === "1";
  } catch (e) {
    return false;
  }
}

function setWelcomeDismissed(value) {
  try {
    if (value) {
      localStorage.setItem(WELCOME_DISMISSED_KEY, "1");
    } else {
      localStorage.removeItem(WELCOME_DISMISSED_KEY);
    }
  } catch (e) {}
}

function hasOpenUiLayer() {
  return !!document.querySelector(
    ".modal.open, .link-popup.open, .welcome-overlay.open, .trust-proof-viewer.open"
  );
}

function syncUiObscuredState() {
  var obscured = hasOpenUiLayer();
  document.documentElement.classList.toggle("ui-obscured", obscured);
  document.body.classList.toggle("ui-obscured", obscured);
  if (window.syncNotifBarVisibility) window.syncNotifBarVisibility();
}

function getScrollableOverlayContainer(target) {
  if (!target || !target.closest) return null;
  return target.closest(
    ".modal-box, .link-popup-box, .welcome-box, .trust-proof-viewer-shell"
  );
}

function shouldPreventOverlayScroll(event) {
  if (_scrollLockCount <= 0) return false;
  return !getScrollableOverlayContainer(event.target);
}

window.addEventListener(
  "wheel",
  function (event) {
    if (shouldPreventOverlayScroll(event)) {
      event.preventDefault();
    }
  },
  { passive: false }
);

window.addEventListener(
  "touchmove",
  function (event) {
    if (shouldPreventOverlayScroll(event)) {
      event.preventDefault();
    }
  },
  { passive: false }
);
// ─────────────────────────────────────────────────────────────────────────────

// Không snapshot sớm — đọc từ window lúc renderProducts() chạy để tránh defer race condition
let PRODUCTS = [];
let DISPLAY_ORDER = [];
const TRUST_PROOF_ITEMS = [
  { full: "assets/proofs/Screenshot_20260315_150720_Zalo.png", thumb: "assets/proofs/Screenshot_20260315_150720_Zalo.png" },
  { full: "assets/proofs/Screenshot_20260319_095440_Zalo.jpg", thumb: "assets/proofs/Screenshot_20260319_095440_Zalo.jpg" },
  { full: "assets/proofs/Screenshot_20260320_193706_Zalo.jpg", thumb: "assets/proofs/Screenshot_20260320_193706_Zalo.jpg" },
  { full: "assets/proofs/Screenshot_20260312_093346_Messenger.jpg", thumb: "assets/proofs/Screenshot_20260312_093346_Messenger.jpg" },
  { full: "assets/proofs/Screenshot_20260312_093801_Photos.jpg", thumb: "assets/proofs/Screenshot_20260312_093801_Photos.jpg" },
  { full: "assets/proofs/Screenshot_20260312_093909_Photos.jpg", thumb: "assets/proofs/Screenshot_20260312_093909_Photos.jpg" },
  { full: "assets/proofs/Screenshot_20260312_094706_Messenger.jpg", thumb: "assets/proofs/Screenshot_20260312_094706_Messenger.jpg" },
  { full: "assets/proofs/Screenshot_20260312_095052_Messenger.jpg", thumb: "assets/proofs/Screenshot_20260312_095052_Messenger.jpg" },
  { full: "assets/proofs/Screenshot_20260312_100126_Zalo.jpg", thumb: "assets/proofs/Screenshot_20260312_100126_Zalo.jpg" },
  { full: "assets/proofs/Screenshot_20260312_100158_Zalo.jpg", thumb: "assets/proofs/Screenshot_20260312_100158_Zalo.jpg" },
  { full: "assets/proofs/Screenshot_20260312_100232_Zalo.jpg", thumb: "assets/proofs/Screenshot_20260312_100232_Zalo.jpg" },
  { full: "assets/proofs/Screenshot_20260312_100250_Zalo.jpg", thumb: "assets/proofs/Screenshot_20260312_100250_Zalo.jpg" },
  { full: "assets/proofs/Screenshot_20260312_100710_Photos.jpg", thumb: "assets/proofs/Screenshot_20260312_100710_Photos.jpg" },
  { full: "assets/proofs/Screenshot_20260312_100751_Zalo.jpg", thumb: "assets/proofs/Screenshot_20260312_100751_Zalo.jpg" },
  { full: "assets/proofs/Screenshot_20260312_100832_Zalo.jpg", thumb: "assets/proofs/Screenshot_20260312_100832_Zalo.jpg" },
  { full: "assets/proofs/Screenshot_20260312_100942_Zalo.jpg", thumb: "assets/proofs/Screenshot_20260312_100942_Zalo.jpg" },
  { full: "assets/proofs/Screenshot_20260312_101003_Zalo.jpg", thumb: "assets/proofs/Screenshot_20260312_101003_Zalo.jpg" },
  { full: "assets/proofs/Screenshot_20260312_101027_Zalo.jpg", thumb: "assets/proofs/Screenshot_20260312_101027_Zalo.jpg" },
  { full: "assets/proofs/Screenshot_20260312_101238_Zalo.jpg", thumb: "assets/proofs/Screenshot_20260312_101238_Zalo.jpg" },
  { full: "assets/proofs/Screenshot_20260312_101253_Zalo.jpg", thumb: "assets/proofs/Screenshot_20260312_101253_Zalo.jpg" },
  { full: "assets/proofs/Screenshot_20260314_203458_Messenger.png", thumb: "assets/proofs/Screenshot_20260314_203458_Messenger.png" },
  { full: "assets/proofs/Screenshot_20260314_203622_Messenger.png", thumb: "assets/proofs/Screenshot_20260314_203622_Messenger.png" },
  { full: "assets/proofs/Screenshot_20260317_143054_Zalo.jpg", thumb: "assets/proofs/Screenshot_20260317_143054_Zalo.jpg" },
  { full: "assets/proofs/Screenshot_20260321_170230_Zalo.jpg", thumb: "assets/proofs/Screenshot_20260321_170230_Zalo.jpg" },
  { full: "assets/proofs/Screenshot_20260323_001701_Zalo.jpg", thumb: "assets/proofs/Screenshot_20260323_001701_Zalo.jpg" }
];
const TRUST_PROOF_TEASER = {
  full: "assets/proofs/Screenshot_20260315_150720_Zalo.png",
  thumb: "assets/proofs/Screenshot_20260315_150720_Zalo.png"
};
let trustProofInitialized = false;
let currentTrustProofIndex = -1;

function fmtPriceShort(n) {
  if (!n) return "";
  if (n % 1000 === 0) return n / 1000 + "K";
  return n.toLocaleString("vi-VN") + "đ";
}

function escapeAttr(value) {
  return String(value || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}


function getBadgeTone(label) {
  return label === "CHÍNH CHỦ" ? "red" : "green";
}

function getProductNoticeItems(product) {
  const label = product && product.label === "CHÍNH CHỦ" ? "CHÍNH CHỦ" : "CÁ NHÂN";
  const isOfficial = label === "CHÍNH CHỦ";

  return [
    {
      tone: "neutral",
      title: 'Bảo hành toàn bộ thời gian sử dụng',
      sub: 'Không dùng chung với người khác'
    },
    isOfficial
      ? {
          tone: "red",
          title: 'Tài khoản <span class="badge-inline red">CHÍNH CHỦ</span>',
          sub: 'Nâng cấp thẳng vào Gmail của bạn · Không cần mật khẩu'
        }
      : {
          tone: "green",
          title: 'Tài khoản <span class="badge-inline">CÁ NHÂN</span>',
          sub: 'Shop cấp tài khoản riêng · Sử dụng 1 mình'
        }
  ];
}

function renderProductNotice(product) {
  const noticeList = document.getElementById("productNoticeList");
  if (!noticeList) return;

  const items = getProductNoticeItems(product);
  noticeList.innerHTML = items.map(function (item) {
    const toneClass = item.tone && item.tone !== "neutral" ? ' notice-item-' + item.tone : '';
    return `
<li class="notice-item${toneClass}">
<span class="wn-dot"></span>
<span class="notice-item-body"><span class="notice-item-title">${item.title}</span><span class="notice-item-sub">${item.sub}</span></span>
</li>`;
  }).join("");
}

function productCard(p) {
  const displayPrice = p.monthlyPrice ? fmtPriceShort(p.monthlyPrice) : p.rawPrice || "";
  const badgeTone = getBadgeTone(p.label);

  return `
<article class="pcard" onclick="openProduct('${escapeAttr(p.id)}')">
<span class="badge ${badgeTone} pcard-badge">${p.label || "CÁ NHÂN"}</span>
<div class="pcard-top">
<img class="pcard-ico" src="${p.image}" alt="${escapeAttr(p.name)}" loading="lazy" decoding="async" width="42" height="42">
<h3 class="pcard-name">${p.name}</h3>
</div>
<div class="pcard-bottom">
<div class="pcard-price-block">
<div class="pcard-price-val">${displayPrice}<span class="pcard-price-mo"> /tháng</span></div>
<div class="pcard-price-old">Gốc: <s>${p.oldPrice}</s></div>
</div>
<button class="pcard-cta" onclick="event.stopPropagation();openProduct('${escapeAttr(p.id)}')">Mua ngay</button>
</div>
</article>
`;
}

function renderProducts() {
  // Đọc lại từ window tại thời điểm gọi — tránh race condition defer
  PRODUCTS = window.PRODUCTS || [];
  DISPLAY_ORDER = window.DISPLAY_ORDER || [];

  const wrap = document.getElementById("productGrid");
  if (!wrap) return;

  const ordered = DISPLAY_ORDER.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  const desktopCols = window.innerWidth >= 1100 ? 3 : (window.innerWidth >= 768 ? 2 : 1);
  const listStyle = desktopCols === 1
    ? "display:flex;flex-direction:column;gap:22px;"
    : "display:grid;grid-template-columns:repeat(" + desktopCols + ", minmax(0, 1fr));gap:18px;align-items:stretch;";
  const cardStyle = desktopCols === 1 ? "" : ' style="height:100%"';
  wrap.innerHTML = `<div class="pcard-list" style="${listStyle}">${ordered.map(function (p) { return productCard(p).replace('<article class="pcard"', '<article class="pcard"' + cardStyle); }).join("")}</div>`;
}

function openProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  resetModalZaloCopyState();

  const mName = document.getElementById("mName");
  if (mName) {
    if (p.label) {
      const badgeTone = getBadgeTone(p.label);
      const badgeClass = badgeTone === "red" ? "badge-inline red" : "badge-inline";
      mName.innerHTML = `${p.name} <span class="${badgeClass} modal-title-badge">${p.label}</span>`;
    } else {
      mName.textContent = p.name;
    }
  }

  renderProductNotice(p);

  const ico = document.getElementById("mHeadIco");
  if (ico) {
    ico.src = p.image;
    ico.alt = p.name;
    ico.style.display = "block";
  }

  const modal = document.getElementById("productModal");
  if (!modal) return;
  if (modal.classList.contains("open")) return;
  modal.classList.add("open");
  scrollLock();
  syncUiObscuredState();
}

function openDevModal() {
  const list = document.getElementById("devDetailList");
  const arrow = document.getElementById("devDetailArrow");
  if (list) list.style.display = "none";
  if (arrow) arrow.style.transform = "";
  resetDevZaloCopyState();
  const modal = document.getElementById("devModal");
  if (!modal || modal.classList.contains("open")) return;
  modal.classList.add("open");
  scrollLock();
  syncUiObscuredState();
}

function closeDevModal() {
  resetDevZaloCopyState();
  const modal = document.getElementById("devModal");
  if (!modal || !modal.classList.contains("open")) return;
  modal.classList.remove("open");
  scrollUnlock();
  syncUiObscuredState();
}

function toggleDevDetail() {
  const list = document.getElementById("devDetailList");
  const arrow = document.getElementById("devDetailArrow");
  if (!list || !arrow) return;

  const open = list.style.display !== "none";
  list.style.display = open ? "none" : "block";
  arrow.style.transform = open ? "" : "rotate(180deg)";
  arrow.style.transition = "transform 0.2s";
}

function resetModalZaloCopyState() {
  const copyBtn = document.getElementById("modalZaloCopyBtn");
  if (!copyBtn) return;
  if (copyBtn._resetTimer) {
    clearTimeout(copyBtn._resetTimer);
    copyBtn._resetTimer = null;
  }
  copyBtn.classList.remove("is-copied");
  copyBtn.textContent = "Copy số";
}

function copyModalZalo() {
  const copyBtn = document.getElementById("modalZaloCopyBtn");
  if (!copyBtn) return;

  copyTextWithFallback("0898908101").then(function () {
    if (copyBtn._resetTimer) clearTimeout(copyBtn._resetTimer);
    copyBtn.classList.add("is-copied");
    copyBtn.textContent = "Đã copy";
    copyBtn._resetTimer = setTimeout(function () {
      copyBtn.classList.remove("is-copied");
      copyBtn.textContent = "Copy số";
      copyBtn._resetTimer = null;
    }, 1800);
  }).catch(function () {
    showStatusToast("Không thể sao chép tự động. Vui lòng sao chép thủ công: 0898908101");
  });
}

function resetDevZaloCopyState() {
  const copyBtn = document.getElementById("devZaloCopyBtn");
  if (!copyBtn) return;
  if (copyBtn._resetTimer) {
    clearTimeout(copyBtn._resetTimer);
    copyBtn._resetTimer = null;
  }
  copyBtn.classList.remove("is-copied");
  copyBtn.textContent = "Copy số";
}

function copyDevZalo() {
  const copyBtn = document.getElementById("devZaloCopyBtn");
  if (!copyBtn) return;

  copyTextWithFallback("0898908101").then(function () {
    if (copyBtn._resetTimer) clearTimeout(copyBtn._resetTimer);
    copyBtn.classList.add("is-copied");
    copyBtn.textContent = "Đã copy";
    copyBtn._resetTimer = setTimeout(function () {
      copyBtn.classList.remove("is-copied");
      copyBtn.textContent = "Copy số";
      copyBtn._resetTimer = null;
    }, 1800);
  }).catch(function () {
    showStatusToast("Không thể sao chép tự động. Vui lòng sao chép thủ công: 0898908101");
  });
}

function closeModal() {
  resetModalZaloCopyState();
  const modal = document.getElementById("productModal");
  if (!modal || !modal.classList.contains("open")) return;
  modal.classList.remove("open");
  scrollUnlock();
  syncUiObscuredState();
}

function initTrustProofModal() {
  if (trustProofInitialized) return;
  const grid = document.getElementById("trustProofGrid");
  if (!grid) return;

  const thumbs = TRUST_PROOF_ITEMS.map(function (item, index) {
    return `
<button class="trust-proof-thumb" type="button" data-proof-index="${index}" aria-label="Xem bill giao dịch ${index + 1}">
<img src="${item.thumb}" alt="Bill giao dịch ${index + 1}" loading="lazy" decoding="async" width="280" height="360">
<span class="trust-proof-thumb-label">Bill giao dịch ${index + 1}</span>
</button>`;
  }).join("");

  const teaser = `
<div class="trust-proof-more" aria-hidden="true">
<img src="${TRUST_PROOF_TEASER.thumb}" alt="" loading="lazy" decoding="async" width="280" height="360">
<div class="trust-proof-more-overlay">
<div class="trust-proof-more-title">Còn hơn 200 giao dịch với khách hàng</div>
<div class="trust-proof-more-note">Một phần bill được hiển thị ở đây để khách tiện tham khảo nhanh.</div>
</div>
</div>`;

  grid.innerHTML = thumbs + teaser;

  grid.querySelectorAll("[data-proof-index]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setTrustProof(Number(btn.getAttribute("data-proof-index")));
    });
  });

  trustProofInitialized = true;
}

function setTrustProof(index) {
  if (!TRUST_PROOF_ITEMS[index]) return;
  currentTrustProofIndex = index;

  document.querySelectorAll(".trust-proof-thumb").forEach(function (btn) {
    btn.classList.toggle("is-active", Number(btn.getAttribute("data-proof-index")) === index);
  });

  openTrustProofViewer(index);
}

function openTrustProofModal(e) {
  if (e) e.preventDefault();
  initTrustProofModal();
  resetTrustProofSelection();
  const modal = document.getElementById("trustProofModal");
  if (!modal || modal.classList.contains("open")) return;
  modal.classList.add("open");
  scrollLock();
  syncUiObscuredState();
}

function closeTrustProofModal() {
  const modal = document.getElementById("trustProofModal");
  if (!modal || !modal.classList.contains("open")) return;
  modal.classList.remove("open");
  closeTrustProofViewer();
  scrollUnlock();
  syncUiObscuredState();
}

function resetTrustProofSelection() {
  currentTrustProofIndex = -1;

  document.querySelectorAll(".trust-proof-thumb").forEach(function (btn) {
    btn.classList.remove("is-active");
  });
}

function openTrustProofViewer(index) {
  const item = TRUST_PROOF_ITEMS[index];
  if (!item) return;

  const viewer = document.getElementById("trustProofViewer");
  const image = document.getElementById("trustProofViewerImage");
  if (!viewer || !image) return;

  image.src = item.full;
  image.alt = "Bill giao dịch " + (index + 1);
  viewer.classList.add("open");
}

function closeTrustProofViewer() {
  const viewer = document.getElementById("trustProofViewer");
  const image = document.getElementById("trustProofViewerImage");
  if (!viewer || !image) return;

  viewer.classList.remove("open");
  image.removeAttribute("src");
  image.alt = "Bill giao dịch";
}

function openTrustProofFromWelcome(e) {
  if (e) e.preventDefault();
  welcomeClose({ remember: true });
  setTimeout(function () {
    openTrustProofModal();
  }, 180);
}

function showStatusToast(message) {
  var toast = document.getElementById("statusToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "statusToast";
    toast.style.cssText = "position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(12px);background:#0f172a;border:1px solid rgba(255,255,255,0.12);border-radius:999px;padding:10px 18px;font-size:0.82em;font-weight:600;color:#fff;z-index:300;opacity:0;transition:opacity 0.22s ease,transform 0.22s ease;white-space:nowrap;pointer-events:none;";
    document.body.appendChild(toast);
  }
  toast.textContent = message || "";
  requestAnimationFrame(function () {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  });
  clearTimeout(toast._timer);
  toast._timer = setTimeout(function () {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(12px)";
  }, 2800);
}

function copyTextWithFallback(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).catch(function () {
      return tryExecCommandCopy(text);
    });
  }
  return tryExecCommandCopy(text);
}

function tryExecCommandCopy(text) {
  return new Promise(function (resolve, reject) {
    try {
      const input = document.createElement("textarea");
      input.value = text;
      input.setAttribute("readonly", "");
      input.style.cssText = "position:fixed;top:0;left:0;width:2em;height:2em;padding:0;border:none;outline:none;box-shadow:none;background:transparent;font-size:16px;opacity:0;z-index:-1;";
      document.body.appendChild(input);
      input.focus();
      input.select();
      input.setSelectionRange(0, text.length);

      const copied = document.execCommand("copy");
      document.body.removeChild(input);
      if (copied) {
        resolve();
        return;
      }
      reject(new Error("copy_failed"));
    } catch (err) {
      reject(err);
    }
  });
}

function showCopyPrompt(text, message) {
  window.prompt("Giữ để sao chép:", text);
  showStatusToast(message || ("Đã sao chép: " + text));
}

function communityOpenPopup() {
  resetCommunityCopyState("communityFbCopyBtn", "Copy link");
  const popup = document.getElementById("communityPopup");
  if (!popup || popup.classList.contains("open")) return;
  popup.classList.add("open");
  scrollLock();
  syncUiObscuredState();
  if (window.syncNotifBarVisibility) window.syncNotifBarVisibility();
}

function communityClosePopup() {
  const popup = document.getElementById("communityPopup");
  if (!popup || !popup.classList.contains("open")) return;
  popup.classList.remove("open");
  scrollUnlock();
  syncUiObscuredState();
}

function resetCommunityCopyState(btnId, label) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  if (btn._resetTimer) { clearTimeout(btn._resetTimer); btn._resetTimer = null; }
  btn.classList.remove("is-copied");
  btn.querySelector(".copy-label").textContent = label;
}

function communityFbCopy() {
  const btn = document.getElementById("communityFbCopyBtn");
  copyTextWithFallback("https://www.facebook.com/groups/1083123091540550/").then(function () {
    if (btn._resetTimer) clearTimeout(btn._resetTimer);
    btn.classList.add("is-copied");
    btn.querySelector(".copy-label").textContent = "Đã copy";
    btn._resetTimer = setTimeout(function () {
      btn.classList.remove("is-copied");
      btn.querySelector(".copy-label").textContent = "Copy link";
      btn._resetTimer = null;
    }, 1800);
  }).catch(function () {
    showCopyPrompt("https://www.facebook.com/groups/1083123091540550/", "Đã sao chép link Facebook");
  });
}


function zaloOpenPopup() {
  const popup = document.getElementById("zaloPopup");
  if (!popup || popup.classList.contains("open")) return;
  popup.classList.add("open");
  scrollLock();
  syncUiObscuredState();
  if (window.syncNotifBarVisibility) window.syncNotifBarVisibility();
}

function zaloClosePopup() {
  const popup = document.getElementById("zaloPopup");
  if (!popup || !popup.classList.contains("open")) return;
  popup.classList.remove("open");
  scrollUnlock();
  syncUiObscuredState();
}

function copyContactZalo() {
  const copyBtn = document.getElementById("zaloCopyBtn");
  const copyLabel = copyBtn ? copyBtn.querySelector(".copy-label") : null;

  copyTextWithFallback("0898908101").then(function () {
    if (!copyBtn || !copyLabel) return;
    if (copyBtn._resetTimer) clearTimeout(copyBtn._resetTimer);
    copyBtn.classList.add("is-copied");
    copyLabel.textContent = "Đã copy";
    copyBtn._resetTimer = setTimeout(function () {
      copyBtn.classList.remove("is-copied");
      copyLabel.textContent = "Copy số";
      copyBtn._resetTimer = null;
    }, 1800);
  }).catch(function () {
    showCopyPrompt("0898908101", "Đã sao chép số Zalo: 0898908101");
  });
}

function openFirstProduct(e) {
  e.preventDefault();
  const target = document.getElementById("products");
  if (!target) return;

  const topbar = document.querySelector(".topbar");
  const topbarH = topbar ? topbar.offsetHeight : 68;
  const notifBar = document.querySelector(".notif-bar.visible");
  const notifH = notifBar ? notifBar.offsetHeight : 0;
  const offset = topbarH + notifH + 8;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

renderProducts();
(function() {
  var _rpTimer = 0;
  window.addEventListener("resize", function() {
    clearTimeout(_rpTimer);
    _rpTimer = setTimeout(renderProducts, 120);
  });
})();

(function () {
  const notifBar = document.querySelector(".notif-bar");
  const communityCard = document.querySelector("#community .community-card-link");
  const topbar = document.querySelector(".topbar");
  if (!notifBar || !communityCard || !topbar) return;

  let io = null;
  let rafId = 0;

  function setNotifVisibility(isVisible) {
    if (isVisible) {
      notifBar.classList.add("visible");
    } else {
      notifBar.classList.remove("visible");
    }
  }

  var isTikTokBrowser = document.documentElement.classList.contains('tiktok-browser');

  function syncNotifBar() {
    const welcomeOverlay = document.getElementById("welcomeNotif");
    if (welcomeOverlay && welcomeOverlay.classList.contains("open")) {
      setNotifVisibility(false);
      return;
    }

    const topbarH = topbar.offsetHeight || 68;

    if (isTikTokBrowser) {
      // Sticky mode: notif-bar nằm trong flow, cần set top đúng dưới topbar
      notifBar.style.top = topbarH + 'px';
      // Trigger dựa trên scroll position so với communityCard
      const rect = communityCard.getBoundingClientRect();
      setNotifVisibility(rect.top < topbarH + 8);
    } else {
      // Fixed mode: topbar luôn ở trên, dùng rect trực tiếp
      const rect = communityCard.getBoundingClientRect();
      setNotifVisibility(rect.top < topbarH + 8);
    }
  }

  function scheduleSync() {
    if (rafId) return;
    rafId = window.requestAnimationFrame(function () {
      rafId = 0;
      syncNotifBar();
    });
  }

  function bindObserver() {
    if (!("IntersectionObserver" in window)) {
      window.addEventListener("scroll", scheduleSync, { passive: true });
      window.addEventListener("resize", scheduleSync);
      window.addEventListener("load", scheduleSync);
      scheduleSync();
      return;
    }

    function rebuildObserver() {
      if (io) io.disconnect();
      const topbarH = topbar.offsetHeight || 68;

      // Trong TikTok sticky mode, set đúng top của notif-bar
      if (isTikTokBrowser) {
        notifBar.style.top = topbarH + 'px';
      }

      io = new IntersectionObserver(function () {
        const welcomeOverlay = document.getElementById("welcomeNotif");
        if (welcomeOverlay && welcomeOverlay.classList.contains("open")) {
          setNotifVisibility(false);
          return;
        }

        const rect = communityCard.getBoundingClientRect();
        const hasPassedTrigger = rect.top < topbarH + 8;
        const hasUserScrolled = window.scrollY > 24;

        setNotifVisibility(hasPassedTrigger && hasUserScrolled);
      }, {
        root: null,
        threshold: 0,
        rootMargin: '-' + (topbarH + 8) + 'px 0px 0px 0px'
      });
      io.observe(communityCard);
      scheduleSync();
    }

    rebuildObserver();
    window.addEventListener("resize", rebuildObserver);
    window.addEventListener("load", scheduleSync);
  }

  window.syncNotifBarVisibility = scheduleSync;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindObserver);
  } else {
    bindObserver();
  }
})();

function welcomeOpen(options) {
  const overlay = document.getElementById("welcomeNotif");
  const opts = options || {};
  if (!overlay || overlay.classList.contains("open")) return;
  if (opts.auto && isWelcomeDismissed()) return;
  overlay.style.display = "flex";
  void overlay.offsetWidth;
  overlay.classList.add("open");
  scrollLock();
  syncUiObscuredState();
}

function welcomeClose(options) {
  const overlay = document.getElementById("welcomeNotif");
  const opts = options || {};
  if (!overlay || !overlay.classList.contains("open")) return;
  overlay.classList.remove("open");
  scrollUnlock();
  if (opts.remember !== false) {
    setWelcomeDismissed(true);
  }
  syncUiObscuredState();

  setTimeout(function () {
    if (!overlay.classList.contains("open")) {
      overlay.style.display = "";
    }
  }, 250);
}

function welcomeCopyZalo() {
  const btn = document.getElementById("welcomeCopyBtn");
  if (!btn) return;

  copyTextWithFallback("0898908101").then(function () {
    if (btn._resetTimer) clearTimeout(btn._resetTimer);
    btn.classList.add("is-copied");
    btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Đã copy';
    btn._resetTimer = setTimeout(function () {
      btn.classList.remove("is-copied");
      btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy số';
      btn._resetTimer = null;
    }, 1800);
  }).catch(function () {
    showCopyPrompt("0898908101", "Đã sao chép số Zalo: 0898908101");
  });
}

function initPage() {
  window.scrollTo(0, 0);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPage);
} else {
  initPage();
}

document.addEventListener("keydown", function (event) {
  if (event.key !== "Escape") return;
  const trustViewer = document.getElementById("trustProofViewer");
  if (trustViewer && trustViewer.classList.contains("open")) {
    closeTrustProofViewer();
    return;
  }
  const communityPopup = document.getElementById("communityPopup");
  if (communityPopup && communityPopup.classList.contains("open")) {
    communityClosePopup();
    return;
  }
  const zaloPopup = document.getElementById("zaloPopup");
  if (zaloPopup && zaloPopup.classList.contains("open")) {
    zaloClosePopup();
    return;
  }
  const trustModal = document.getElementById("trustProofModal");
  if (trustModal && trustModal.classList.contains("open")) {
    closeTrustProofModal();
  }
});

(function () {
  function tryShowWelcome() {
    if (document.getElementById("welcomeNotif")) {
      setTimeout(function () { welcomeOpen({ auto: true }); }, 350);
    } else {
      window.addEventListener("load", function () {
        setTimeout(function () { welcomeOpen({ auto: true }); }, 350);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tryShowWelcome);
  } else {
    tryShowWelcome();
  }
})();

function normalizeRestoredUiState(isBackForward) {
  document.querySelectorAll(".modal.open, .link-popup.open").forEach(function (el) {
    el.classList.remove("open");
  });

  const wn = document.getElementById("welcomeNotif");
  if (wn) {
    wn.classList.remove("open", "show", "active");
    wn.style.display = isBackForward ? "" : wn.style.display;
  }

  document.body.classList.remove("modal-open", "overlay-open", "no-scroll", "ui-obscured");
  document.documentElement.classList.remove("ui-obscured");
  clearScrollLockState();
}

window.addEventListener("pageshow", function (event) {
  let nav = null;
  if (window.performance && typeof window.performance.getEntriesByType === "function") {
    const entries = window.performance.getEntriesByType("navigation");
    if (entries && entries.length) nav = entries[0];
  }

  const isBackForward = !!event.persisted || (nav && nav.type === "back_forward");
  normalizeRestoredUiState(isBackForward);
  if (!isBackForward) return;

  const reloadKey = "__bingenz_bf_reloaded__";
  try {
    if (sessionStorage.getItem(reloadKey) === "1") {
      sessionStorage.removeItem(reloadKey);
      return;
    }
    sessionStorage.setItem(reloadKey, "1");
  } catch (e) {}

  location.replace(location.pathname + location.search);
});

