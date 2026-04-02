const CACHE_NAME = 'rosario-v1';
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
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});