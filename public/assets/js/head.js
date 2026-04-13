!function(){
  var u = new URL(location.href);
  ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(function(p){
    u.searchParams.delete(p);
  });
  if(u.href !== location.href) history.replaceState(null, '', u);

  var ua = navigator.userAgent || '';
  var isTikTok = /TikTok|musical_ly|BytedanceWebview/i.test(ua);
  var isInApp = /(FBAN|FBAV|Instagram|Line|Zalo|MiuiBrowser|wv\))/i.test(ua) || /; wv/i.test(ua);
  var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var isAndroid = /Android/i.test(ua);
  var isOldSafari = /OS [6-9]_|OS 1[0-3]_/i.test(ua) && /like Mac OS X/.test(ua);
  var isLowRam = navigator.deviceMemory && navigator.deviceMemory <= 2;
  var isSmallScreen = window.innerWidth <= 480;

  // TikTok browser: position:fixed bị broken — cần class riêng để xử lý JS fallback
  if (isTikTok) {
    document.documentElement.classList.add('tiktok-browser');
  }

  var lite = (isTikTok || isInApp) && coarse;
  if (!lite && coarse && (isLowRam || (isAndroid && isSmallScreen) || isOldSafari)) {
    lite = true;
  }
  if (lite) {
    document.documentElement.classList.add('perf-lite');
  }
}();
