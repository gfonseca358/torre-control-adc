const CACHE_NAME = 'torre-adc-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache).catch(function(err) {
        console.log('Cache error:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(names.map(function(n) {
        if (n !== CACHE_NAME) return caches.delete(n);
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  // Don't cache API calls to Supabase
  if (event.request.url.indexOf('supabase.co') !== -1) {
    event.respondWith(fetch(event.request));
    return;
  }
  // For everything else, try network first, fallback to cache
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});