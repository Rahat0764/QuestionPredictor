// public/sw.js
const CACHE_NAME = 'exampredictor-v1';
const urlsToCache = [
  '/',
  '/predict',
  '/subjects',
  '/upload/questions',
  '/upload/resources',
  '/manifest.json',
  // Add other static assets if needed
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});