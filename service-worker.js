'use strict';

const CACHE_NAME = 'markdown-print-viewer-v1.6.0';
const LOCAL_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];
const RUNTIME_DEPENDENCIES = [
  "https://cdn.jsdelivr.net/npm/markdown-it@15.0.1/dist/browser/markdown-it.umd.min.js",
  "https://cdn.jsdelivr.net/npm/markdown-it-task-lists@2.1.1/dist/markdown-it-task-lists.min.js",
  "https://cdn.jsdelivr.net/npm/markdown-it-footnote@4.0.0/dist/markdown-it-footnote.min.js",
  "https://cdn.jsdelivr.net/npm/dompurify@3.4.14/dist/purify.min.js",
  "https://cdn.jsdelivr.net/npm/docx@9.7.1/dist/index.iife.js"
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(LOCAL_ASSETS);
    await Promise.allSettled(RUNTIME_DEPENDENCIES.map(async url => {
      const response = await fetch(url, { mode: 'cors' });
      if (response.ok || response.type === 'opaque') await cache.put(url, response.clone());
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter(name => name.startsWith('markdown-print-viewer-') && name !== CACHE_NAME)
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

async function networkFirst(request, fallbackUrl = null) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok || response.type === 'opaque') await cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (fallbackUrl) {
      const fallback = await cache.match(fallbackUrl);
      if (fallback) return fallback;
    }
    throw error;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok || response.type === 'opaque') await cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, './index.html'));
    return;
  }

  if (url.origin === self.location.origin) {
    if (url.pathname.endsWith('/manifest.webmanifest')) event.respondWith(networkFirst(request));
    else event.respondWith(cacheFirst(request));
    return;
  }

  if (RUNTIME_DEPENDENCIES.includes(request.url)) {
    event.respondWith(cacheFirst(request));
  }
});
