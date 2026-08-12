const CACHE_NAME = 'victoria-calendar-v2';
const ASSETS = [
    '/victoria-calendar/',
    '/victoria-calendar/index.html',
    '/victoria-calendar/manifest.json',
    '/victoria-calendar/icons/icon-192.png',
    '/victoria-calendar/icons/icon-512.png',
    '/victoria-calendar/icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
            .catch(() => new Response('Офлайн режим', { status: 503 }))
    );
});
