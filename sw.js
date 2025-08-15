const CACHE_NAME = 'gh-gamekeys-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/cart.html',
  '/success.html',
  '/CSS/style.css',
  '/CSS/cartstyle.css',
  '/cart.js',
  '/images/logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});