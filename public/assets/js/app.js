history.scrollRestoration = "manual";

const PRODUCTS = window.PRODUCTS || [];
const DISPLAY_ORDER = window.DISPLAY_ORDER || [];

function fmtPriceShort(n) {
  if (!n) return "";
  if (n % 1000 === 0) return n / 1000 + "K";
  return n.toLocaleString("vi-VN") + "đ";
}

function escapeAttr(value) {
  return String(value || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function productCard(p) {
  const displayPrice = p.monthlyPrice ? fmtPriceShort(p.monthlyPrice) : p.rawPrice || "";
  const tagHtml = p.tag ? `<div class="tag">${p.tag}</div>` : "";

  return `
<article class="card">
<div class="head">
<div class="head-left">
<img class="head-ico" src="${p.image}" alt="${escapeAttr(p.name)}" loading="lazy" decoding="async" width="48" height="48">
<div class="head-text">
<h3 class="name">${p.name}</h3>
${tagHtml}
</div>
</div>
<span class="badge ${p.label === "CHÍNH CHỦ" ? "red" : "green"}">${p.label || "CÁ NHÂN"}</span>
</div>
<div class="price-row">
<div class="price-main">
<div class="price">${displayPrice}</div><span class="price-month">/tháng</span>
</div>
</div>
<div class="price-subrow">
<div class="old">Giá gốc: <s>${p.oldPrice}</s></div>
<div class="day">${p.perDay}</div>
</div>
<div class="cta-row">
<button class="cta buy" onclick="openProduct('${p.id}')">Đăng ký ngay</button>
</div>
</article>
`;
}

function renderProducts() {
  const wrap = document.getElementById("productGrid");
  if (!wrap) return;

  const ordered = DISPLAY_ORDER.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  wrap.innerHTML = `<div class="grid">${ordered.map(productCard).join("")}</div>`;
}

function openProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  resetModalZaloCopyState();

  const mName = document.getElementById("mName");
  if (mName) {
    if (p.label) {
      const isOfficial = p.label === "CHÍNH CHỦ";
      mName.innerHTML = `${p.name} <span style="display:inline-block;font-size:0.55em;font-weight:800;letter-spacing:0.04em;padding:0.15em 0.55em;border-radius:999px;vertical-align:middle;line-height:1.5;${isOfficial ? "color:#b91c1c;border:1.5px solid #fca5a5;background:#fff1f2;" : "color:#166534;border:1.5px solid #86efac;background:#f0fdf4;"}">${p.label}</span>`;
    } else {
      mName.textContent = p.name;
    }
  }

  const ico = document.getElementById("mHeadIco");
  if (ico) {
    ico.src = p.image;
    ico.alt = p.name;
    ico.style.display = "block";
  }

  const mTag = document.getElementById("mTag");
  if (mTag) {
    mTag.innerHTML = p.tag || "";
    mTag.hidden = !p.tag;
  }

  const mBullets = document.getElementById("mBullets");
  if (mBullets) {
    const bullets = Array.isArray(p.bullets) ? p.bullets : [];
    mBullets.innerHTML = bullets.map(item => `<li>${item}</li>`).join("");
    mBullets.hidden = bullets.length === 0;
  }

  const modal = document.getElementById("productModal");
  if (!modal) return;
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function openDevModal() {
  const list = document.getElementById("devDetailList");
  const arrow = document.getElementById("devDetailArrow");
  if (list) list.style.display = "none";
  if (arrow) arrow.style.transform = "";
  resetDevZaloCopyState();
  document.getElementById("devModal").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeDevModal() {
  resetDevZaloCopyState();
  document.getElementById("devModal").classList.remove("open");
  document.body.style.overflow = "";
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
    showStatusToast("Không thể sao chép tự động. Vui lòng sao chép thủ công: 0898908101", "https://cdn.simpleicons.org/zalo/0068FF");
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
    showStatusToast("Không thể sao chép tự động. Vui lòng sao chép thủ công: 0898908101", "https://cdn.simpleicons.org/zalo/0068FF");
  });
}

function closeModal() {
  resetModalZaloCopyState();
  document.getElementById("productModal").classList.remove("open");
  document.body.style.overflow = "";
}

function showRedirectToast(label, img) {
  const toast = document.getElementById("redirectToast");
  if (!toast) return;

  const toastImg = toast.querySelector(".t-img");
  const toastTxt = toast.querySelector(".t-text");
  if (toastImg && img) toastImg.src = img;
  if (toastTxt && label) toastTxt.textContent = "Đang chuyển đến " + label;

  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
}

function showStatusToast(message, img) {
  const toast = document.getElementById("redirectToast");
  if (!toast) return;

  const toastImg = toast.querySelector(".t-img");
  const toastTxt = toast.querySelector(".t-text");
  if (toastImg && img) toastImg.src = img;
  if (toastTxt && message) toastTxt.textContent = message;

  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
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
  showStatusToast(message || ("Đã sao chép: " + text), "");
}

function zaloOpenPopup() {
  const popup = document.getElementById("zaloPopup");
  if (!popup) return;
  popup.classList.add("open");
  document.body.style.overflow = "hidden";
  if (window.syncNotifBarVisibility) window.syncNotifBarVisibility();
}

function zaloClosePopup() {
  const popup = document.getElementById("zaloPopup");
  if (!popup) return;
  popup.classList.remove("open");
  document.body.style.overflow = "";
}

function copyContactZalo() {
  const copyBtn = document.getElementById("zaloCopyBtn");
  const copyLabel = copyBtn ? copyBtn.querySelector(".copy-label") : null;
  const resetTimer = copyBtn ? copyBtn._resetTimer : null;

  copyTextWithFallback("0898908101").then(function () {
    if (!copyBtn || !copyLabel) return;
    if (resetTimer) clearTimeout(resetTimer);
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
  const top = target.getBoundingClientRect().top + window.scrollY - topbarH;
  window.scrollTo({ top, behavior: "smooth" });
}

renderProducts();

(function () {
  const notifBar = document.querySelector(".notif-bar");
  const communityCard = document.querySelector("#community .community-card-link");
  const topbar = document.querySelector(".topbar");
  if (!notifBar || !communityCard || !topbar) return;

  function syncNotifBar() {
    const welcomeOverlay = document.getElementById("welcomeNotif");
    if (welcomeOverlay && welcomeOverlay.classList.contains("open")) {
      notifBar.classList.remove("visible");
      return;
    }

    const topbarH = topbar.offsetHeight || 68;
    const triggerBottom = communityCard.getBoundingClientRect().bottom + window.scrollY;
    const viewportTop = window.scrollY + topbarH + 8;

    if (viewportTop >= triggerBottom) {
      notifBar.classList.add("visible");
    } else {
      notifBar.classList.remove("visible");
    }
  }

  window.syncNotifBarVisibility = syncNotifBar;
  window.addEventListener("scroll", syncNotifBar, { passive: true });
  window.addEventListener("resize", syncNotifBar);
  window.addEventListener("load", syncNotifBar);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncNotifBar);
  } else {
    syncNotifBar();
  }
})();

function welcomeOpen() {
  const overlay = document.getElementById("welcomeNotif");
  if (!overlay) return;
  overlay.style.display = "flex";
  void overlay.offsetWidth;
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
  if (window.syncNotifBarVisibility) window.syncNotifBarVisibility();
}

function welcomeClose() {
  const overlay = document.getElementById("welcomeNotif");
  if (!overlay) return;
  overlay.classList.remove("open");
  document.body.style.overflow = "";
  if (window.syncNotifBarVisibility) window.syncNotifBarVisibility();

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

(function () {
  function tryShowWelcome() {
    if (document.getElementById("welcomeNotif")) {
      setTimeout(welcomeOpen, 350);
    } else {
      window.addEventListener("load", function () {
        setTimeout(welcomeOpen, 350);
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

  ["welcomePopup", "welcomeModal", "welcomeOverlay", "wlcPopup"].forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove("open", "show", "active");
    el.style.display = "none";
  });

  if (isBackForward) {
    const wn = document.getElementById("welcomeNotif");
    if (wn) {
      wn.classList.remove("open", "show", "active");
      wn.style.display = "";
    }
  }

  document.body.classList.remove("modal-open", "overlay-open", "no-scroll");
  document.body.style.overflow = "";

  const redirectToast = document.getElementById("redirectToast");
  if (redirectToast) redirectToast.classList.remove("show");
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
