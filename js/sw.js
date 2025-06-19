// Service Worker for CheckInApp PWA
const CACHE_NAME = 'checkinapp-v1.0.4';

// Determine the correct base path based on the service worker location
const swUrl = new URL(self.location.href);
const basePath = swUrl.pathname.replace('/js/sw.js', '/');
const origin = swUrl.origin;
const baseURL = origin + basePath;

console.log('Service Worker: Base URL determined as:', baseURL);
console.log('Service Worker: Origin:', origin);
console.log('Service Worker: Base path:', basePath);

const urlsToCache = [
  baseURL,
  baseURL + 'index.html',
  baseURL + 'pages/class-setup.html',
  baseURL + 'pages/check-in.html',
  baseURL + 'pages/attendee-list.html',
  baseURL + 'offline.html',
  baseURL + 'css/styles.css',
  baseURL + 'js/main.js',
  baseURL + 'js/storage.js',
  baseURL + 'js/utils.js',
  baseURL + 'js/class-setup.js',
  baseURL + 'js/check-in.js',
  baseURL + 'js/attendee-list.js',
  baseURL + 'assets/icon-192x192.png',
  baseURL + 'assets/icon-512x512.png',
  baseURL + 'manifest.json'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  console.log('Service Worker: URLs to cache:', urlsToCache);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        
        // Test each URL first, then cache only the valid ones
        const cachePromises = urlsToCache.map(url => {
          console.log(`Service Worker: Attempting to cache: ${url}`);
          return fetch(url)
            .then(response => {
              if (response.ok) {
                return cache.add(url);
              } else {
                console.warn(`Service Worker: Skipping ${url} - HTTP ${response.status}`);
                return Promise.resolve();
              }
            })
            .catch(error => {
              console.error(`Service Worker: Failed to cache ${url}:`, error);
              return Promise.resolve(); // Don't fail the entire installation
            });
        });
        
        return Promise.all(cachePromises);
      })
      .then(() => {
        // Try to cache external resources separately
        return caches.open(CACHE_NAME).then(cache => {
          const fontsUrl = 'https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap';
          console.log('Service Worker: Attempting to cache Google Fonts');
          return fetch(fontsUrl)
            .then(response => {
              if (response.ok) {
                return cache.add(fontsUrl);
              } else {
                console.warn('Service Worker: Failed to fetch Google Fonts');
              }
            })
            .catch(error => {
              console.warn('Service Worker: Failed to cache Google Fonts:', error);
            });
        });
      })
      .then(() => {
        console.log('Service Worker: Installation completed successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activated successfully');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.startsWith('https://fonts.googleapis.com') &&
      !event.request.url.startsWith('https://fonts.gstatic.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          console.log('Service Worker: Serving from cache', event.request.url);
          return response;
        }

        console.log('Service Worker: Fetching from network', event.request.url);
        return fetch(event.request).then(response => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(error => {
        console.error('Service Worker: Fetch failed', error);
        // Return a fallback page for navigation requests when offline
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

// Handle messages from the main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync for offline data
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // This function can be extended to sync offline data when connection is restored
  console.log('Service Worker: Performing background sync');
  // Add your offline data sync logic here
}

// Push notification support (optional)
self.addEventListener('push', event => {
  console.log('Service Worker: Push message received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from CheckInApp',
    icon: '/assets/icon-192x192.png',
    badge: '/assets/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('CheckInApp', options)
  );
});
