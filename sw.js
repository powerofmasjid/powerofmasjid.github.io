const CACHE_NAME = 'pom-admin-cache-v4';
const urlsToCache = [
  './',
  './admin.html',
  './superadmin.html',
  './manifest.json',
  './manifest-superadmin.json',
  './Logo%20Power%20of%20Masjid.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return Promise.all(
          urlsToCache.map(url => cache.add(url).catch(err => {
            console.log('SW: gagal cache', url, err);
          }))
        );
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => Promise.all(
      names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
