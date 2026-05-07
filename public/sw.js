const CACHE_NAME = "ecosol-static-v2";
const FILES_TO_CACHE = ["/", "/ecosol-meta.png", "/manifest.json"];

// Permite que o cliente solicite que o SW pule para 'activated'
self.addEventListener("message", (event) => {
  if (!event.data) return;
  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const isApiRequest = url.pathname.startsWith("/api/");
  const isNavigationRequest = event.request.mode === "navigate" || event.request.destination === "document";

  if (isApiRequest) {
    // Para APIs: Network-first, com fallback para cache
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(event.request) || caches.match("/ecosol-meta.png"))
    );
  } else if (isNavigationRequest) {
    // Para navegação: Network-first para não prender HTML antigo no cache
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(event.request) || caches.match("/"))
    );
  } else {
    // Para assets estáticos: Cache-first
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) return response;
        return fetch(event.request)
          .then((res) => {
            if (!res || res.status !== 200 || res.type !== "basic") return res;
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            return res;
          })
          .catch(() => caches.match("/ecosol-meta.png"));
      })
    );
  }
});
