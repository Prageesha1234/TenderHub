/**
 * storage.js
 * Manages persistence for TenderHub using LocalStorage for records and IndexedDB for document attachments.
 */

const DB_NAME = 'TenderHubDB';
const DB_VERSION = 1;
const DOC_STORE = 'tender_documents';
const STORAGE_KEY_TENDERS = 'tenderhub_tenders_v1';
const STORAGE_KEY_SETTINGS = 'tenderhub_settings_v1';

class StorageManager {
    constructor() {
        this.db = null;
        this.initIndexedDBPromise = this.initIndexedDB();
    }

    // Initialize IndexedDB for storing document files/blobs
    initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(DOC_STORE)) {
                    db.createObjectStore(DOC_STORE, { keyPath: 'id' });
                }
            };
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };
            request.onerror = (event) => {
                console.error('IndexedDB init error:', event.target.error);
                resolve(null); // Fallback gracefully
            };
        });
    }

    // --- Tender CRUD (LocalStorage) ---

    getTenders() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_TENDERS);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Failed to parse tenders from localStorage:', e);
            return [];
        }
    }

    saveTenders(tenders) {
        try {
            localStorage.setItem(STORAGE_KEY_TENDERS, JSON.stringify(tenders));
            return true;
        } catch (e) {
            console.error('Failed to save tenders to localStorage:', e);
            return false;
        }
    }

    getTenderById(id) {
        const tenders = this.getTenders();
        return tenders.find(t => t.id === id) || null;
    }

    saveTender(tenderData) {
        const tenders = this.getTenders();
        const existingIndex = tenders.findIndex(t => t.id === tenderData.id);
        
        tenderData.updatedAt = new Date().toISOString();
        if (!tenderData.createdAt) {
            tenderData.createdAt = new Date().toISOString();
        }

        if (existingIndex >= 0) {
            tenders[existingIndex] = { ...tenders[existingIndex], ...tenderData };
        } else {
            if (!tenderData.id) {
                tenderData.id = 'TND-' + Date.now();
            }
            tenders.unshift(tenderData);
        }

        this.saveTenders(tenders);
        return tenderData;
    }

    deleteTender(id) {
        const tenders = this.getTenders();
        const tender = tenders.find(t => t.id === id);
        
        // Delete all associated documents from IndexedDB
        if (tender && tender.documents && Array.isArray(tender.documents)) {
            tender.documents.forEach(doc => {
                if (doc.id) this.deleteDocumentFile(doc.id);
            });
        }

        const filtered = tenders.filter(t => t.id !== id);
        this.saveTenders(filtered);
        return true;
    }

    // --- Document Files (IndexedDB) ---

    async saveDocumentFile(docId, fileBlob, metadata) {
        await this.initIndexedDBPromise;
        if (!this.db) return false;

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([DOC_STORE], 'readwrite');
            const store = transaction.objectStore(DOC_STORE);
            const record = {
                id: docId,
                file: fileBlob,
                name: metadata.name,
                type: metadata.type,
                size: metadata.size,
                uploadedAt: new Date().toISOString()
            };
            const req = store.put(record);
            req.onsuccess = () => resolve(true);
            req.onerror = () => {
                console.error('Error saving document to IndexedDB:', req.error);
                resolve(false);
            };
        });
    }

    async getDocumentFile(docId) {
        await this.initIndexedDBPromise;
        if (!this.db) return null;

        return new Promise((resolve) => {
            const transaction = this.db.transaction([DOC_STORE], 'readonly');
            const store = transaction.objectStore(DOC_STORE);
            const req = store.get(docId);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => resolve(null);
        });
    }

    async deleteDocumentFile(docId) {
        await this.initIndexedDBPromise;
        if (!this.db) return false;

        return new Promise((resolve) => {
            const transaction = this.db.transaction([DOC_STORE], 'readwrite');
            const store = transaction.objectStore(DOC_STORE);
            const req = store.delete(docId);
            req.onsuccess = () => resolve(true);
            req.onerror = () => resolve(false);
        });
    }

    // --- Backup & Restore ---

    exportBackup() {
        const tenders = this.getTenders();
        const payload = {
            exportDate: new Date().toISOString(),
            version: '1.0',
            tenders: tenders
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tenderhub_backup_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    importBackup(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            if (parsed && Array.isArray(parsed.tenders)) {
                this.saveTenders(parsed.tenders);
                return { success: true, count: parsed.tenders.length };
            }
            throw new Error('Invalid backup file format');
        } catch (e) {
            return { success: false, error: e.message };
        }
    }
}

window.storageManager = new StorageManager();
