const C="voicetodo-v3-repair";
const ROOT=new URL("./",self.registration.scope).href;
const HOME=new URL("index.html",ROOT).href;
const FILES=["index.html","manifest.json","icon-180.png","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil((async()=>{const c=await caches.open(C);for(const path of FILES){const url=new URL(path,ROOT).href;const r=await fetch(url,{cache:"reload"});if(!r.ok)throw Error("Asset unavailable");if(path==="index.html"){const t=await r.clone().text();if(!t.includes('</script>\n<script id="mimi-local-album-v1">'))throw Error("Old or invalid page");}await c.put(url,r);}await self.skipWaiting();})());});
self.addEventListener("activate",e=>{e.waitUntil((async()=>{const ks=await caches.keys();await Promise.all(ks.filter(k=>k.startsWith("voicetodo-")&&k!==C).map(k=>caches.delete(k)));await self.clients.claim();})());});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET"||!e.request.url.startsWith(ROOT))return;
if(e.request.mode==="navigate"){e.respondWith((async()=>{const c=await caches.open(C);try{const r=await fetch(e.request,{cache:"reload"});if(r.ok&&(await r.clone().text()).includes('</script>\n<script id="mimi-local-album-v1">')){await c.put(HOME,r.clone());return r;}}catch(_){}return (await c.match(HOME))||Response.error();})());return;}
e.respondWith((async()=>{const c=await caches.open(C);try{const r=await fetch(e.request);if(r.ok)await c.put(e.request,r.clone());return r;}catch(_){return (await c.match(e.request))||Response.error();}})());});