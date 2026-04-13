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
  var lite = (isTikTok || isInApp) && coarse;

  if (lite) {
    document.documentElement.classList.add('perf-lite');
  }
}();
