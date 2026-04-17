function initTheme(){
  const saved=localStorage.getItem('theme');
  const theme=saved||'light';
  applyTheme(theme);
}

function applyTheme(theme){
  document.documentElement.setAttribute('data-theme',theme);
  localStorage.setItem('theme',theme);

  const themeMeta=document.getElementById('metaThemeColor');
  if(themeMeta)themeMeta.content=theme==='dark'?'#09090c':'#f8fafc';

  document.querySelectorAll('.theme-icon-moon').forEach((icon)=>{
    icon.style.display=theme==='light'?'block':'none';
  });
  document.querySelectorAll('.theme-icon-sun').forEach((icon)=>{
    icon.style.display=theme==='dark'?'block':'none';
  });
}

function toggleTheme(){
  const current=document.documentElement.getAttribute('data-theme')||'light';
  applyTheme(current==='dark'?'light':'dark');
}

function renderProducts(){
  const grid=document.getElementById('productGrid');
  if(!grid||!window.PRODUCTS)return;

  const order=window.DISPLAY_ORDER||window.PRODUCTS.map((product)=>product.id);
  const svgs=window.PRODUCT_SVGS||{};
  let html='<div class="pcard-list">';

  order.forEach((id,index)=>{
    const product=window.PRODUCTS.find((item)=>item.id===id);
    if(!product)return;

    const delay=index*0.1;
    html+=`<article class="pcard reveal-child" style="transition-delay:${delay}s" onclick="openProduct('${product.id}')">`;
    if(product.label){
      html+=`<div class="pcard-badge"><span class="badge red">${product.label}</span></div>`;
    }
    html+=`<div class="pcard-top"><div class="pcard-ico-svg">${svgs[id]||''}</div><div class="pcard-name">${product.name}</div></div>`;
    html+=`<div class="pcard-bottom"><div class="pcard-price-block"><div class="pcard-price-val">${product.rawPrice}<span class="pcard-price-mo">${product.period||''}</span></div>${product.oldPrice?`<div class="pcard-price-old">Giá gốc: <s>${product.oldPrice}</s></div>`:''}</div><button class="pcard-cta" type="button">Mua ngay</button></div>`;
    html+='</article>';
  });

  html+='</div>';
  grid.innerHTML=html;
}

function openProduct(id){
  const product=window.PRODUCTS.find((item)=>item.id===id);
  if(!product)return;

  const modal=document.getElementById('productModal');
  const svgs=window.PRODUCT_SVGS||{};
  const svgWrap=document.getElementById('mHeadSvg');
  const badge=document.getElementById('mBadge');
  const shortName=product.shortName||product.name.toLowerCase().replace(/\s+/g,'');

  if(svgWrap)svgWrap.innerHTML=svgs[id]||'';
  document.getElementById('mName').textContent=product.name;
  document.getElementById('qrPrice').textContent=product.rawPrice;

  if(product.label){
    badge.textContent=product.label;
    badge.style.display='inline-flex';
  }else{
    badge.style.display='none';
  }

  const modalNote=document.getElementById('qrProductNote');
  if(modalNote){
    if(product.modalNote){
      modalNote.textContent=product.modalNote;
      modalNote.style.display='block';
    }else{
      modalNote.textContent='';
      modalNote.style.display='none';
    }
  }

  if(product.isChinhChu){
    document.getElementById('qrContent').innerHTML=`<strong>${shortName}</strong> + tên Gmail`;
    document.getElementById('qrExampleBox').innerHTML=`<span class="qr-example-label">Ví dụ:</span> <strong>${shortName} lethuan123</strong>`;
    document.getElementById('qrSuccessText').textContent='Sau khi chuyển khoản đợi 1p shop sẽ gửi gói đăng ký đến Gmail, bạn vào bấm xác nhận là xong.';
  }else{
    document.getElementById('qrContent').innerHTML=`<strong>${shortName}</strong> + số điện thoại`;
    document.getElementById('qrExampleBox').innerHTML=`<span class="qr-example-label">Ví dụ:</span> <strong>${shortName} 0912345678</strong>`;
    document.getElementById('qrSuccessText').textContent='Shop gửi tk+mk ngay sau khi nhận thanh toán.';
  }

  modal.style.display='flex';
  document.body.classList.add('scroll-locked');
}

function closeModal(){
  const modal=document.getElementById('productModal');
  if(!modal)return;
  modal.style.display='none';
  document.body.classList.remove('scroll-locked');
}

function openDevModal(){
  const modal=document.getElementById('devModal');
  if(!modal)return;
  modal.style.display='flex';
  document.body.classList.add('scroll-locked');
}

function closeDevModal(){
  const modal=document.getElementById('devModal');
  if(!modal)return;
  modal.style.display='none';
  document.body.classList.remove('scroll-locked');
}

function zaloOpenPopup(){
  const popup=document.getElementById('zaloPopup');
  if(!popup)return;
  popup.style.display='flex';
  document.body.classList.add('scroll-locked');
}

function zaloClosePopup(){
  const popup=document.getElementById('zaloPopup');
  if(!popup)return;
  popup.style.display='none';
  document.body.classList.remove('scroll-locked');
}

function communityOpenPopup(){
  const popup=document.getElementById('communityPopup');
  if(!popup)return;
  popup.style.display='flex';
  document.body.classList.add('scroll-locked');
}

function communityClosePopup(){
  const popup=document.getElementById('communityPopup');
  if(!popup)return;
  popup.style.display='none';
  document.body.classList.remove('scroll-locked');
}

let notifOpen=false;
let notifHideTimer=null;

function toggleNotifPopup(){
  if(notifOpen){
    closeNotifPopup();
  }else{
    openNotifPopup();
  }
}

function openNotifPopup(){
  const popup=document.getElementById('notifPopup');
  const bell=document.getElementById('notifBell');
  if(!popup||!bell)return;

  if(notifHideTimer){
    clearTimeout(notifHideTimer);
    notifHideTimer=null;
  }

  popup.style.display='flex';
  bell.classList.remove('visible');
  notifOpen=true;
  popup.offsetHeight;
  popup.classList.add('open');
}

function closeNotifPopup(){
  const popup=document.getElementById('notifPopup');
  const bell=document.getElementById('notifBell');
  if(!popup||!bell)return;
  if(!notifOpen&&popup.style.display!=='flex')return;

  popup.classList.remove('open');
  notifOpen=false;
  notifHideTimer=setTimeout(()=>{
    popup.style.display='none';
    bell.classList.add('visible');
    notifHideTimer=null;
  },280);
}

function setTemporaryLabel(button,getCurrent,setCurrent,nextText){
  if(!button)return;
  const original=getCurrent();
  setCurrent(nextText);
  setTimeout(()=>{setCurrent(original);},1500);
}

function copyToClipboard(text,buttonId,successText){
  const button=buttonId?document.getElementById(buttonId):null;
  navigator.clipboard.writeText(text)
    .then(()=>{
      if(button){
        setTemporaryLabel(button,()=>button.innerHTML,(value)=>{button.innerHTML=value;},successText||'✓ Copied');
      }
    })
    .catch(()=>{
      if(button){
        setTemporaryLabel(button,()=>button.innerHTML,(value)=>{button.innerHTML=value;},'Copy lại');
      }
    });
}

function copyContactZalo(){copyToClipboard('0898908101','zaloCopyBtn','✓ Copied');}
function copyDevZalo(){copyToClipboard('0898908101','devZaloCopyBtn','✓ Copied');}
function copyQrZalo(){copyToClipboard('0898908101','qrZaloCopyBtn','✓ Copied');}

function copyNotifZalo(){
  const button=document.querySelector('.notif-popup-copy');
  if(!button)return;

  navigator.clipboard.writeText('0898908101')
    .then(()=>{
      setTemporaryLabel(button,()=>button.textContent,(value)=>{button.textContent=value;},'✓ Copied');
    })
    .catch(()=>{
      setTemporaryLabel(button,()=>button.textContent,(value)=>{button.textContent=value;},'Copy lại');
    });
}

function communityFbCopy(){
  copyToClipboard('https://www.facebook.com/groups/1083123091540550/','communityFbCopyBtn','✓ Copied');
}

function initScrollReveal(){
  const elements=document.querySelectorAll('.reveal, .reveal-child');
  if(!elements.length)return;

  const observer=new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },{
    threshold:0.12,
    rootMargin:'0px 0px -40px 0px'
  });

  elements.forEach((element)=>observer.observe(element));
}

function addRevealClasses(){
  const selectors=[
    '.hero-card',
    '.social-strip-center',
    '#source-code .section-center',
    '#community .section-center',
    '.section-cta .section-center',
    '.footer-grid'
  ];

  selectors.forEach((selector)=>{
    const element=document.querySelector(selector);
    if(element&&!element.classList.contains('reveal')){
      element.classList.add('reveal');
    }
  });

  document.querySelectorAll('.service-card, .community-card').forEach((element,index)=>{
    if(!element.classList.contains('reveal-child')){
      element.classList.add('reveal-child');
      element.style.transitionDelay=`${index*0.1}s`;
    }
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  initTheme();
  renderProducts();
  addRevealClasses();
  initScrollReveal();

  setTimeout(()=>{openNotifPopup();},180);

  document.addEventListener('click',(event)=>{
    if(notifOpen){
      const popup=document.getElementById('notifPopup');
      const bell=document.getElementById('notifBell');
      if(popup&&bell&&!popup.contains(event.target)&&!bell.contains(event.target)){
        closeNotifPopup();
      }
    }
  });

  document.addEventListener('keydown',(event)=>{
    if(event.key==='Escape'){
      closeModal();
      closeDevModal();
      zaloClosePopup();
      communityClosePopup();
      if(notifOpen)closeNotifPopup();
    }
  });
});
