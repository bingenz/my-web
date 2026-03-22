// protect.js — v4 (anti-copy only, no overlay)
(() => {
  "use strict";

  const isEditableTarget = (target) => {
    if (!target || !(target instanceof Element)) return false;
    return !!target.closest("input, textarea, [contenteditable], [contenteditable='true'], [contenteditable='']");
  };

  // ============================================================
  // LAYER 1 — CHỐNG COPY / CHỌN TEXT
  // ============================================================

  const antiSelectStyle = document.createElement("style");
  antiSelectStyle.textContent = `
    *{
      -webkit-user-select:none!important;
      -moz-user-select:none!important;
      -ms-user-select:none!important;
      user-select:none!important;
    }
    input,textarea{
      -webkit-user-select:text!important;
      user-select:text!important;
    }
  `;
  (document.head || document.documentElement).appendChild(antiSelectStyle);

  document.addEventListener("selectstart", (e) => { if (!isEditableTarget(e.target)) e.preventDefault(); }, true);
  document.addEventListener("dragstart",   (e) => { if (!isEditableTarget(e.target)) e.preventDefault(); }, true);
  document.addEventListener("copy",        (e) => {
    if (isEditableTarget(e.target)) return;
    try { e.clipboardData?.setData("text/plain", ""); } catch {}
    e.preventDefault();
  }, true);
  document.addEventListener("cut",         (e) => { if (!isEditableTarget(e.target)) e.preventDefault(); }, true);
  document.addEventListener("paste",       (e) => { if (!isEditableTarget(e.target)) e.preventDefault(); }, true);
  document.addEventListener("mousedown",   (e) => { if(e.button===2) e.preventDefault(); }, true);

  const antiCopyKeys = (e) => {
    if (isEditableTarget(e.target)) return;
    const key  = (e.key || "").toLowerCase();
    const ctrl = e.ctrlKey || e.metaKey;
    if (ctrl && ["c","x","a","v"].includes(key)) {
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    }
  };
  window.addEventListener("keydown", antiCopyKeys, true);


  // ============================================================
  // LAYER 2 — CHẶN PHÍM TẮT DEVTOOLS / VIEW SOURCE
  // ============================================================

  document.addEventListener("contextmenu", (e) => e.preventDefault(), true);

  const ctrlOrCmd = (e) => e.ctrlKey || e.metaKey;

  const blockHotkeys = (e) => {
    if (isEditableTarget(e.target)) return;
    const key  = (e.key || "").toLowerCase();
    const code = (e.code || "");
    const ctrl  = ctrlOrCmd(e);
    const shift = !!e.shiftKey;
    const alt   = !!e.altKey;
    const stop  = () => { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); };

    if (key === "f12" || code === "F12")                           return stop();
    if (ctrl && !shift && !alt && key === "u")                     return stop();
    if (ctrl && shift  && !alt && ["i","j","c"].includes(key))     return stop();
    if (ctrl && shift  && !alt && ["k","e","m"].includes(key))     return stop();
    if (ctrl && shift  && !alt && key === "p")                     return stop();
    if (ctrl && !shift && !alt && ["s","p"].includes(key))         return stop();
  };

  window.addEventListener("keydown", blockHotkeys, true);
  window.addEventListener("keyup",   blockHotkeys, true);

})();
