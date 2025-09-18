const { getConnector } = require('../utils/connector-cache');
const { searchByKeyword, searchByBaseIdsExact, searchByBaseId } = require('../utils/ids');
const { formatValue } = require("../utils/tools");

const searchHandler = async (req, res) => {
    const { connectorId } = req.params;
    const { brokerLocation, value, by, limit = 100, offset = 0 } = req.body;

    try {
        const { endpoint, auth } = await getConnector(connectorId);
        const headers = { 'accept': '*/*', 'Content-Type': 'application/json', 'authorization': auth };
        const baseUrl = `${endpoint}/api/ids`;
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        
        let results;
        if (by === 'keyword') {
            results = await searchByBaseIdsExact(
                await searchByKeyword(value, baseUrl, headers, brokerLocation, limit, offset),
                baseUrl,
                headers,
                brokerLocation
            )
        } else if (by === 'id') {
            results = await searchByBaseId(value, baseUrl, headers, brokerLocation);
        }
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        res.status(200).json(results);
    } catch (error) {
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        res.status(500).json({ error: error.message });
    }
}

const connectorEndpointHandler = async (req, res) => {
    const { connectorId } = req.params;
    const { brokerLocation, connector } = req.body;

    try {
        const { endpoint, auth } = await getConnector(connectorId);
        const headers = { 'accept': '*/*', 'Content-Type': 'application/json', 'authorization': auth };
        const baseUrl = `${endpoint}/api/ids`;
        
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        
        const sparqlQuery = `SELECT ?res
WHERE {
  ?resultUri <https://w3id.org/idsa/core/hasDefaultEndpoint> ?connectorEndpoint
  FILTER (STRSTARTS(STR(?resultUri), "${connector}"))

  ?connectorEndpoint <https://w3id.org/idsa/core/accessURL> ?res
}`;
        
        const queryUrl = `${baseUrl}/query?recipient=${encodeURIComponent(brokerLocation)}`;
        const response = await fetch(queryUrl, {
            method: 'POST',
            headers,
            body: sparqlQuery
        });
        
        if (!response.ok) {
            delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
            return res.status(response.status).json({ error: `HTTP ${response.status}` });
        }
        
        const result = await response.text();
        const connectorEndpoint = formatValue(result.split('\n')[1].trim())
        
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        res.json({ connectorEndpoint });
    } catch (error) {
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        res.status(500).json({ error: error.message });
    }
}

const resourceExistHandler = async (req, res) => {
    const { connectorId } = req.params;
    const { brokerLocation, resourceId } = req.body;

    try {
        const { endpoint, auth } = await getConnector(connectorId);
        const headers = { 'accept': '*/*', 'Content-Type': 'application/json', 'authorization': auth };
        const baseUrl = `${endpoint}/api/ids`;
        
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        
        const sparqlQuery = `ASK WHERE {
  ?resultUri <http://www.w3.org/2002/07/owl#sameAs> ?sameAsUri .
  FILTER(CONTAINS(STR(?sameAsUri), "${resourceId}"))
}`;
        
        const queryUrl = `${baseUrl}/query?recipient=${encodeURIComponent(brokerLocation)}`;
        const response = await fetch(queryUrl, {
            method: 'POST',
            headers,
            body: sparqlQuery
        });
        
        if (!response.ok) {
            delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
            return res.status(response.status).json({ error: `HTTP ${response.status}` });
        }
        
        const result = await response.text();
        const available = result.trim() === 'true';
        
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        res.json({ available });
    } catch (error) {
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        res.status(500).json({ error: error.message });
    }
}

const allHandler = async (req, res) => {
    try {
        const { connectorId, path } = req.params;
        const { endpoint, auth } = await getConnector(connectorId);

        const fullPath = Array.isArray(path) ? path.join('/') : path;
        const url = new URL(`${endpoint}/${fullPath || ''}`);
        Object.entries(req.query).forEach(([key, value]) => url.searchParams.set(key, value));
        
        // Temporarily disable SSL verification
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        
        const response = await fetch(url, {
            method: req.method,
            body: req.body ? JSON.stringify(req.body) : undefined,
            headers: { ...req.headers, authorization: auth }
        });
        
        // Re-enable SSL verification
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.log(errorData)
            return res.status(response.status).json({
                error: errorData || `HTTP ${response.status}`
            });
        }
        
        // Forward headers
        response.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });
        
        res.status(response.status);
        
        if (response.body) {
            const reader = response.body.getReader();
            const pump = () => {
                return reader.read().then(({ done, value }) => {
                    if (done) return;
                    res.write(value);
                    return pump();
                });
            };
            
            await pump();
        }
        
        res.end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    searchHandler, resourceExistHandler, allHandler, connectorEndpointHandler
}