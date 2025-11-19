const DB_NAME = 'rsp_db';
const DB_VERSION = 1;

export class DBManager {
    constructor() {
        this.dbPromise = this.initDB();
    }

    async initDB() {
        return idb.openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                // Store for raw PDF files
                if (!db.objectStoreNames.contains('files')) {
                    db.createObjectStore('files', { keyPath: 'id', autoIncrement: true });
                }
                // Store for processed chunks
                if (!db.objectStoreNames.contains('chunks')) {
                    const chunkStore = db.createObjectStore('chunks', { keyPath: 'id' });
                    chunkStore.createIndex('fileId', 'fileId', { unique: false });
                }
                // Store for processing state/progress
                if (!db.objectStoreNames.contains('state')) {
                    db.createObjectStore('state', { keyPath: 'fileId' });
                }
            },
        });
    }

    async saveFile(fileObj) {
        const db = await this.dbPromise;
        return db.put('files', fileObj);
    }

    async getFile(id) {
        const db = await this.dbPromise;
        return db.get('files', id);
    }

    async getAllFiles() {
        const db = await this.dbPromise;
        return db.getAll('files');
    }

    async saveChunk(chunk) {
        const db = await this.dbPromise;
        return db.put('chunks', chunk);
    }

    async getChunks(fileId) {
        const db = await this.dbPromise;
        return db.getAllFromIndex('chunks', 'fileId', fileId);
    }

    async saveState(fileId, state) {
        const db = await this.dbPromise;
        return db.put('state', { fileId, ...state });
    }

    async getState(fileId) {
        const db = await this.dbPromise;
        return db.get('state', fileId);
    }

    async clearAll() {
        const db = await this.dbPromise;
        await db.clear('files');
        await db.clear('chunks');
        await db.clear('state');
    }
}

export const dbManager = new DBManager();
