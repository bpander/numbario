var CACHE_NAME = 'dependencies-cache';

var REQUIRED_FILES = [
  'index.html',
  '/',
  'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600',
  'assets/styles/modern.css?v={{version}}',
  'assets/scripts/vendor.js?v={{version}}',
  'assets/scripts/main.js?v={{version}}',
];

self.addEventListener('install', function (event) {
  // Perform install step: loading each required file into cache
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        // Add all offline dependencies to the cache
        return cache.addAll(REQUIRED_FILES);
      })
      .then(function () {
        // At this point everything has been cached
        return self.skipWaiting();
      })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // Cache hit - return the response from the cached version
        if (response) {
          return response;
        }

        // Not in cache - return the result from the live server
        // `fetch` is essentially a "fallback"
        return fetch(event.request);
      }
    )
  );
});
