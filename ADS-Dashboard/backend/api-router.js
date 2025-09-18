const express = require('express');

const { searchHandler, allHandler, resourceExistHandler, connectorEndpointHandler } = require("./actions/ids");
const { getConnectors, addConnector, removeConnector } = require('./actions/system');
const { upload, uploadDataset, getDatasets, getDataset, updateDataset, deleteDataset } = require('./actions/datasets');

function createApiRouter() {
    const router = express.Router();
    
    // ids
    router.post('/ids/:connectorId/search', searchHandler);
    router.post('/ids/:connectorId/resource-available', resourceExistHandler);
    router.post('/ids/:connectorId/connector-endpoint', connectorEndpointHandler);
    router.all('/ids/:connectorId{/*path}', allHandler);

    // connectors
    router.get('/system/connectors', getConnectors);
    router.put('/system/connectors', addConnector);
    router.delete('/system/connectors/:id', removeConnector);
    
    // datasets
    router.post('/system/datasets/:connectorId', upload, uploadDataset);
    router.get('/system/datasets/:connectorId', getDatasets);
    router.get('/system/datasets/:connectorId/:id', getDataset);
    router.put('/system/datasets/:connectorId/:id', updateDataset);
    router.delete('/system/datasets/:connectorId/:id', deleteDataset);
    
    return router;
}

module.exports = createApiRouter;