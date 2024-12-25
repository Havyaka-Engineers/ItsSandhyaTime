// self.addEventListener('install', (event) => {
//     console.log('[Service Worker] Installed');
//     self.skipWaiting(); // Activate immediately
//   });
  
//   // Event: Activate
//   self.addEventListener('activate', (event) => {
//     console.log('[Service Worker] Activated');
//   });
  
//   // Event: Fetch
//   self.addEventListener('fetch', (event) => {
//     console.log('[Service Worker] Fetching:', event.request.url);
//   });
  
//   // Listen for `message` event to receive sunrise and sunset times
//   self.addEventListener('message', async (event) => {
//     if (event.data && event.data.type === 'SET_SUN_TIMES') {
//       const { sunrise, sunset } = event.data;
  
//       // Save the times in IndexedDB for persistence
//       await saveSunTimesToIndexedDB({ sunrise, sunset });
//       console.log('[Service Worker] Received and saved Sun Times:', { sunrise, sunset });
  
//       // Dynamically schedule notifications
//       scheduleNotifications(sunrise, sunset);
//     }
//   });
  
//   // Function to schedule notifications dynamically
//   const scheduleNotifications = (sunrise, sunset) => {
//     const now = Date.now();
  
//     // Schedule Sunrise Notification
//     if (sunrise > now) {
//       scheduleNotification(
//         'Sunrise Reminder',
//         'The sun is rising! Start your day with positivity 🌞',
//         sunrise
//       );
//     }
  
//     // Schedule Sunset Notification
//     if (sunset > now) {
//       scheduleNotification(
//         'Sunset Reminder',
//         'The sun is setting! Reflect on your day 🌅',
//         sunset
//       );
//     }
//   };
  
//   // Function to schedule a single notification
//   const scheduleNotification = (title, body, timestamp) => {
//     const delay = timestamp - Date.now();
  
//     if (delay > 0) {
//       setTimeout(() => {
//         self.registration.showNotification(title, {
//           body,
//           icon: '/app_icon.png',
//           tag: title,
//         });
//         console.log(`[Service Worker] Notification triggered: ${title}`);
//       }, delay);
//     } else {
//       console.log(`[Service Worker] Notification not scheduled, ${title} is in the past.`);
//     }
//   };
  
//   // Function to save sunrise and sunset times to IndexedDB
//   const saveSunTimesToIndexedDB = async (sunTimes) => {
//     const db = await openIndexedDB();
//     const transaction = db.transaction('sunTimes', 'readwrite');
//     const store = transaction.objectStore('sunTimes');
//     await store.put(sunTimes, 'latest');
//   };
  
//   // Function to open IndexedDB
//   const openIndexedDB = () => {
//     return new Promise((resolve, reject) => {
//       const request = indexedDB.open('SunTimesDB', 1);
  
//       request.onerror = (event) => {
//         console.error('[Service Worker] IndexedDB error:', event.target.error);
//         reject(event.target.error);
//       };
  
//       request.onsuccess = (event) => {
//         console.log('[Service Worker] IndexedDB opened successfully');
//         resolve(event.target.result);
//       };
  
//       request.onupgradeneeded = (event) => {
//         const db = event.target.result;
//         if (!db.objectStoreNames.contains('sunTimes')) {
//           db.createObjectStore('sunTimes');
//         }
//       };
//     });
//   };
  

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installed');
    self.skipWaiting(); // Activate immediately
  });
  
  // Event: Activate
  self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activated');
  });
  
  // Event: Fetch
  self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] Fetching:', event.request.url);
  });
  
  // Listen for `message` event to receive sunrise and sunset times
  self.addEventListener('message', async (event) => {
    if (event.data && event.data.type === 'SET_SUN_TIMES') {
      const { sunrise, sunset } = event.data;
  
      // Save the times in IndexedDB for persistence
      await saveSunTimesToIndexedDB({ sunrise, sunset });
      console.log('[Service Worker] Received and saved Sun Times:', { sunrise, sunset });
  
      // Schedule notifications every 10 seconds for testing
      scheduleTestNotifications();
    }
  });
  
  // Function to schedule notifications every 10 seconds for testing
  const scheduleTestNotifications = () => {
    let count = 1; // Counter to differentiate notifications
    setInterval(() => {
      const title = `Test Notification ${count}`;
      const body = `This is test notification ${count}`;
      self.registration.showNotification(title, {
        body,
        icon: '/app_icon.png',
        tag: title, // Ensures unique notifications
      });
      console.log(`[Service Worker] Test Notification triggered: ${title}`);
      count++;
    }, 10000); // 10 seconds interval
  };
  
  // Function to schedule a single notification
  const scheduleNotification = (title, body, timestamp) => {
    const delay = timestamp - Date.now();
  
    if (delay > 0) {
      setTimeout(() => {
        self.registration.showNotification(title, {
          body,
          icon: '/app_icon.png',
          tag: title,
        });
        console.log(`[Service Worker] Notification triggered: ${title}`);
      }, delay);
    } else {
      console.log(`[Service Worker] Notification not scheduled, ${title} is in the past.`);
    }
  };
  
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
  