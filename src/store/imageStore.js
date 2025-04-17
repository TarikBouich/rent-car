const DB_NAME = 'clientImagesDB';
const STORE_NAME = 'images';
const CLIENT_DATA_STORE = 'clientData';
let db = null;

export const imageStore = {
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 3);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
        if (!db.objectStoreNames.contains(CLIENT_DATA_STORE)) {
          db.createObjectStore(CLIENT_DATA_STORE);
        }
      };
    });
  },

  async saveImage(key, base64Data) {
    if (!db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(base64Data, key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async getImage(key) {
    if (!db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async deleteImage(key) {
    if (!db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async saveClientData(clientId, clientData) {
    if (!db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(CLIENT_DATA_STORE, 'readwrite');
      const store = transaction.objectStore(CLIENT_DATA_STORE);
      const request = store.put(clientData, clientId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async getClientData(clientId) {
    if (!db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(CLIENT_DATA_STORE, 'readonly');
      const store = transaction.objectStore(CLIENT_DATA_STORE);
      const request = store.get(clientId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async getAllClients() {
    if (!db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(CLIENT_DATA_STORE, 'readonly');
      const store = transaction.objectStore(CLIENT_DATA_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async deleteClientData(clientId) {
    if (!db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(CLIENT_DATA_STORE, 'readwrite');
      const store = transaction.objectStore(CLIENT_DATA_STORE);
      const request = store.delete(clientId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}; 