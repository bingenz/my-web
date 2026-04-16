/* ═══════════════════════════════════════════
   BinGenZ — App Logic v5 FINAL
   DM Sans · Light Glass Pill · Compact Modal
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

/* ── Render Products ── */
function renderProducts(){
  const grid=document.getElementById('productGrid');
  if(!grid||!window.PRODUCTS)return;
  const order=window.DISPLAY_ORDER||window.PRODUCTS.map(p=>p.id);
  let html='<div class="pcard-list">';
  order.forEach(id=>{
    const p=window.PRODUCTS.find(x=>x.id===id);
    if(!p)return;
    html+=`<article class="pcard" onclick="openProduct('${p.id}')">`;
    if(p.label)html+=`<div class="pcard-badge"><span class="badge red">${p.label}</span></div>`;
    html+=`<div class="pcard-top"><img class="pcard-ico" src="${p.image}" alt="${p.name}" width="52" height="52" loading="lazy" decoding="async"><div class="pcard-name">${p.name}</div></div>`;
    html+=`<div class="pcard-bottom"><div class="pcard-price-block"><div class="pcard-price-val">${p.rawPrice}<span class="pcard-price-mo">${p.period||''}</span></div><div class="pcard-price-old">Giá gốc: <s>${p.oldPrice}</s></div></div><button class="pcard-cta" type="button">Mua ngay</button></div>`;
    html+=`</article>`;
  });
  html+='</div>';
  grid.innerHTML=html;
}

/* ── Open Product Modal (compact, simplified) ── */
function openProduct(id){
  const p=window.PRODUCTS.find(x=>x.id===id);
  if(!p)return;
  const modal=document.getElementById('productModal');

  // Header
  document.getElementById('mHeadIco').src=p.image;
  document.getElementById('mHeadIco').alt=p.name;
  document.getElementById('mName').textContent=p.name;

  // Badge
  const badge=document.getElementById('mBadge');
  if(p.label){badge.textContent=p.label;badge.style.display='inline-flex'}
  else{badge.style.display='none'}

  // Price
  document.getElementById('qrPrice').textContent=p.rawPrice;

  // Short name for content
  const sn=p.shortName||p.name.toLowerCase().replace(/\s+/g,'');

  if(p.isChinhChu){
    // NÂNG CHÍNH CHỦ: shortname + tên gmail
    document.getElementById('qrContent').innerHTML=`<strong>${sn}</strong> + tên Gmail`;
    document.getElementById('qrExampleBox').innerHTML=`<span class="qr-example-label">Ví dụ:</span> <strong>${sn} lethuan123</strong>`;
    document.getElementById('qrSuccessText').textContent='Sau khi chuyển khoản đợi 1p shop sẽ gửi gói đăng ký đến Gmail, bạn vào bấm xác nhận là xong.';
  } else {
    // Không chính chủ: shortname + sdt
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

/* ── Open first product ── */
function openFirstProduct(e){
  if(e)e.preventDefault();
  const order=window.DISPLAY_ORDER||[];
  if(order.length)openProduct(order[0]);
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

/* ── Trust Proof ── */
const TRUST_PROOF_IMAGES=[
  {src:'assets/images/proof/1.jpg',label:'Bill #1'},
  {src:'assets/images/proof/2.jpg',label:'Bill #2'},
  {src:'assets/images/proof/3.jpg',label:'Bill #3'},
  {src:'assets/images/proof/4.jpg',label:'Bill #4'},
  {src:'assets/images/proof/5.jpg',label:'Bill #5'},
  {src:'assets/images/proof/6.jpg',label:'Bill #6'},
];
function openTrustProofModal(e){
  if(e)e.preventDefault();
  const grid=document.getElementById('trustProofGrid');
  let html='';
  TRUST_PROOF_IMAGES.forEach((img)=>{
    html+=`<button class="trust-proof-thumb" onclick="openTrustProofViewer('${img.src}')"><img src="${img.src}" alt="${img.label}" loading="lazy" decoding="async"><span class="trust-proof-thumb-label">${img.label}</span></button>`;
  });
  grid.innerHTML=html;
  document.getElementById('trustProofModal').style.display='flex';
  document.body.classList.add('scroll-locked');
}
function closeTrustProofModal(){
  document.getElementById('trustProofModal').style.display='none';
  document.body.classList.remove('scroll-locked');
}
function openTrustProofViewer(src){
  document.getElementById('trustProofViewerImage').src=src;
  document.getElementById('trustProofViewer').style.display='flex';
}
function closeTrustProofViewer(){
  document.getElementById('trustProofViewer').style.display='none';
}

/* ── Notification Popup (bell, left side) ── */
let notifOpen=false;
function toggleNotifPopup(){
  if(notifOpen){closeNotifPopup()}else{openNotifPopup()}
}
function openNotifPopup(){
  const popup=document.getElementById('notifPopup');
  const bell=document.getElementById('notifBell');
  popup.style.display='flex';
  bell.classList.add('active');
  notifOpen=true;
  // Force reflow then animate
  popup.offsetHeight;
  popup.classList.add('open');
}
function closeNotifPopup(){
  const popup=document.getElementById('notifPopup');
  const bell=document.getElementById('notifBell');
  popup.classList.remove('open');
  bell.classList.remove('active');
  notifOpen=false;
  setTimeout(()=>{popup.style.display='none'},280);
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

/* ── Init ── */
document.addEventListener('DOMContentLoaded',function(){
  initTheme();
  renderProducts();

  // Auto-show notification popup on first visit (from bell)
  if(!sessionStorage.getItem('notifSeen')){
    setTimeout(()=>{
      openNotifPopup();
      sessionStorage.setItem('notifSeen','1');
    },1200);
  }

  // Close popups on click outside bell area
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
      closeModal();closeDevModal();closeTrustProofModal();closeTrustProofViewer();
      zaloClosePopup();communityClosePopup();closeNotifPopup();closeMobileMenu();
    }
  });
});
