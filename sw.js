// Keeps Fusion Drop Runner working with a poor signal: app files come from the phone,
// and the page itself is refreshed from the web whenever there is a connection.
const VERSION = "fdr-v18";
const CORE = ["./", "index.html", "config.js", "manifest.webmanifest", "ukpc.json", "tesseract.min.js",
  "jspdf.umd.min.js", "icons/fusion-192.png", "icons/fusion-512.png", "icons/fusion-apple-180.png"];
const HEAVY = ["ocr/worker.min.js", "ocr/core/tesseract-core-simd-lstm.wasm.js", "ocr/core/tesseract-core-lstm.wasm.js", "ocr/lang/eng-data.wasm"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE).then(() => Promise.allSettled(HEAVY.map(u => c.add(u))))));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET") return;
  const same = url.origin === location.origin;
  const fonts = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!same && !fonts) return;
  const fresh = same && (req.mode === "navigate" || /\/icons\/|manifest\.webmanifest/.test(url.pathname) || /\/(index\.html|config\.js)?$/.test(url.pathname) || url.pathname.endsWith("config.js"));
  if (fresh) {
    // Use the stored copy if the network is slow, so the app never sits on the splash screen.
    e.respondWith((async () => {
      const cache = await caches.open(VERSION);
      const stored = await cache.match(req) || (req.mode === "navigate" ? (await cache.match("./")) || (await cache.match("index.html")) : null);
      const net = fetch(req).then(r => { if (r && r.ok) cache.put(req, r.clone()); return r; });
      if (!stored) return net.catch(() => cache.match("index.html"));
      net.catch(() => {});
      return Promise.race([net.catch(() => stored), new Promise(res => setTimeout(() => res(stored), 2500))]);
    })());
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok || r.type === "opaque") { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return r;
  })));
});
