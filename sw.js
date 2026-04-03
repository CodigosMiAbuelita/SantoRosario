// CHANGE THIS VERSION NUMBER! 
// This forces the browser to install the new service worker.
const CACHE_NAME = 'rosario-v2'; 

const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './Images/gozosos.jpg',
  './Images/luminosos.jpg',
  './Images/dolorosos.jpg',
  './Images/gloriosos.jpg',
  './Audio/Decade.mp3',
  './Audio/Litany.mp3',
  './Audio/Joy_intro.mp3', './Audio/Joy2.mp3', './Audio/Joy3.mp3', './Audio/Joy4.mp3', './Audio/Joy5.mp3',
  './Audio/Luminous_intro.mp3', './Audio/Luminous2.mp3', './Audio/Luminous3.mp3', './Audio/Luminous4.mp3', './Audio/Luminous5.mp3',
  './Audio/Sorrow_intro.mp3', './Audio/Sorrow2.mp3', './Audio/Sorrow3.mp3', './Audio/Sorrow4.mp3', './Audio/Sorrow5.mp3',
  './Audio/Glory_intro.mp3', './Audio/Glory2.mp3', './Audio/Glory3.mp3', './Audio/Glory4.mp3', './Audio/Glory5.mp3'
];

self.addEventListener('install', e => {
  self.skipWaiting(); // Forces the new service worker to activate immediately
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  // Clean up old caches when the version number changes
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', e => {
  // 1. Handle Safari Range Requests for Media (Audio/Video)
  if (e.request.headers.has('range')) {
    e.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(e.request.url).then(res => {
          if (!res) return fetch(e.request);

          return res.arrayBuffer().then(arrayBuffer => {
            const bytes = e.request.headers.get('range').match(/^bytes\=(\d+)\-(\d+)?$/);
            const pos = Number(bytes[1]);
            const end = bytes[2] ? Number(bytes[2]) : arrayBuffer.byteLength - 1;
            const slice = arrayBuffer.slice(pos, end + 1);

            return new Response(slice, {
              status: 206,
              statusText: 'Partial Content',
              headers: [
                ['Content-Type', res.headers.get('Content-Type') || 'audio/mpeg'],
                ['Content-Range', `bytes ${pos}-${end}/${arrayBuffer.byteLength}`],
                ['Content-Length', slice.byteLength],
                ['Accept-Ranges', 'bytes']
              ]
            });
          });
        });
      })
    );
  } else {
    // 2. Handle normal requests (HTML, CSS, JS, Images)
    e.respondWith(
      caches.match(e.request).then(res => res || fetch(e.request))
    );
  }
});