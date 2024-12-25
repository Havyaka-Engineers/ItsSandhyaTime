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
    console.log('[Service Worker] Processing sun times:', { sunrise, sunset });

    try {
      // Save the times in IndexedDB for persistence
      await saveSunTimesToIndexedDB({ sunrise, sunset });
      console.log('[Service Worker] Successfully saved sun times to IndexedDB');

      // Schedule notifications
      await scheduleNotifications(sunrise, sunset);
      console.log('[Service Worker] Successfully scheduled notifications');

      // Send response through the MessageChannel port if available
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ success: true });
        console.log('[Service Worker] Sent success response through MessageChannel');
      } else if (event.source) {
        // Fallback to client.postMessage if no MessageChannel
        event.source.postMessage({
          type: 'SUN_TIMES_RECEIVED',
          success: true,
        });
        console.log('[Service Worker] Sent success response through client.postMessage');
      } else {
        console.warn('[Service Worker] No way to send response back to client');
      }
    } catch (error) {
      console.error('[Service Worker] Error processing message:', error);
      const errorResponse = {
        success: false,
        error: error.message || 'Failed to process sun times',
      };

      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage(errorResponse);
      } else if (event.source) {
        event.source.postMessage({
          type: 'SUN_TIMES_RECEIVED',
          ...errorResponse,
        });
      }
    }
  }
  // Handle SHOW_NOTIFICATION message for immediate notifications
  else if (event.data?.type === 'SHOW_NOTIFICATION') {
    const { title, body, data } = event.data;
    try {
      await showImmediateNotification(title, body, data);
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ success: true });
      }
    } catch (error) {
      console.error('[Service Worker] Error showing immediate notification:', error);
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({
          success: false,
          error: error.message,
        });
      }
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
  console.log('[Service Worker] Scheduling notifications for:', { sunrise, sunset });
  const now = Date.now();

  // Add a test notification for 10 seconds from now
  // const testTime = now + 10000; // 10 seconds from now
  // await scheduleNotification(
  //   'Test Notification',
  //   'This is a test notification that should appear 10 seconds after scheduling',
  //   testTime,
  // );
  // console.log('[Service Worker] Scheduled test notification');

  // Schedule Sunrise Notification
  if (sunrise > now) {
    await scheduleNotification('Sunrise Reminder', 'The sun is rising! Start your day with positivity 🌞', sunrise);
  } else {
    console.log('[Service Worker] Sunrise time is in the past:', new Date(sunrise).toLocaleString());
  }

  // Schedule Sunset Notification
  if (sunset > now) {
    await scheduleNotification('Sunset Reminder', 'The sun is setting! Reflect on your day 🌅', sunset);
  } else {
    console.log('[Service Worker] Sunset time is in the past:', new Date(sunset).toLocaleString());
  }
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
  console.log('[Service Worker] Showing immediate notification:', { title, body, data });
  try {
    await self.registration.showNotification(title, {
      body,
      icon: '/app_icon.png',
      tag: title,
      requireInteraction: true,
      vibrate: [200, 100, 200],
      data,
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
    console.log(`[Service Worker] Immediate notification shown: ${title}`);
  } catch (error) {
    console.error(`[Service Worker] Error showing immediate notification: ${error}`);
    throw error;
  }
};
