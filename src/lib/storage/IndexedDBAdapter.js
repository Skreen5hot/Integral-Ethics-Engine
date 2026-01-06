/**
 * IndexedDB Storage Adapter
 *
 * Implements StorageAdapter interface for browser IndexedDB
 * Used for offline-first PWA data persistence
 *
 * Features:
 * - Asynchronous key-value storage
 * - Larger storage capacity than localStorage
 * - Structured data support
 * - Transaction-based operations
 */

import { StorageAdapter } from '../../application/sessionManager.js';

export class IndexedDBAdapter extends StorageAdapter {
	constructor(dbName = 'iee_storage', version = 1) {
		super();
		this.dbName = dbName;
		this.version = version;
		this.storeName = 'keyvalue';
		this.db = null;
	}

	/**
	 * Initialize IndexedDB connection
	 * @returns {Promise<IDBDatabase>}
	 */
	async _getDB() {
		if (this.db) {
			return this.db;
		}

		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, this.version);

			request.onerror = () => {
				reject(new Error(`IndexedDB error: ${request.error}`));
			};

			request.onsuccess = () => {
				this.db = request.result;
				resolve(this.db);
			};

			request.onupgradeneeded = (event) => {
				const db = event.target.result;

				// Create object store if it doesn't exist
				if (!db.objectStoreNames.contains(this.storeName)) {
					db.createObjectStore(this.storeName);
				}
			};
		});
	}

	/**
	 * Get item from IndexedDB
	 * @param {string} key - Storage key
	 * @returns {Promise<any>} Stored value or null
	 */
	async getItem(key) {
		const db = await this._getDB();

		return new Promise((resolve, reject) => {
			const transaction = db.transaction([this.storeName], 'readonly');
			const store = transaction.objectStore(this.storeName);
			const request = store.get(key);

			request.onsuccess = () => {
				resolve(request.result !== undefined ? request.result : null);
			};

			request.onerror = () => {
				reject(new Error(`Failed to get item: ${request.error}`));
			};
		});
	}

	/**
	 * Set item in IndexedDB
	 * @param {string} key - Storage key
	 * @param {any} value - Value to store
	 * @returns {Promise<void>}
	 */
	async setItem(key, value) {
		const db = await this._getDB();

		return new Promise((resolve, reject) => {
			const transaction = db.transaction([this.storeName], 'readwrite');
			const store = transaction.objectStore(this.storeName);
			const request = store.put(value, key);

			request.onsuccess = () => {
				resolve();
			};

			request.onerror = () => {
				reject(new Error(`Failed to set item: ${request.error}`));
			};
		});
	}

	/**
	 * Remove item from IndexedDB
	 * @param {string} key - Storage key
	 * @returns {Promise<void>}
	 */
	async removeItem(key) {
		const db = await this._getDB();

		return new Promise((resolve, reject) => {
			const transaction = db.transaction([this.storeName], 'readwrite');
			const store = transaction.objectStore(this.storeName);
			const request = store.delete(key);

			request.onsuccess = () => {
				resolve();
			};

			request.onerror = () => {
				reject(new Error(`Failed to remove item: ${request.error}`));
			};
		});
	}

	/**
	 * Get all keys from IndexedDB
	 * @returns {Promise<string[]>}
	 */
	async getAllKeys() {
		const db = await this._getDB();

		return new Promise((resolve, reject) => {
			const transaction = db.transaction([this.storeName], 'readonly');
			const store = transaction.objectStore(this.storeName);
			const request = store.getAllKeys();

			request.onsuccess = () => {
				resolve(request.result);
			};

			request.onerror = () => {
				reject(new Error(`Failed to get keys: ${request.error}`));
			};
		});
	}

	/**
	 * Clear all items from IndexedDB
	 * @returns {Promise<void>}
	 */
	async clear() {
		const db = await this._getDB();

		return new Promise((resolve, reject) => {
			const transaction = db.transaction([this.storeName], 'readwrite');
			const store = transaction.objectStore(this.storeName);
			const request = store.clear();

			request.onsuccess = () => {
				resolve();
			};

			request.onerror = () => {
				reject(new Error(`Failed to clear store: ${request.error}`));
			};
		});
	}

	/**
	 * Close IndexedDB connection
	 */
	close() {
		if (this.db) {
			this.db.close();
			this.db = null;
		}
	}
}

export default IndexedDBAdapter;
