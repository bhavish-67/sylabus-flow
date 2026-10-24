const CACHE = 'syllabus-flow-v4';
const APP_FILES = ['./', './index.html', './styles.css', './app.js', './manifest.webmanifest', './app-icon.svg'];

self.addEventListener('install', (event) => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_FILES))));
self.addEventListener('activate', (event) => event.waitUntil(Promise.all([
  caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('syllabus-flow-v') && key !== CACHE).map(key => caches.delete(key)))),
  self.clients.claim()
])));
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
