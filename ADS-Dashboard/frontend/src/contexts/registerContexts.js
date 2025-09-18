import { registerContext } from './contextRegistry';

// Import all context configurations
import {idsComponentMetricInitialState, updateIdsComponentMetric, createUseIdsComponentMetric} from './ids-component-metric';
import { createUseSystemSettings, systemSettingsInitialState, updateSystemSettingsState } from './system-settings';
import { dialogInitialState, openDialog, closeDialog, createUseDialog } from './dialog';
import { enumsInitialState, updateEnums, createUseEnums } from './enums';
import { dataFetchInitialState, updateDataFetching, createUseDataFetch } from './data-fetch';
import { 
    connectorsInitialState, createUseConnectors, updateActiveConnector, 
    updateConnectorConnectionState, updateConnectorLastUpdate, 
    updateConnectorSelfDescription, updateConnectorsList
} from './connectors';
import {
    artifactsInitialState, representationsInitialState, resourcesInitialState, catalogsInitialState,
    contractsInitialState, rulesInitialState, agreementsInitialState, requestsInitialState, brokersInitialState,
    createUseArtifacts, createUseRepresentations, createUseResources, createUseCatalogs,
    createUseContracts, createUseRules, createUseAgreements, createUseRequests, createUseBrokers,
    updateArtifactsList, updateRepresentationsList, updateResourcesList, updateCatalogsList,
    updateContractsList, updateRulesList, updateAgreementsList, updateRequestsList, updateBrokersList
} from './dataspace-entities';
import { datasetsInitialState, updateDatasetsList, createUseDatasets } from './datasets';

// Register all contexts
export function initializeContexts() {
    // System contexts
    registerContext('IdsComponentMetric', {
        initialState: idsComponentMetricInitialState,
        actions: { 'UPDATE_IDS_COMPONENT_METRIC': updateIdsComponentMetric },
        createHook: createUseIdsComponentMetric
    });

    registerContext('SystemSettings', {
        initialState: systemSettingsInitialState,
        actions: { 'UPDATE_SYSTEM_SETTINGS': updateSystemSettingsState },
        createHook: createUseSystemSettings
    });

    registerContext('Dialog', {
        initialState: dialogInitialState,
        actions: { 
            'OPEN_DIALOG': openDialog,
            'CLOSE_DIALOG': closeDialog
        },
        createHook: createUseDialog
    });

    registerContext('Connectors', {
        initialState: connectorsInitialState,
        actions: {
            'UPDATE_CONNECTORS_LIST': updateConnectorsList,
            'UPDATE_ACTIVE_CONNECTOR': updateActiveConnector,
            'UPDATE_CONNECTOR_CONNECTION_STATE': updateConnectorConnectionState,
            'UPDATE_CONNECTOR_LAST_UPDATE': updateConnectorLastUpdate,
            'UPDATE_CONNECTOR_SELF_DESCRIPTION': updateConnectorSelfDescription
        },
        createHook: createUseConnectors
    });

    registerContext('Enums', {
        initialState: enumsInitialState,
        actions: {
            'UPDATE_ENUMS': updateEnums
        },
        createHook: createUseEnums
    });

    registerContext('DataFetch', {
        initialState: dataFetchInitialState,
        actions: {
            'UPDATE_DATA_FETCHING': updateDataFetching
        },
        createHook: createUseDataFetch
    });

    // Dataspace entities
    const dataspaceEntities = [
        { name: 'Artifacts', initialState: artifactsInitialState, updateFn: updateArtifactsList, createHook: createUseArtifacts },
        { name: 'Representations', initialState: representationsInitialState, updateFn: updateRepresentationsList, createHook: createUseRepresentations },
        { name: 'Resources', initialState: resourcesInitialState, updateFn: updateResourcesList, createHook: createUseResources },
        { name: 'Catalogs', initialState: catalogsInitialState, updateFn: updateCatalogsList, createHook: createUseCatalogs },
        { name: 'Contracts', initialState: contractsInitialState, updateFn: updateContractsList, createHook: createUseContracts },
        { name: 'Rules', initialState: rulesInitialState, updateFn: updateRulesList, createHook: createUseRules },
        { name: 'Agreements', initialState: agreementsInitialState, updateFn: updateAgreementsList, createHook: createUseAgreements },
        { name: 'Requests', initialState: requestsInitialState, updateFn: updateRequestsList, createHook: createUseRequests },
        { name: 'Brokers', initialState: brokersInitialState, updateFn: updateBrokersList, createHook: createUseBrokers }
    ];

    dataspaceEntities.forEach(({ name, initialState, updateFn, createHook }) => {
        registerContext(name, {
            initialState,
            actions: { [`UPDATE_${name.toUpperCase()}`]: updateFn },
            createHook
        });
    });

    // Datasets (separate from dataspace entities)
    registerContext('Datasets', {
        initialState: datasetsInitialState,
        actions: { 'UPDATE_DATASETS': updateDatasetsList },
        createHook: createUseDatasets
    });
}