// db.js
import { openDB } from 'idb';

export const initDB = async () => {
  try {
    return await openDB('FormSyncDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('requests')) {
          db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
        }
      },
    });
  } catch (error) {
    console.error('Failed to initialize IndexedDB:', error);
    throw new Error('IndexedDB initialization failed');
  }
};

// export const addPendingRequest = async (request) => {
//   const db = await initDB();
//   await db.add('requests', request);
// };

// Add or update a request (Handles both new and edited requests)
export const addOrUpdatePendingRequest = async (request) => {
  const db = await initDB();
  await db.put('requests', request);
};

export const getPendingRequests = async () => {
  const db = await initDB();
  return db.getAll('requests');
};

export const removeSyncedRequest = async (id) => {
  const db = await initDB();
  await db.delete('requests', id);
};
