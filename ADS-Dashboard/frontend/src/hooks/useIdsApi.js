import { useConnectors } from "@contexts/AppContext";
import request, { endpointUrl, post } from "@utils/requests";
import { retrieveEndpoint } from "@utils/tools";
import { useCallback, useMemo } from "react";

export default function useIdsApi() {
    const { activeConnector } = useConnectors();

    const urlParser = useCallback((idsPath) => {
        const path = retrieveEndpoint(idsPath);
        const baseUrl = endpointUrl.endsWith('/') ? endpointUrl : endpointUrl + '/';
        return `${baseUrl}ids/${activeConnector}${path}`
    }, [activeConnector])

    const getEnums = useCallback(async () => {
        try {
            return await request(`ids/${activeConnector}/api/utils/enums`);
        } catch {
            return null;
        }
    }, [activeConnector])
    const basicIdsGet = useCallback(async (route, dataEntry = '') => {
        try {
            return await request(`ids/${activeConnector}/api/${route}`)
        } catch {
            return {_embedded: {[dataEntry || route]: []}}
        }
    }, [activeConnector])
    
    const idsGetAssociation = useCallback(async (url, dataEntry) => {
        try {
            const associationUrl = urlParser(url);
            return (await request(associationUrl))?._embedded?.[dataEntry]
        } catch {
            return []
        }
    }, [urlParser])
    
    const validateRuleType = useCallback(async (value) => {
        try {
            const result = await post(`ids/${activeConnector}/api/examples/validation`, { method: 'POST', body: value, headers: { 'Content-Type': 'application/json' } });
            return result?.value;
        } catch {
            return null;
        }
    }, [activeConnector])

    const getResourceRegisteredStatus = useCallback(async (resourceId, brokerLocation) => {
        try {
            const result = await post(`ids/${activeConnector}/resource-available`, { body: { resourceId, brokerLocation  } });
            return result?.available;
        } catch {
            return false;
        }
    }, [activeConnector])

    const getConnectorEndpoint = useCallback(async (resourceId, brokerLocation) => {
        try {
            const connector = resourceId.split('/').slice(0, 5).join('/')
            const result = await post(`ids/${activeConnector}/connector-endpoint`, { body: { connector, brokerLocation  } });
            return result?.connectorEndpoint;
        } catch {
            return false;
        }
    }, [activeConnector])

    const getResourceDescription = useCallback(async (connectorEndpoint, resourceId) => {
        try {
            const params = new URLSearchParams({
                recipient: connectorEndpoint,
                elementId: resourceId
            })
            const desc = await post(`ids/${activeConnector}/api/ids/description?${params.toString()}`);
            return desc;
        } catch (error) {
            console.error(error);
            return null;
        }
    }, [activeConnector])
    // ================================================
    // IDS CREATE
    // ================================================
    const createAsset = useCallback(async ({ title, description, mediaType, language, value, accessUrl, basicAuth, apiKey }) => {
        const representationInput = {
            title, description, mediaType, language
        }
    
        const artifactInput = {
            title, description, automatedDownload: false
        }
    
        if (value) {
            artifactInput.value = value;
        } else {
            artifactInput.accessUrl = accessUrl;
            if (basicAuth) artifactInput.basicAuth = basicAuth;
            if (apiKey) artifactInput.apiKey = apiKey;
        }
    
        try {
            const representation = await post(`ids/${activeConnector}/api/representations`, { body: representationInput })
            const artifact = await post(`ids/${activeConnector}/api/artifacts`, { body: artifactInput })
    
            const associateUrl = `${endpointUrl}ids/${activeConnector}${new URL(representation._links.self.href).pathname}/artifacts`;
            const associationBody = [ `${endpointUrl}ids/${activeConnector}${new URL(artifact._links.self.href).pathname}` ]
    
            await post(associateUrl, { body: associationBody });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }, [activeConnector])
    
    const createPolicy = useCallback(async ({ title, description, type, ...props }) => {
        try {
            const ruleInput = { title, description, type, ...props };
            const ruleValue = await post(`ids/${activeConnector}/api/examples/policy`, { body: ruleInput })
            const createRuleInput = {
                title, description, value: JSON.stringify(ruleValue)
            }
            await post(`ids/${activeConnector}/api/rules`, { body: createRuleInput });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }, [activeConnector])
    
    const createResource = useCallback(async (params) => {
        try {
            const resource = await post(`ids/${activeConnector}/api/offers`, { body: params })
            return resource._links.self.href;
        } catch (error) {
            console.error(error);
            return null;
        }
    }, [activeConnector])
    
    const basicCreate = useCallback(async (endpoint, params) => {
        try {
            await post(`ids/${activeConnector}/api/${endpoint}`, { body: params })
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }, [activeConnector])
    
    const createContracts = useCallback(async (params) => {
        return await basicCreate('contracts', params)
    }, [basicCreate])
    
    const createCatalogs = useCallback(async (params) => {
        return await basicCreate('catalogs', params)
    }, [basicCreate])
    
    const createBroker = useCallback(async (params) => {
        return await basicCreate('brokers', params)
    }, [basicCreate])
    
    const registerUnregisterBroker = useCallback(async (status, url) => {
        try {
            await post(`ids/${activeConnector}/api/ids/connector/${status ? 'unavailable' : 'update'}?recipient=${url}`, undefined, { parseResponse: false });
            return true;
        } catch (error) {
            throw new Error(`${error.cause.error.message} - ${error.cause.error.details.payload}`)
        }
    }, [activeConnector])
    // ================================================
    // IDS ASSOCIATION
    // ================================================
    const associate = useCallback(async (requestUrl, entities) => {
        try {
            await post(urlParser(requestUrl), { body: entities.map(urlParser) });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }, [urlParser])
    
    const altRegisterResource = useCallback(async (registered, brokerLocation, resourceId) => {
        try {
            const endpoint = registered ? 'unavailable' : 'update'
            await post(
                `ids/${activeConnector}/api/ids/resource/${endpoint}?recipient=${encodeURIComponent(brokerLocation)}&resourceId=${resourceId}`,
                undefined,
                { parseResponse: false }
            );
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }, [activeConnector])
    
    const brokerSearch = useCallback(async (brokerLocation, value, by = 'keyword') => {
        try {
            if (!brokerLocation || !value) return null;
            return await post(`ids/${activeConnector}/search`, { 
                body: { brokerLocation, value, by }
            });
        } catch (error) {
            console.error(error);
            return null;
        }
    }, [activeConnector])

    const requestResource = useCallback(async (connectorEndpoint, resourceIds, artifactIds, download, body) => {
        try {
            const params = new URLSearchParams();
            params.append('recipient', connectorEndpoint);
            
            // Handle resourceIds (string or array)
            if (Array.isArray(resourceIds)) {
                resourceIds.forEach(id => params.append('resourceIds', id));
            } else {
                params.append('resourceIds', resourceIds);
            }
            
            // Handle artifactIds (string or array)
            if (Array.isArray(artifactIds)) {
                artifactIds.forEach(id => params.append('artifactIds', id));
            } else {
                params.append('artifactIds', artifactIds);
            }
            
            params.append('download', download);
            
            const result = await post(`ids/${activeConnector}/api/ids/contract?${params.toString()}`, { body });
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }, [activeConnector])
    // ================================================
    // IDS DELETION
    // ================================================
    const deleteEntity = useCallback(async (url) => {
        try {
            await request(urlParser(url), { method: 'DELETE' }, { parseResponse: false });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }, [urlParser])

    return useMemo(() => ({
        urlParser,
        getEnums,
        basicIdsGet,
        idsGetAssociation,
        validateRuleType,
        getResourceRegisteredStatus,
        getConnectorEndpoint,
        getResourceDescription,
        createAsset,
        createPolicy,
        createResource,
        createContracts,
        createCatalogs,
        createBroker,
        registerUnregisterBroker,
        altRegisterResource,
        associate,
        brokerSearch,
        requestResource,
        deleteEntity
    }), [
        urlParser,
        getEnums,
        basicIdsGet,
        idsGetAssociation,
        validateRuleType,
        getResourceRegisteredStatus,
        getConnectorEndpoint,
        getResourceDescription,
        createAsset,
        createPolicy,
        createResource,
        createContracts,
        createCatalogs,
        createBroker,
        registerUnregisterBroker,
        altRegisterResource,
        associate,
        brokerSearch,
        requestResource,
        deleteEntity
    ]);
}