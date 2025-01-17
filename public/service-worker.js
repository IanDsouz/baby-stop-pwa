

let baseURL = '';

self.addEventListener('message', (event) => {
  if (event.data.type === 'SET_BASE_URL') {
    baseURL = event.data.baseURL;
    console.log('Base URL set in service worker:', baseURL);
  }
});


// Listen for background sync events
self.addEventListener('sync', (event) => {
  console.log(`Sync event triggered: ${event.tag}`);
  if (event.tag === 'sync-form') {
    console.log('Processing sync-form...');
    event.waitUntil(syncFormData());
  }
});

// Sync form data when back online
async function syncFormData() {
  console.log('Syncing form data...');
  try {
    const pendingRequests = await getPendingRequests();

    for (const request of pendingRequests) {
      const response = await fetch(`https://baby-stop-7sfsf.ondigitalocean.app/form/submissions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      if (response.ok) {
        await removeSyncedRequest(request.id);
      } else {
        console.error('Failed to sync request:', request);
      }
    }
  } catch (error) {
    console.error('Error syncing form data:', error);
  }
}

// Use IndexedDB for storing pending requests
async function getPendingRequests() {
  const db = await openDB('FormSyncDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('requests')) {
        db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
  return db.getAll('requests');
}

async function addPendingRequest(request) {
  const db = await openDB('FormSyncDB', 1);
  await db.add('requests', request);
}

async function removeSyncedRequest(id) {
  const db = await openDB('FormSyncDB', 1);
  await db.delete('requests', id);
}

importScripts('https://cdn.jsdelivr.net/npm/idb/build/iife/index-min.js');

const { openDB } = idb;