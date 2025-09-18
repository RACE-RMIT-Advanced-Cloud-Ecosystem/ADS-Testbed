import request, {post} from "./requests";

// ================================================
// CONNECTORS
// ================================================

export async function getConnectors() {
    return await request('system/connectors');
}

export async function addConnector(
    { name, endpoint, username = '', password, id = '', auth }
) {
    const body = {
        id,
        name,
        endpoint,
        username,
    };

    if (password !== undefined) {
        // New password provided or creating new connector
        if (username || password) {
            body.auth = `Basic ${btoa(`${username}:${password}`)}`;
        }
    } else if (auth) {
        body.auth = auth;
    }

    try {
        const {id} = await request('system/connectors', { method: 'PUT', body })
        return { ...body, id }
    } catch (error) {
        console.error(error);
        return {error}
    }
}

export async function deleteConnector(connectorId) {
    try {
        await request(`system/connectors/${connectorId}`, { method: 'DELETE' }, { parseResponse: false });
        return true;
    } catch (error) {
        console.error(error);
        return false
    }
}

export async function getConnectorSelfDescription(id) {
    try {
        const selfDesc = await request(`ids/${id}/`);
        return selfDesc;
    } catch {
        return null;
    }
}

// ================================================
// DATASETS
// ================================================

export async function uploadDataset(connectorId, file, title, description) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description || '');
    
    const response = await post(`system/datasets/${connectorId}`, {
        method: 'POST',
        body: formData
    }, { parseBody: false });
    return response;
}

export async function getDatasets(connectorId) {
    return await request(`system/datasets/${connectorId}`);
}

export async function updateDataset(connectorId, datasetId, title, description) {
    return await request(`system/datasets/${connectorId}/${datasetId}`, {
        method: 'PUT',
        body: { title, description }
    });
}

export async function deleteDataset(connectorId, datasetId) {
    return await request(`system/datasets/${connectorId}/${datasetId}`, { method: 'DELETE' });
}