/* BRASILESPANA service worker — cache-first com fallback de rede.
   Cache mínimo do shell para suportar instalação PWA e abertura offline. */
const VERSION = 'brasilespana-v1'
const SHELL = [
  '/',
  '/favicon.svg',
  '/manifest.webmanifest',
  '/images/logomarca.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  // Não interferir em chamadas para Supabase, Nominatim ou qualquer API externa
  if (url.origin !== self.location.origin) return

  // SPA navegação: sempre tenta rede primeiro, cai pro cache se offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/'))
    )
    return
  }

  // Assets: cache-first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached
      return fetch(request).then(res => {
        if (res.ok && res.type === 'basic') {
          const copy = res.clone()
          caches.open(VERSION).then(cache => cache.put(request, copy))
        }
        return res
      }).catch(() => cached)
    })
  )
})
