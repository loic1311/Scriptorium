
(function(){
  function standalone(){
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }
  function mobile(){ return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent); }
  function updateModeChip(){
    const chip = document.getElementById('installStatusChip');
    if(!chip) return;
    const app = standalone();
    chip.textContent = (app ? 'Appmodus' : 'Webmodus') + ' · ' + (mobile() ? 'mobiel' : 'desktop');
    chip.classList.remove('web-mode','app-mode');
    chip.classList.add(app ? 'app-mode' : 'web-mode');
    document.body.classList.toggle('app-standalone', app);
  }
  function patchBranding(){
    document.title = 'Scriptorium V6.2.1 - Academische Onderzoekscoach';
    document.querySelectorAll('.version-pill').forEach(el=>el.textContent='V6.2.1');
    const bsmall = document.querySelector('.brand small');
    if(bsmall) bsmall.textContent = 'Onderzoekscoach V6.2.1 · authentieke bronnen · training · sync';
    const sub = document.querySelector('.topbar-sub');
    if(sub) sub.textContent = 'Scriptorium V6.2.1 · op laptop en telefoon';
  }
  function bindFallbackNav(){
    if(document.body.dataset.v621bound) return;
    document.body.dataset.v621bound = '1';
    document.addEventListener('click', function(e){
      const close = e.target.closest('[data-close]');
      if(close && window.closeModal){ e.preventDefault(); e.stopPropagation(); window.closeModal(close.dataset.close); return; }
      const go = e.target.closest('[data-go]');
      if(go && window.showPage){ e.preventDefault(); e.stopPropagation(); window.showPage(go.dataset.go); return; }
      const pageBtn = e.target.closest('#nav button[data-page]');
      if(pageBtn && window.showPage){ e.preventDefault(); e.stopPropagation(); window.showPage(pageBtn.dataset.page); return; }
    }, true);
    // Redundant direct binding for stubborn mobile/PWA cases.
    document.querySelectorAll('#nav button[data-page]').forEach(btn=>{
      btn.addEventListener('touchend', ev=>{ ev.preventDefault(); window.showPage?.(btn.dataset.page); }, {passive:false});
      btn.addEventListener('click', ev=>{ ev.preventDefault(); window.showPage?.(btn.dataset.page); });
    });
    document.querySelectorAll('[data-go]').forEach(btn=>{
      btn.addEventListener('touchend', ev=>{ ev.preventDefault(); window.showPage?.(btn.dataset.go); }, {passive:false});
    });
  }
  const prevInit = window.init;
  window.init = async function(){
    if(prevInit) await prevInit();
    patchBranding();
    bindFallbackNav();
    updateModeChip();
  };
  window.addEventListener('DOMContentLoaded', ()=>{ patchBranding(); bindFallbackNav(); updateModeChip(); });
  window.addEventListener('pageshow', updateModeChip);
  window.addEventListener('focus', updateModeChip);
})();
