const CACHE = "tartiflette-v9";
const CORE = ["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png","./packs/index.json","./packs/espace.json","./packs/espace-portraits-1.json","./packs/espace-categories-1.json","./packs/japon.json","./packs/japon-voyage-1.json","./packs/japon-tokyo-quartiers-1.json","./packs/japon-kyoto-quartiers-1.json","./packs/japon-categories-1.json","./packs/japon-approfondissements-1.json","./packs/japon-osaka-nara-1.json","./packs/philosophie.json","./packs/opendata.json","./packs/ia.json","./packs/histoire-france.json","./packs/sociologie.json","./packs/psychologie.json","./packs/statistiques.json","./packs/equitation.json","./packs/pedagogie.json","./packs/neurosciences.json","./packs/themes-saisons.json","./packs/themes-gourmands.json"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  const font = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (url.origin !== location.origin && !font) return;
  const fresh = url.origin === location.origin && (url.pathname.includes("/packs/") || req.mode === "navigate" || url.pathname.endsWith("/index.html"));
  e.respondWith(caches.open(CACHE).then(async c => {
    if (fresh) {
      try { const r = await fetch(req); if (r.ok) c.put(req, r.clone()); return r; }
      catch (err) { return (await c.match(req, { ignoreSearch: true })) || (req.mode === "navigate" ? c.match("./index.html") : Response.error()); }
    }
    const hit = await c.match(req, { ignoreSearch: url.origin === location.origin });
    const net = fetch(req).then(r => { if (r && (r.ok || r.type === "opaque")) c.put(req, r.clone()); return r; }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    return (await net) || Response.error();
  }));
});
