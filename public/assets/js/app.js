history.scrollRestoration = "manual";

const CONTACT_ZALO_NUMBER = "0898908101";
const COMMUNITY_FACEBOOK_URL = "https://www.facebook.com/groups/1083123091540550/";
const COMMUNITY_ZALO_URL = "https://zalo.me/g/iaujemqdy7tpv6d0bapx";
const ZALO_ICON_URL = "https://cdn.simpleicons.org/zalo/0068FF";
const FACEBOOK_ICON_URL = "https://cdn.simpleicons.org/facebook/1877F2";
const COPY_RESET_DELAY = 1800;

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

function getElement(id) {
  return document.getElementById(id);
}

function setBodyLocked(isLocked) {
  document.body.style.overflow = isLocked ? "hidden" : "";
}

function getBadgeTone(label) {
  return label === "CHÍNH CHỦ" ? "red" : "green";
}

function getBadgeClass(label, extraClass) {
  const classes = ["badge-inline"];
  if (getBadgeTone(label) === "red") classes.push("red");
  if (extraClass) classes.push(extraClass);
  return classes.join(" ");
}

function getProductNoticeItems(product) {
  const label = product && product.label === "CHÍNH CHỦ" ? "CHÍNH CHỦ" : "CÁ NHÂN";
  const isOfficial = label === "CHÍNH CHỦ";

  return [
    {
      tone: "neutral",
      title: '<strong>BINGENZ.COM</strong> luôn cấp tài khoản <strong>riêng cho bạn</strong>',
      sub: "Không dùng chung với người khác"
    },
    isOfficial
      ? {
          tone: "red",
          title: 'Tài khoản <span class="badge-inline red">CHÍNH CHỦ</span>',
          sub: "Nâng cấp thẳng vào Gmail của bạn · Không cần mật khẩu"
        }
      : {
          tone: "green",
          title: 'Tài khoản <span class="badge-inline">CÁ NHÂN</span>',
          sub: "Shop cấp tài khoản riêng · Sử dụng 1 mình"
        }
  ];
}

function renderProductNotice(product) {
  const noticeList = getElement("productNoticeList");
  if (!noticeList) return;

  const items = getProductNoticeItems(product);
  noticeList.innerHTML = items.map(function (item) {
    const toneClass = item.tone && item.tone !== "neutral" ? " notice-item-" + item.tone : "";
    return `
<li class="notice-item${toneClass}">
<span class="wn-dot"></span>
<span class="notice-item-body"><span class="notice-item-title">${item.title}</span><span class="notice-item-sub">${item.sub}</span></span>
</li>`;
  }).join("");
}

function productCard(product) {
  const displayPrice = product.monthlyPrice ? fmtPriceShort(product.monthlyPrice) : product.rawPrice || "";
  const badgeTone = getBadgeTone(product.label);

  return `
<article class="card pcard" onclick="openProduct('${escapeAttr(product.id)}')">
<span class="badge ${badgeTone} pcard-badge">${product.label || "CÁ NHÂN"}</span>
<div class="pcard-top">
<img class="pcard-ico" src="${product.image}" alt="${escapeAttr(product.name)}" loading="lazy" decoding="async" width="42" height="42">
<h3 class="pcard-name">${product.name}</h3>
</div>
<div class="pcard-bottom">
<div class="pcard-price-block">
<div class="pcard-price-val">${displayPrice}<span class="pcard-price-mo"> /tháng</span></div>
<div class="pcard-price-old">Gốc: <s>${product.oldPrice}</s></div>
</div>
<button class="pcard-cta" onclick="event.stopPropagation();openProduct('${escapeAttr(product.id)}')">Mua ngay</button>
</div>
</article>
`;
}

function renderProducts() {
  PRODUCTS = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
  DISPLAY_ORDER = Array.isArray(window.DISPLAY_ORDER) ? window.DISPLAY_ORDER : [];

  const wrap = getElement("productGrid");
  if (!wrap) return;

  const ordered = DISPLAY_ORDER
    .map(function (id) {
      return PRODUCTS.find(function (product) {
        return product.id === id;
      });
    })
    .filter(Boolean);

  wrap.innerHTML = `<div class="pcard-list">${ordered.map(productCard).join("")}</div>`;
}

function resetTimedButtonState(button, idleMarkup) {
  if (!button) return;
  if (button._resetTimer) {
    clearTimeout(button._resetTimer);
    button._resetTimer = null;
  }
  button.classList.remove("is-copied");
  button.innerHTML = idleMarkup;
}

function markButtonCopied(button, copiedMarkup, idleMarkup) {
  if (!button) return;
  if (button._resetTimer) clearTimeout(button._resetTimer);
  button.classList.add("is-copied");
  button.innerHTML = copiedMarkup;
  button._resetTimer = setTimeout(function () {
    button.classList.remove("is-copied");
    button.innerHTML = idleMarkup;
    button._resetTimer = null;
  }, COPY_RESET_DELAY);
}

function withCopiedText(button, text, onSuccess, onError) {
  if (!button) return;

  copyTextWithFallback(text)
    .then(function () {
      onSuccess(button);
    })
    .catch(function () {
      onError();
    });
}

function openLayer(id) {
  const layer = getElement(id);
  if (!layer) return null;

  if (layer.classList.contains("welcome-overlay")) {
    layer.style.display = "flex";
    void layer.offsetWidth;
  }

  layer.classList.add("open");
  setBodyLocked(true);
  if (window.syncNotifBarVisibility) window.syncNotifBarVisibility();
  return layer;
}

function closeLayer(id, options) {
  const layer = getElement(id);
  if (!layer) return null;

  const config = options || {};
  layer.classList.remove("open");
  setBodyLocked(false);
  if (window.syncNotifBarVisibility) window.syncNotifBarVisibility();

  if (config.restoreDisplayAfterMs) {
    setTimeout(function () {
      if (!layer.classList.contains("open")) {
        layer.style.display = config.restoreDisplayValue || "";
      }
    }, config.restoreDisplayAfterMs);
  }

  return layer;
}

function openProduct(id) {
  const product = PRODUCTS.find(function (item) {
    return item.id === id;
  });
  if (!product) return;

  resetModalZaloCopyState();

  const mName = getElement("mName");
  if (mName) {
    if (product.label) {
      mName.innerHTML = `${product.name} <span class="${getBadgeClass(product.label, "modal-title-badge")}">${product.label}</span>`;
    } else {
      mName.textContent = product.name;
    }
  }

  renderProductNotice(product);

  const ico = getElement("mHeadIco");
  if (ico) {
    ico.src = product.image;
    ico.alt = product.name;
    ico.style.display = "block";
  }

  openLayer("productModal");
}

function openDevModal() {
  const list = getElement("devDetailList");
  const arrow = getElement("devDetailArrow");
  if (list) list.style.display = "none";
  if (arrow) arrow.style.transform = "";
  resetDevZaloCopyState();
  openLayer("devModal");
}

function closeDevModal() {
  resetDevZaloCopyState();
  closeLayer("devModal");
}

function toggleDevDetail() {
  const list = getElement("devDetailList");
  const arrow = getElement("devDetailArrow");
  if (!list || !arrow) return;

  const isOpen = list.style.display !== "none";
  list.style.display = isOpen ? "none" : "block";
  arrow.style.transform = isOpen ? "" : "rotate(180deg)";
  arrow.style.transition = "transform 0.2s";
}

function resetModalZaloCopyState() {
  resetTimedButtonState(getElement("modalZaloCopyBtn"), "Copy số");
}

function copyModalZalo() {
  withCopiedText(
    getElement("modalZaloCopyBtn"),
    CONTACT_ZALO_NUMBER,
    function (button) {
      markButtonCopied(button, "Đã copy", "Copy số");
    },
    function () {
      showStatusToast("Không thể sao chép tự động. Vui lòng sao chép thủ công: " + CONTACT_ZALO_NUMBER, ZALO_ICON_URL);
    }
  );
}

function resetDevZaloCopyState() {
  resetTimedButtonState(getElement("devZaloCopyBtn"), "Copy số");
}

function copyDevZalo() {
  withCopiedText(
    getElement("devZaloCopyBtn"),
    CONTACT_ZALO_NUMBER,
    function (button) {
      markButtonCopied(button, "Đã copy", "Copy số");
    },
    function () {
      showStatusToast("Không thể sao chép tự động. Vui lòng sao chép thủ công: " + CONTACT_ZALO_NUMBER, ZALO_ICON_URL);
    }
  );
}

function closeModal() {
  resetModalZaloCopyState();
  closeLayer("productModal");
}

function setToastContent(message, img) {
  const toast = getElement("redirectToast");
  if (!toast) return null;

  const toastImg = toast.querySelector(".t-img");
  const toastTxt = toast.querySelector(".t-text");
  if (toastImg && img) toastImg.src = img;
  if (toastTxt && message) toastTxt.textContent = message;
  return toast;
}

function showRedirectToast(label, img) {
  const toast = setToastContent(label ? "Đang chuyển đến " + label : "", img);
  if (!toast) return;

  toast.classList.add("show");
  setTimeout(function () {
    toast.classList.remove("show");
  }, 2600);
}

function showStatusToast(message, img) {
  const toast = setToastContent(message, img);
  if (!toast) return;

  toast.classList.add("show");
  setTimeout(function () {
    toast.classList.remove("show");
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
  showStatusToast(message || ("Đã sao chép: " + text), "");
}

function resetCommunityCopyState(buttonId, label) {
  const button = getElement(buttonId);
  if (!button) return;

  if (button._resetTimer) {
    clearTimeout(button._resetTimer);
    button._resetTimer = null;
  }

  button.classList.remove("is-copied");
  const copyLabel = button.querySelector(".copy-label");
  if (copyLabel) copyLabel.textContent = label;
}

function handleCommunityCopy(buttonId, text, fallbackMessage) {
  const button = getElement(buttonId);
  if (!button) return;

  copyTextWithFallback(text)
    .then(function () {
      const copyLabel = button.querySelector(".copy-label");
      if (!copyLabel) return;

      if (button._resetTimer) clearTimeout(button._resetTimer);
      button.classList.add("is-copied");
      copyLabel.textContent = "Đã copy";
      button._resetTimer = setTimeout(function () {
        button.classList.remove("is-copied");
        copyLabel.textContent = "Copy link";
        button._resetTimer = null;
      }, COPY_RESET_DELAY);
    })
    .catch(function () {
      showCopyPrompt(text, fallbackMessage);
    });
}

function communityOpenPopup() {
  resetCommunityCopyState("communityFbCopyBtn", "Copy link");
  resetCommunityCopyState("communityZaloCopyBtn", "Copy link");
  openLayer("communityPopup");
}

function communityClosePopup() {
  closeLayer("communityPopup");
}

function communityFbCopy() {
  handleCommunityCopy("communityFbCopyBtn", COMMUNITY_FACEBOOK_URL, "Đã sao chép link Facebook");
}

function communityZaloCopy() {
  handleCommunityCopy("communityZaloCopyBtn", COMMUNITY_ZALO_URL, "Đã sao chép link Zalo");
}

function zaloOpenPopup() {
  openLayer("zaloPopup");
}

function zaloClosePopup() {
  closeLayer("zaloPopup");
}

function copyContactZalo() {
  const button = getElement("zaloCopyBtn");
  if (!button) return;

  copyTextWithFallback(CONTACT_ZALO_NUMBER)
    .then(function () {
      const copyLabel = button.querySelector(".copy-label");
      if (!copyLabel) return;

      if (button._resetTimer) clearTimeout(button._resetTimer);
      button.classList.add("is-copied");
      copyLabel.textContent = "Đã copy";
      button._resetTimer = setTimeout(function () {
        button.classList.remove("is-copied");
        copyLabel.textContent = "Copy số";
        button._resetTimer = null;
      }, COPY_RESET_DELAY);
    })
    .catch(function () {
      showCopyPrompt(CONTACT_ZALO_NUMBER, "Đã sao chép số Zalo: " + CONTACT_ZALO_NUMBER);
    });
}

function openFirstProduct(event) {
  event.preventDefault();
  const target = getElement("products");
  if (!target) return;

  const topbar = document.querySelector(".topbar");
  const topbarHeight = topbar ? topbar.offsetHeight : 68;
  const top = target.getBoundingClientRect().top + window.scrollY - topbarHeight;
  window.scrollTo({ top: top, behavior: "smooth" });
}

function initProducts() {
  renderProducts();
}

function initNotifBarVisibility() {
  const notifBar = document.querySelector(".notif-bar");
  const communityCard = document.querySelector("#community .community-card-link");
  const topbar = document.querySelector(".topbar");
  if (!notifBar || !communityCard || !topbar) return;

  function syncNotifBar() {
    const welcomeOverlay = getElement("welcomeNotif");
    if (welcomeOverlay && welcomeOverlay.classList.contains("open")) {
      notifBar.classList.remove("visible");
      return;
    }

    const topbarHeight = topbar.offsetHeight || 68;
    const triggerBottom = communityCard.getBoundingClientRect().bottom + window.scrollY;
    const viewportTop = window.scrollY + topbarHeight + 8;

    notifBar.classList.toggle("visible", viewportTop >= triggerBottom);
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
}

function welcomeOpen() {
  openLayer("welcomeNotif");
}

function welcomeClose() {
  closeLayer("welcomeNotif", { restoreDisplayAfterMs: 250, restoreDisplayValue: "" });
}

function welcomeCopyZalo() {
  const button = getElement("welcomeCopyBtn");
  if (!button) return;

  withCopiedText(
    button,
    CONTACT_ZALO_NUMBER,
    function (currentButton) {
      markButtonCopied(
        currentButton,
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Đã copy',
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy số'
      );
    },
    function () {
      showCopyPrompt(CONTACT_ZALO_NUMBER, "Đã sao chép số Zalo: " + CONTACT_ZALO_NUMBER);
    }
  );
}

function initPage() {
  window.scrollTo(0, 0);
  initProducts();
  initNotifBarVisibility();
}

function scheduleWelcomePopup() {
  function tryShowWelcome() {
    if (getElement("welcomeNotif")) {
      setTimeout(welcomeOpen, 350);
      return;
    }

    window.addEventListener("load", function () {
      setTimeout(welcomeOpen, 350);
    }, { once: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tryShowWelcome, { once: true });
  } else {
    tryShowWelcome();
  }
}

function normalizeRestoredUiState(isBackForward) {
  document.querySelectorAll(".modal.open, .link-popup.open").forEach(function (element) {
    element.classList.remove("open");
  });

  const welcomeNotif = getElement("welcomeNotif");
  if (welcomeNotif) {
    welcomeNotif.classList.remove("open", "show", "active");
    welcomeNotif.style.display = isBackForward ? "" : "none";
  }

  document.body.classList.remove("modal-open", "overlay-open", "no-scroll");
  setBodyLocked(false);

  const redirectToast = getElement("redirectToast");
  if (redirectToast) redirectToast.classList.remove("show");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPage, { once: true });
} else {
  initPage();
}

scheduleWelcomePopup();

window.addEventListener("pageshow", function (event) {
  let navigationEntry = null;
  if (window.performance && typeof window.performance.getEntriesByType === "function") {
    const entries = window.performance.getEntriesByType("navigation");
    if (entries && entries.length) navigationEntry = entries[0];
  }

  const isBackForward = Boolean(event.persisted || (navigationEntry && navigationEntry.type === "back_forward"));
  normalizeRestoredUiState(isBackForward);
  if (!isBackForward) return;

  const reloadKey = "__bingenz_bf_reloaded__";
  try {
    if (sessionStorage.getItem(reloadKey) === "1") {
      sessionStorage.removeItem(reloadKey);
      return;
    }
    sessionStorage.setItem(reloadKey, "1");
  } catch (error) {}

  location.replace(location.pathname + location.search);
});
