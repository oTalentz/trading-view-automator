
// Service Worker for Trading Automator App

const CACHE_NAME = 'trading-automator-v1';

// Files to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
];

// Install service worker and cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service worker cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Clean up old caches when a new service worker activates
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Handle push events from the server
self.addEventListener('push', event => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'New trading signal alert!',
      icon: data.icon || '/favicon.ico',
      badge: data.badge || '/favicon.ico',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Trading Automator Alert',
        options
      )
    );
  } catch (error) {
    // Fallback for non-JSON push messages
    event.waitUntil(
      self.registration.showNotification(
        'Trading Automator',
        {
          body: event.data.text(),
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          vibrate: [100, 50, 100]
        }
      )
    );
  }
});

// Open the app when notification is clicked
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  let url = '/';
  if (event.notification.data && event.notification.data.url) {
    url = event.notification.data.url;
  }
  
  event.waitUntil(
    clients.matchAll({type: 'window'}).then(windowClients => {
      // Check if there's already a window open
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window if needed
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
