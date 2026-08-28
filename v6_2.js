
(function(){
  let deferredPrompt = null;
  function isStandalone(){
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }
  function isIOS(){
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }
  function updateInstallUI(){
    const btn = document.getElementById('installAppBtn');
    const chip = document.getElementById('installStatusChip');
    if(!btn || !chip) return;
    if(isStandalone()){
      btn.hidden = true;
      chip.textContent = 'Appmodus';
      document.body.classList.add('app-standalone');
      return;
    }
    document.body.classList.remove('app-standalone');
    if(deferredPrompt){
      btn.hidden = false;
      chip.textContent = 'Installeerbaar';
    }else if(isIOS()){
      btn.hidden = false;
      chip.textContent = 'iPhone/iPad: deel → beginscherm';
    }else {
      btn.hidden = false;
      chip.textContent = 'Webmodus';
    }
  }
  async function installApp(){
    if(deferredPrompt){
      deferredPrompt.prompt();
      try{ await deferredPrompt.userChoice; }catch(e){}
      deferredPrompt = null;
      updateInstallUI();
      return;
    }
    if(isIOS()){
      alert('Op iPhone/iPad: open deze pagina in Safari, tik op Deel en kies "Zet op beginscherm".');
      return;
    }
    alert('Gebruik in Chrome of Edge het menu met de drie puntjes en kies "Installeer app" of "Pagina installeren als app".');
  }
  function patchVersionText(){
    document.querySelectorAll('.version-pill').forEach(el=>el.textContent='V6.2');
    const small = document.querySelector('.brand small'); if(small) small.textContent='Onderzoekscoach V6.2 · authentieke bronnen · training · sync';
    const title = document.title; if(title.includes('v6')) document.title = 'Scriptorium V6.2 - Academische Onderzoekscoach';
  }
  function bindInstallBtn(){
    const btn = document.getElementById('installAppBtn');
    if(btn && !btn.dataset.v62bound){
      btn.dataset.v62bound = '1';
      btn.addEventListener('click', installApp);
    }
  }
  window.addEventListener('beforeinstallprompt', (e)=>{
    e.preventDefault();
    deferredPrompt = e;
    updateInstallUI();
  });
  window.addEventListener('appinstalled', ()=>{
    deferredPrompt = null;
    updateInstallUI();
  });
  const prevInit = window.init;
  window.init = async function(){
    if(prevInit) await prevInit();
    patchVersionText();
    bindInstallBtn();
    updateInstallUI();
  };
  window.addEventListener('DOMContentLoaded', ()=>{patchVersionText(); bindInstallBtn(); updateInstallUI();});
  window.addEventListener('focus', updateInstallUI);
})();
