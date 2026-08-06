const CACHE_NAME = 'pom-superadmin-cache-v1'; // NAMA LACI KHUSUS SUPERADMIN
const urlsToCache = [
  './',
  './superadmin.html',
  './manifest-superadmin.json',
  './Logo%20Power%20of%20Masjid.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return Promise.all(
          urlsToCache.map(url => cache.add(url).catch(err => {
            console.log('SW Superadmin: gagal cache', url, err);
          }))
        );
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => Promise.all(
      // PERBAIKAN PENTING: Hanya hapus cache milik superadmin yang lama, 
      // JANGAN sentuh cache milik Admin DKM
      names.filter(n => n.startsWith('pom-superadmin-cache') && n !== CACHE_NAME)
           .map(n => caches.delete(n))
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
