const CACHE_NAME = 'monitor-cambiario-v1';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  './icon-512.png'
];

// 1. Instalación: guardamos la estructura base de la app
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Activación: limpiamos cachés viejas si actualizas la versión
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// 3. Estrategia: Red primero para datos frescos, Caché solo si no hay internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Si hay red, devolvemos lo fresco de la web
        return networkResponse;
      })
      .catch(() => {
        // Si la red falla (sin internet), buscamos en la caché local
        return caches.match(event.request);
      })
  );
});
