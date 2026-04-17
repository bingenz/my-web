!function(){
  var u = new URL(location.href);
  ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(function(p){
    u.searchParams.delete(p);
  });
  if(u.href !== location.href) history.replaceState(null, '', u);
}();
