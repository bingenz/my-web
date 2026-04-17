/* ═══════════════════════════════════════════
   BinGenZ — App Logic v7
   Scroll Reveal · Speaker toggle · SVG icons
   ═══════════════════════════════════════════ */

/* ── Theme ── */
function initTheme(){
  const saved=localStorage.getItem('theme');
  const theme=saved||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
  applyTheme(theme);
}
function applyTheme(t){
  document.documentElement.setAttribute('data-theme',t);
  localStorage.setItem('theme',t);
  const mc=document.getElementById('metaThemeColor');
  if(mc)mc.content=t==='dark'?'#09090c':'#f8fafc';
  const ml=document.getElementById('mobileThemeLabel');
  if(ml)ml.textContent=t==='dark'?'☀️ Chế độ sáng':'🌙 Chế độ tối';
  document.querySelectorAll('.theme-icon-moon').forEach(el=>{el.style.display=t==='light'?'block':'none'});
  document.querySelectorAll('.theme-icon-sun').forEach(el=>{el.style.display=t==='dark'?'block':'none'});
}
function toggleTheme(){
  const cur=document.documentElement.getAttribute('data-theme')||'light';
  applyTheme(cur==='dark'?'light':'dark');
}

/* ── Mobile Menu ── */
function toggleMobileMenu(){
  const menu=document.getElementById('mobileMenu');
  const btn=document.querySelector('.burger-btn');
  const isOpen=menu.classList.toggle('open');
  btn.classList.toggle('active',isOpen);
  document.body.classList.toggle('scroll-locked',isOpen);
}
function closeMobileMenu(){
  const menu=document.getElementById('mobileMenu');
  const btn=document.querySelector('.burger-btn');
  menu.classList.remove('open');
  if(btn)btn.classList.remove('active');
  document.body.classList.remove('scroll-locked');
}

/* ── Render Products (SVG icons) ── */
function renderProducts(){
  const grid=document.getElementById('productGrid');
  if(!grid||!window.PRODUCTS)return;
  const order=window.DISPLAY_ORDER||window.PRODUCTS.map(p=>p.id);
  const svgs=window.PRODUCT_SVGS||{};
  let html='<div class="pcard-list">';
  order.forEach((id,i)=>{
    const p=window.PRODUCTS.find(x=>x.id===id);
    if(!p)return;
    const svgHtml=svgs[id]||'';
    // Each card gets reveal-child with stagger delay
    const delay=i*0.1;
    html+=`<article class="pcard reveal-child" style="transition-delay:${delay}s" onclick="openProduct('${p.id}')">`;
    if(p.label)html+=`<div class="pcard-badge"><span class="badge red">${p.label}</span></div>`;
    html+=`<div class="pcard-top"><div class="pcard-ico-svg">${svgHtml}</div><div class="pcard-name">${p.name}</div></div>`;
    html+=`<div class="pcard-bottom"><div class="pcard-price-block"><div class="pcard-price-val">${p.rawPrice}<span class="pcard-price-mo">${p.period||''}</span></div><div class="pcard-price-old">Giá gốc: <s>${p.oldPrice}</s></div></div><button class="pcard-cta" type="button">Mua ngay</button></div>`;
    html+=`</article>`;
  });
  html+='</div>';
  grid.innerHTML=html;
}

/* ── Open Product Modal (compact, SVG icon) ── */
function openProduct(id){
  const p=window.PRODUCTS.find(x=>x.id===id);
  if(!p)return;
  const modal=document.getElementById('productModal');
  const svgs=window.PRODUCT_SVGS||{};

  const svgWrap=document.getElementById('mHeadSvg');
  if(svgWrap)svgWrap.innerHTML=svgs[id]||'';
  document.getElementById('mName').textContent=p.name;

  const badge=document.getElementById('mBadge');
  if(p.label){badge.textContent=p.label;badge.style.display='inline-flex'}
  else{badge.style.display='none'}

  document.getElementById('qrPrice').textContent=p.rawPrice;

  const sn=p.shortName||p.name.toLowerCase().replace(/\s+/g,'');

  if(p.isChinhChu){
    document.getElementById('qrContent').innerHTML=`<strong>${sn}</strong> + tên Gmail`;
    document.getElementById('qrExampleBox').innerHTML=`<span class="qr-example-label">Ví dụ:</span> <strong>${sn} lethuan123</strong>`;
    document.getElementById('qrSuccessText').textContent='Sau khi chuyển khoản đợi 1p shop sẽ gửi gói đăng ký đến Gmail, bạn vào bấm xác nhận là xong.';
  } else {
    document.getElementById('qrContent').innerHTML=`<strong>${sn}</strong> + số điện thoại`;
    document.getElementById('qrExampleBox').innerHTML=`<span class="qr-example-label">Ví dụ:</span> <strong>${sn} 0912345678</strong>`;
    document.getElementById('qrSuccessText').textContent='Shop gửi tk+mk ngay sau khi nhận thanh toán.';
  }

  modal.style.display='flex';
  document.body.classList.add('scroll-locked');
}

function closeModal(){
  document.getElementById('productModal').style.display='none';
  document.body.classList.remove('scroll-locked');
}

/* ── Dev Modal ── */
function openDevModal(){
  document.getElementById('devModal').style.display='flex';
  document.body.classList.add('scroll-locked');
}
function closeDevModal(){
  document.getElementById('devModal').style.display='none';
  document.body.classList.remove('scroll-locked');
}

/* ── Zalo Popup ── */
function zaloOpenPopup(){
  document.getElementById('zaloPopup').style.display='flex';
  document.body.classList.add('scroll-locked');
}
function zaloClosePopup(){
  document.getElementById('zaloPopup').style.display='none';
  document.body.classList.remove('scroll-locked');
}

/* ── Community Popup ── */
function communityOpenPopup(){
  document.getElementById('communityPopup').style.display='flex';
  document.body.classList.add('scroll-locked');
}
function communityClosePopup(){
  document.getElementById('communityPopup').style.display='none';
  document.body.classList.remove('scroll-locked');
}

/* ═══════════════════════════════════════════
   NOTIFICATION POPUP (speaker icon)
   Behavior: popup shows on first visit →
   user closes → speaker icon appears →
   click speaker → popup toggles
   ═══════════════════════════════════════════ */
let notifOpen=false;
let notifClosed=false; // tracks if user ever closed the popup

function toggleNotifPopup(){
  if(notifOpen){closeNotifPopup()}else{openNotifPopup()}
}

function openNotifPopup(){
  const popup=document.getElementById('notifPopup');
  const bell=document.getElementById('notifBell');
  popup.style.display='flex';
  bell.classList.remove('visible'); // hide speaker while popup is open
  notifOpen=true;
  popup.offsetHeight;
  popup.classList.add('open');
}

function closeNotifPopup(){
  const popup=document.getElementById('notifPopup');
  const bell=document.getElementById('notifBell');
  popup.classList.remove('open');
  notifOpen=false;
  notifClosed=true;
  setTimeout(()=>{
    popup.style.display='none';
    // Show speaker icon after popup closes
    bell.classList.add('visible');
  },280);
}

/* ── Copy helpers ── */
function copyToClipboard(text,btnId,successText){
  navigator.clipboard.writeText(text).then(()=>{
    if(btnId){
      const btn=document.getElementById(btnId);
      if(!btn)return;
      const orig=btn.innerHTML;
      btn.innerHTML=successText||'✓ Copied';
      setTimeout(()=>{btn.innerHTML=orig},1500);
    }
  });
}
function copyContactZalo(){copyToClipboard('0898908101','zaloCopyBtn','✓ Copied')}
function copyDevZalo(){copyToClipboard('0898908101','devZaloCopyBtn','✓ Copied')}
function copyNotifZalo(){
  const btn=document.querySelector('.notif-popup-copy');
  navigator.clipboard.writeText('0898908101').then(()=>{
    const orig=btn.textContent;
    btn.textContent='✓ Copied';
    setTimeout(()=>{btn.textContent=orig},1500);
  });
}
function communityFbCopy(){copyToClipboard('https://www.facebook.com/groups/1083123091540550/','communityFbCopyBtn','✓ Copied')}

/* ═══════════════════════════════════════════
   SCROLL REVEAL (IntersectionObserver)
   ═══════════════════════════════════════════ */
function initScrollReveal(){
  const els=document.querySelectorAll('.reveal, .reveal-child');
  if(!els.length)return;

  const observer=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // only reveal once
      }
    });
  },{
    threshold:0.12,
    rootMargin:'0px 0px -40px 0px'
  });

  els.forEach(el=>observer.observe(el));
}

function addRevealClasses(){
  // Add .reveal to all major sections (hero card, section-center, service/community cards, footer)
  const selectors=[
    '.hero-card',
    '.social-strip-center',
    '#products .section-center',
    '#source-code .section-center',
    '#community .section-center',
    '.section-cta .section-center',
    '.footer-grid'
  ];
  selectors.forEach(sel=>{
    const el=document.querySelector(sel);
    if(el&&!el.classList.contains('reveal')){
      el.classList.add('reveal');
    }
  });

  // Add .reveal-child to individual cards (pcards get it from render)
  document.querySelectorAll('.service-card, .community-card').forEach((el,i)=>{
    if(!el.classList.contains('reveal-child')){
      el.classList.add('reveal-child');
      el.style.transitionDelay=(i*0.1)+'s';
    }
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded',function(){
  initTheme();
  renderProducts();
  addRevealClasses();
  initScrollReveal();

  // Auto-show notification popup on first visit (no speaker icon yet)
  if(!sessionStorage.getItem('notifSeen')){
    setTimeout(()=>{
      openNotifPopup();
      sessionStorage.setItem('notifSeen','1');
    },800);
  } else {
    // If already seen before, show speaker icon directly
    document.getElementById('notifBell').classList.add('visible');
  }

  // Close popups on click outside
  document.addEventListener('click',(e)=>{
    if(notifOpen){
      const popup=document.getElementById('notifPopup');
      const bell=document.getElementById('notifBell');
      if(!popup.contains(e.target)&&!bell.contains(e.target)){
        closeNotifPopup();
      }
    }
  });

  // Close modals on Escape
  document.addEventListener('keydown',(e)=>{
    if(e.key==='Escape'){
      closeModal();closeDevModal();
      zaloClosePopup();communityClosePopup();closeNotifPopup();closeMobileMenu();
    }
  });
});
