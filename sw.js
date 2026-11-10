const C="words-202611102130";
const FILES=["./","index.html","manifest.webmanifest","icon-180.png","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET") return;
  const u=new URL(r.url); if(u.origin!==location.origin) return;
  if(r.mode==="navigate"){
    e.respondWith(fetch(r,{cache:"no-store"}).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put("index.html",cp));return res;}).catch(()=>caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(c=>c||fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(x=>x.put(r,cp));return res;})));
});
