history.scrollRestoration = "manual";

// Không snapshot sớm — đọc từ window lúc renderProducts() chạy để tránh defer race condition
let PRODUCTS = [];
let DISPLAY_ORDER = [];

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
<article class="card pcard" onclick="openProduct('${escapeAttr(p.id)}')">
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
  wrap.innerHTML = `<div class="pcard-list">${ordered.map(productCard).join("")}</div>`;
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

function communityOpenPopup() {
  resetCommunityCopyState("communityFbCopyBtn", "Copy link");
  resetCommunityCopyState("communityZaloCopyBtn", "Copy link");
  const popup = document.getElementById("communityPopup");
  if (!popup) return;
  popup.classList.add("open");
  document.body.style.overflow = "hidden";
  if (window.syncNotifBarVisibility) window.syncNotifBarVisibility();
}

function communityClosePopup() {
  const popup = document.getElementById("communityPopup");
  if (!popup) return;
  popup.classList.remove("open");
  document.body.style.overflow = "";
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

function communityZaloCopy() {
  const btn = document.getElementById("communityZaloCopyBtn");
  copyTextWithFallback("https://zalo.me/g/iaujemqdy7tpv6d0bapx").then(function () {
    if (btn._resetTimer) clearTimeout(btn._resetTimer);
    btn.classList.add("is-copied");
    btn.querySelector(".copy-label").textContent = "Đã copy";
    btn._resetTimer = setTimeout(function () {
      btn.classList.remove("is-copied");
      btn.querySelector(".copy-label").textContent = "Copy link";
      btn._resetTimer = null;
    }, 1800);
  }).catch(function () {
    showCopyPrompt("https://zalo.me/g/iaujemqdy7tpv6d0bapx", "Đã sao chép link Zalo");
  });
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

