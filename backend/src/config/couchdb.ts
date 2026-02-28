import { request } from 'http';

const COUCHDB_URL = process.env.COUCHDB_URL || 'http://admin:password@localhost:5984';
const DB_NAME = 'carelink_sync';

export const initCouchDB = async () => {
    console.log(`[CouchDB] Initializing Sync Gateway connection...`);
    try {
        // Simple check/create database routine using fetch API
        const response = await fetch(`${COUCHDB_URL}/${DB_NAME}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
            }
        });

        if (response.ok || response.status === 201) {
            console.log(`[CouchDB] Database '${DB_NAME}' created successfully.`);
        } else if (response.status === 412) {
            console.log(`[CouchDB] Database '${DB_NAME}' already exists. Ready for sync.`);
        } else {
            console.warn(`[CouchDB] Unexpected response: ${response.statusText}`);
        }

        // Setup security object for the database to ensure only authenticated users can sync
        const securityDoc = {
            admins: { names: ["admin"], roles: ["_admin"] },
            members: { names: [], roles: ["provider", "manager"] } // RBAC sync
        };

        const secResponse = await fetch(`${COUCHDB_URL}/${DB_NAME}/_security`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(securityDoc)
        });

        if (secResponse.ok) {
            console.log(`[CouchDB] Sync Gateway security permissions applied.`);
        }
    } catch (error) {
        console.error(`[CouchDB] Connection failed. Is CouchDB running at ${COUCHDB_URL}?`, error);
        // Do not crash the server if CouchDB is unreachable in dev mode, but log clearly.
    }
};
