(function(){
  function isStandalone(){
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }
  function deviceLabel(){
    const mobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);
    return mobile ? 'mobiel' : 'desktop';
  }
  function updateModeChip(){
    const chip = document.getElementById('installStatusChip');
    if(!chip) return;
    const standalone = isStandalone();
    chip.textContent = `${standalone ? 'Appmodus' : 'Webmodus'} · ${deviceLabel()}`;
    chip.classList.toggle('app-mode', standalone);
    chip.classList.toggle('web-mode', !standalone);
    document.body.classList.toggle('app-standalone', standalone);
  }
  function patchVersionText(){
    document.querySelectorAll('.version-pill').forEach(el=>el.textContent='V6.2');
    const small = document.querySelector('.brand small');
    if(small) small.textContent='Onderzoekscoach V6.2 · authentieke bronnen · training · sync';
    document.title = 'Scriptorium V6.2 - Academische Onderzoekscoach';
  }
  const prevInit = window.init;
  window.init = async function(){
    if(prevInit) await prevInit();
    patchVersionText();
    updateModeChip();
  };
  window.addEventListener('DOMContentLoaded', ()=>{patchVersionText();updateModeChip();});
  window.addEventListener('focus', updateModeChip);
  window.matchMedia('(display-mode: standalone)').addEventListener?.('change', updateModeChip);
})();
