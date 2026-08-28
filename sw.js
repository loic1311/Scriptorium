const CACHE="scriptorium-v6.2.1-shell-1";
const SHELL=["./","./index.html","./v6.css","./v6.js","./v6_2_1.js","./sources.js","./manifest.webmanifest","./icons/icon-192-v621.png","./icons/icon-512-v621.png","./icons/apple-touch-icon-v621.png","./icons/favicon-32-v621.png","./scriptorium-logo.png","./scriptorium-logo-64.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("scriptorium-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const u=new URL(e.request.url);
  if(u.origin!==self.location.origin){
    e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(resp=>{if(resp.ok){const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});}return resp;})));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(resp=>{const copy=resp.clone();if(resp.ok)caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});return resp;}).catch(()=>caches.match("./index.html"))));
});
