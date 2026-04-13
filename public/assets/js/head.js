!function(){
  var u = new URL(location.href);
  ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(function(p){
    u.searchParams.delete(p);
  });
  if(u.href !== location.href) history.replaceState(null, '', u);

  var ua = navigator.userAgent || '';
  var isTikTok = /TikTok|musical_ly|BytedanceWebview/i.test(ua);
  // FB in-app: FBAN/FBAV = Facebook app webview, cần detect riêng
  var isFBInApp = /(FBAN|FBAV)/i.test(ua);
  var isInApp = isFBInApp || /(Instagram|Line|Zalo|MiuiBrowser|wv\))/i.test(ua) || /; wv/i.test(ua);
  var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var isAndroid = /Android/i.test(ua);
  var isOldSafari = /OS [6-9]_|OS 1[0-3]_/i.test(ua) && /like Mac OS X/.test(ua);
  var isLowRam = navigator.deviceMemory && navigator.deviceMemory <= 2;
  var isSmallScreen = window.innerWidth <= 480;

  // TikTok browser: position:fixed bị broken — cần class riêng để xử lý JS fallback
  if (isTikTok) {
    document.documentElement.classList.add('tiktok-browser');
  }

  // FB in-app browser: backdrop-filter hoạt động nhưng chậm khi dùng nhiều lớp
  // → chỉ tắt blur ở persistent elements (topbar, notif), GIỮ blur cho modal/popup
  if (isFBInApp) {
    document.documentElement.classList.add('fb-inapp');
  }

  // perf-lite: tắt các hiệu ứng nặng trên in-app browser / thiết bị yếu
  // KHÔNG bao gồm FB vì FB vẫn render backdrop-filter tốt cho overlay
  var lite = isTikTok && coarse;
  if (!lite && coarse && (isLowRam || (isAndroid && isSmallScreen) || isOldSafari)) {
    lite = true;
  }
  // Các in-app browser khác (không phải FB, không phải TikTok): vẫn perf-lite
  if (!lite && isInApp && !isFBInApp && coarse) {
    lite = true;
  }
  if (lite) {
    document.documentElement.classList.add('perf-lite');
  }
}();
