const db = require("../database")
const { v4: uuidv4 } = require('uuid');
const { invalidateCache } = require('../utils/connector-cache');

const getConnectors = async (req, res) => {
    const connectors = await db.select('connectors', '*');
    res.json(connectors);
}

const addConnector = async (req, res) => {
    const {
        name, endpoint, username, auth
    } = req.body;

    const id = req.body.id || uuidv4();

    const putItem = {
        id, name, endpoint, username, auth 
    }
     
    const result = await db.put('connectors', putItem);

    if (result.changes > 0) {
        invalidateCache();
        res.json({ id });
    } else {
        res.status(500).json({ error: 'Failed to add connector' });
    }
}

const removeConnector = async (req, res) => {
    const { id } = req.params;
    
    const result = await db.run('DELETE FROM connectors WHERE id = ?', [id]);
    
    if (result.changes > 0) {
        invalidateCache();
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Connector not found' });
    }
}

module.exports = {
    getConnectors, addConnector, removeConnector
}