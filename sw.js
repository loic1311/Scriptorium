const CACHE='scriptorium-v6.5-shell-1';
const LOCAL_SHELL=[
  './','./index.html','./desktop.html','./mobile.html','./v6.css','./v6.js','./v6_3.js','./v6_4.js','./v6_5.js','./sources.js',
  './manifest.webmanifest','./version.json','./corpus_seed.json',
  './Scriptorium_AI_Instructiegids_Vrienden.pdf',
  './scriptorium-logo.png','./scriptorium-logo-64.png',
  './icons/icon-192.png','./icons/icon-512.png',
  './icons/apple-touch-icon.png','./icons/favicon-32.png'
];
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    for(const url of LOCAL_SHELL){
      try{await cache.add(url);}catch(err){console.warn('Precache failed',url,err);}
    }
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('scriptorium-')&&k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING') self.skipWaiting();
  if(event.data?.type==='CLEAR_CACHES') event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('scriptorium-')).map(k=>caches.delete(k)))));
});
async function networkFirst(request,fallback){
  const cache=await caches.open(CACHE);
  try{
    const response=await fetch(request);
    if(response && (response.ok || response.type==='opaque')) cache.put(request,response.clone()).catch(()=>{});
    return response;
  }catch(err){
    return (await cache.match(request)) || (fallback ? await cache.match(fallback) : Response.error());
  }
}
async function cacheFirst(request){
  const cache=await caches.open(CACHE);
  const hit=await cache.match(request);
  if(hit){
    fetch(request).then(resp=>{if(resp && (resp.ok||resp.type==='opaque'))cache.put(request,resp.clone())}).catch(()=>{});
    return hit;
  }
  try{
    const resp=await fetch(request);
    if(resp && (resp.ok||resp.type==='opaque')) cache.put(request,resp.clone()).catch(()=>{});
    return resp;
  }catch{return Response.error();}
}
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(req.mode==='navigate'){
    event.respondWith(networkFirst(req,'./index.html'));
    return;
  }
  if(url.origin===self.location.origin){
    const ext=url.pathname.split('.').pop().toLowerCase();
    if(['js','css','json','webmanifest','html'].includes(ext)) event.respondWith(networkFirst(req));
    else event.respondWith(cacheFirst(req));
    return;
  }
  // CDN libraries and external source pages: cache after a successful online load.
  event.respondWith(networkFirst(req));
});
