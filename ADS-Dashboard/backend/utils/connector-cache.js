const db = require('../database');

let connectorsCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 300000; // 5 minutes

async function loadConnectors() {
    const connectors = await db.select('connectors', ['id', 'endpoint', 'auth']);
    connectorsCache = new Map(connectors.map(c => [c.id, c]));
    cacheTimestamp = Date.now();
}

async function getConnector(connectorId) {
    if (!connectorsCache || Date.now() - cacheTimestamp > CACHE_TTL) {
        await loadConnectors();
    }
    
    const connector = connectorsCache.get(connectorId);
    if (!connector) throw new Error(`Connector ${connectorId} not found`);
    return connector;
}

function invalidateCache() {
    connectorsCache = null;
    cacheTimestamp = 0;
}

module.exports = {
    getConnector,
    invalidateCache
};