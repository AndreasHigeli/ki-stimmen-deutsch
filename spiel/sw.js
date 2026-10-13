// Service Worker: macht das Spiel offline spielbar und als App installierbar.
// Bei Änderungen am Spiel die Versionsnummer erhöhen, sonst bleibt der alte Stand im Cache.
const VERSION = 'snake-twist-v2';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png',
  ...['start','none','turbo','mirror','wrap','dark','gold','rocks','slow','gameover','record'].map(id => `./sounds/say-${id}.mp3`),
  ...['eat','die','portal'].map(id => `./sounds/sfx-${id}.mp3`)];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).then(res => {
    if (res.ok && new URL(e.request.url).origin === location.origin) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); }
    return res;
  }).catch(() => hit)));
});
