self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install event fired');
  // Ensure the service worker activates immediately
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate event fired');
  // Ensure the service worker takes control of all clients immediately
  event.waitUntil(
    Promise.all([
      clients.claim(),
      // Log after claiming clients
      clients.matchAll().then((clients) => {
        console.log('[Service Worker] Claimed clients:', clients.length);
      }),
    ]),
  );
});

// Event: Fetch
self.addEventListener('fetch', (event) => {
  // Only log important fetches to reduce console noise
  if (!event.request.url.includes('sunrise-sunset.org')) {
    return;
  }
  console.log('[Service Worker] Fetching:', event.request.url);
});

// Listen for `message` event to receive sunrise and sunset times
self.addEventListener('message', async (event) => {
  console.log('[Service Worker] Message received with full details:', {
    type: event.data?.type,
    eventType: event.data?.eventType,
    data: event.data,
    source: event.source?.id,
    origin: event.origin,
    ports: event.ports?.length,
  });

  // Handle SET_SUN_TIMES message
  if (event.data?.type === 'SET_SUN_TIMES') {
    const { sunrise, sunset } = event.data;
    
    // Process in the background without blocking
    Promise.all([
      saveSunTimesToIndexedDB({ sunrise, sunset }),
      scheduleNotifications(sunrise, sunset)
    ]).catch(error => {
      console.error('[Service Worker] Error processing sun times:', error);
    });
  }
  // Handle SHOW_NOTIFICATION message for immediate notifications
  else if (event.data?.type === 'SHOW_NOTIFICATION') {
    try {
      const { title, body, data } = event.data;
      await showImmediateNotification(title, body, data);
    } catch (error) {
      console.error('[Service Worker] Error showing notification:', error);
    }
  }
  // Handle other known message types
  else if (event.data?.eventType === 'ping' || event.data?.eventType === 'keyChanged') {
    console.log('[Service Worker] Received system event:', event.data.eventType);
  } else {
    console.warn('[Service Worker] Received unknown message:', event.data);
  }
});

// Function to schedule notifications
const scheduleNotifications = async (sunrise, sunset) => {
  const now = Date.now();
  let sunriseTime = sunrise;
  let sunsetTime = sunset;

  // Adjust times if needed
  while (now >= sunriseTime) sunriseTime += 86400000; // 24 hours in milliseconds
  while (now >= sunsetTime) sunsetTime += 86400000;

  // Schedule sunrise notification
  setTimeout(async () => {
    try {
      await self.registration.showNotification('Sunrise Sandhya Time', {
        body: 'Time for your morning Sandhya practice 🌅',
        icon: '/app_icon.png',
        tag: 'sunrise-notification',
        requireInteraction: true,
        vibrate: [200, 100, 200],
        actions: [
          {
            action: 'open',
            title: 'Start Practice'
          },
          {
            action: 'dismiss',
            title: 'Dismiss'
          }
        ]
      });
      
      // Schedule next day's sunrise notification
      scheduleNotifications(sunriseTime + 86400000, sunsetTime + 86400000);
    } catch (error) {
      console.error('[Service Worker] Error showing sunrise notification:', error);
    }
  }, sunriseTime - now);

  // Schedule sunset notification
  setTimeout(async () => {
    try {
      await self.registration.showNotification('Sunset Sandhya Time', {
        body: 'Time for your evening Sandhya practice 🌇',
        icon: '/app_icon.png',
        tag: 'sunset-notification',
        requireInteraction: true,
        vibrate: [200, 100, 200],
        actions: [
          {
            action: 'open',
            title: 'Start Practice'
          },
          {
            action: 'dismiss',
            title: 'Dismiss'
          }
        ]
      });
    } catch (error) {
      console.error('[Service Worker] Error showing sunset notification:', error);
    }
  }, sunsetTime - now);
};

// Function to schedule a single notification
const scheduleNotification = async (title, body, timestamp) => {
  console.log('[Service Worker] Scheduling notification:', { title, timestamp: new Date(timestamp).toLocaleString() });

  try {
    const delay = timestamp - Date.now();

    if (delay > 0) {
      // Schedule the notification using setTimeout
      setTimeout(async () => {
        try {
          await self.registration.showNotification(title, {
            body,
            icon: '/app_icon.png',
            tag: title,
            requireInteraction: true, // Keep the notification visible until user interacts
            vibrate: [200, 100, 200], // Vibration pattern
            actions: [
              {
                action: 'open',
                title: 'Open App',
              },
              {
                action: 'close',
                title: 'Dismiss',
              },
            ],
          });
          console.log(`[Service Worker] Notification shown: ${title}`);
        } catch (error) {
          console.error(`[Service Worker] Error showing notification: ${error}`);
        }
      }, delay);

      console.log(`[Service Worker] Notification scheduled for ${new Date(timestamp).toLocaleString()}`);
    } else {
      console.log(`[Service Worker] Notification not scheduled, ${title} is in the past:`, new Date(timestamp).toLocaleString());
    }
  } catch (error) {
    console.error(`[Service Worker] Error scheduling notification ${title}:`, error);
    throw error;
  }
};

// Add notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event.notification.tag);

  event.notification.close();

  if (event.action === 'open') {
    // Open the app when notification is clicked
    clients.openWindow('/');
  }
});

// Function to save sunrise and sunset times to IndexedDB
const saveSunTimesToIndexedDB = async (sunTimes) => {
  const db = await openIndexedDB();
  const transaction = db.transaction('sunTimes', 'readwrite');
  const store = transaction.objectStore('sunTimes');
  await store.put(sunTimes, 'latest');
};

// Function to open IndexedDB
const openIndexedDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SunTimesDB', 1);

    request.onerror = (event) => {
      console.error('[Service Worker] IndexedDB error:', event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      console.log('[Service Worker] IndexedDB opened successfully');
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('sunTimes')) {
        db.createObjectStore('sunTimes');
      }
    };
  });
};

// Function to show an immediate notification
const showImmediateNotification = async (title, body, data = {}) => {
  try {
    await self.registration.showNotification(title, {
      body,
      icon: '/app_icon.png',
      badge: '/app_icon.png',
      tag: data.type || 'default',
      requireInteraction: true,
      vibrate: [200, 100, 200],
      actions: [
        {
          action: 'open',
          title: 'Start Practice'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ],
      data
    });
    console.log(`[Service Worker] Immediate notification shown: ${title}`);
  } catch (error) {
    console.error(`[Service Worker] Error showing immediate notification:`, error);
    throw error;
  }
};
