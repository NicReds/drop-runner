// Keeps Fusion Drop Runner working with a poor signal: app files come from the phone,
// and the page itself is refreshed from the web whenever there is a connection.
const VERSION = "fdr-v7";
const CORE = ["./", "index.html", "config.js", "manifest.webmanifest", "ukpc.json", "tesseract.min.js",
  "jspdf.umd.min.js", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"];
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
  const fresh = same && (req.mode === "navigate" || /\/(index\.html|config\.js)?$/.test(url.pathname) || url.pathname.endsWith("config.js"));
  if (fresh) {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return r; })
      .catch(() => caches.match(req).then(r => r || caches.match("index.html"))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok || r.type === "opaque") { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return r;
  })));
});
