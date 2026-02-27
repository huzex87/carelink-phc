import PouchDB from './pouchdb-init';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);

// Local Database Initialization
export const db = new PouchDB('carelink_phc_local');

/**
 * Configure Synchronization with CouchDB
 * @param remoteUrl - The URL of the CouchDB instance
 */
export const syncWithRemote = (remoteUrl: string) => {
    const remoteDB = new PouchDB(remoteUrl);

    return db.sync(remoteDB, {
        live: true,
        retry: true
    })
        .on('change', (info) => {
            console.log('🔄 Change detected:', info);
        })
        .on('paused', (err) => {
            console.log('💤 Sync paused', err ? `(err: ${err})` : '');
        })
        .on('active', () => {
            console.log('⚡ Sync active');
        })
        .on('error', (err) => {
            console.error('❌ Sync error:', err);
        });
};

export default db;
