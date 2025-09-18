import { 
    useConnectors, useArtifacts, useRepresentations, useResources, 
    useCatalogs, useContracts, useRules, useAgreements, useRequests, useBrokers,
    useIdsComponentMetric, useDataFetch, useDatasets
} from '@contexts/AppContext';
import { useCallback, useMemo } from 'react';
import { getConnectorSelfDescription, getDatasets } from '../utils/api';
import { fetchAllConnectorData } from '../utils/dataFetcher';
import useIdsApi from './useIdsApi';

export default function useUpdate() {
    const { updateDataFetching } = useDataFetch();
    const { connectors, activeConnector, updateConnectorSelfDescription, updateConnectorConnectionState, updateConnectorLastUpdate } = useConnectors();
    const { updateArtifactsList } = useArtifacts();
    const { updateRepresentationsList } = useRepresentations();
    const { updateResourcesList } = useResources();
    const { updateCatalogsList } = useCatalogs();
    const { updateContractsList } = useContracts();
    const { updateRulesList } = useRules();
    const { updateAgreementsList } = useAgreements();
    const { updateRequestsList } = useRequests();
    const { updateBrokersList } = useBrokers();
    const { updateDatasetsList } = useDatasets();
    const { updateIdsComponentMetric } = useIdsComponentMetric();
    const { basicIdsGet, validateRuleType } = useIdsApi();

    const updateArtifacts = useCallback(async () => {
        const artifacts = (await basicIdsGet('artifacts', 'artifacts'))._embedded?.artifacts
        updateArtifactsList(artifacts);
        updateIdsComponentMetric('artifact', artifacts.length);
    }, [basicIdsGet, updateArtifactsList, updateIdsComponentMetric]);

    const updateRepresentations = useCallback(async () => {
        const representations = (await basicIdsGet('representations', 'representations'))._embedded?.representations
        updateRepresentationsList(representations);
        updateIdsComponentMetric('representation', representations.length);
    }, [basicIdsGet, updateRepresentationsList, updateIdsComponentMetric]);

    const updateResources = useCallback(async () => {
        const resources = (await basicIdsGet('offers', 'resources'))._embedded?.resources
        updateResourcesList(resources);
        updateIdsComponentMetric('resource', resources.length);
    }, [basicIdsGet, updateResourcesList, updateIdsComponentMetric]);

    const updateCatalogs = useCallback(async () => {
        const catalogs = (await basicIdsGet('catalogs', 'catalogs'))._embedded?.catalogs
        updateCatalogsList(catalogs);
        updateIdsComponentMetric('catalog', catalogs.length);
    }, [basicIdsGet, updateCatalogsList, updateIdsComponentMetric]);

    const updateContracts = useCallback(async () => {
        const contracts = (await basicIdsGet('contracts', 'contracts'))._embedded?.contracts
        updateContractsList(contracts);
        updateIdsComponentMetric('contract', contracts.length);
    }, [basicIdsGet, updateContractsList, updateIdsComponentMetric]);

    const updateAgreements = useCallback(async () => {
        const agreements = (await basicIdsGet('agreements', 'agreements'))._embedded?.agreements
        updateAgreementsList(agreements);
        const confirmedAgreements = agreements.filter(e=>e.confirmed).length;
        updateIdsComponentMetric('agreement', agreements.length);
        updateIdsComponentMetric('agreement-confirmed', confirmedAgreements);
    }, [basicIdsGet, updateAgreementsList, updateIdsComponentMetric]);

    const updateRequests = useCallback(async () => {
        const requests = (await basicIdsGet('requests', 'resources'))._embedded?.resources
        updateRequestsList(requests);
        updateIdsComponentMetric('request', requests.length);
    }, [basicIdsGet, updateRequestsList, updateIdsComponentMetric]);

    const updateRules = useCallback(async () => {
        const rules = (await basicIdsGet('rules', 'rules'))._embedded?.rules;
        updateRulesList(await Promise.all(rules.map(async rule => {
            let type = null;
            try {
                type = await validateRuleType(JSON.parse(rule.value));
            } catch { /* empty */ }
            return { ...rule, type: type || 'UNKNOWN' };
        })));
        updateIdsComponentMetric('policy', rules.length);
    }, [basicIdsGet, validateRuleType, updateRulesList, updateIdsComponentMetric]);

    const updateBrokers = useCallback(async () => {
        const brokers = (await basicIdsGet('brokers', 'brokers'))._embedded?.brokers;
        updateBrokersList(brokers);
        updateIdsComponentMetric('broker', brokers.length);
    }, [basicIdsGet, updateBrokersList, updateIdsComponentMetric]);

    const updateDatasets = useCallback(async () => {
        const datasets = await getDatasets(activeConnector);
        updateDatasetsList(datasets);
    }, [activeConnector, updateDatasetsList]);

    const updateConnectors = useCallback(async () => {
        await Promise.all(connectors.map(async ({id}) => {
            const connectionState = !! await getConnectorSelfDescription(id);
            updateConnectorConnectionState(id, connectionState);
        }));
        updateConnectorLastUpdate();
    }, [connectors, updateConnectorConnectionState, updateConnectorLastUpdate]);

    const updateAll = useCallback(async () => {
        updateDataFetching(true);
        try {
            const data = await fetchAllConnectorData(activeConnector, { basicIdsGet, validateRuleType });
            if (!data) return;

            updateConnectorSelfDescription(data.selfDescription);
            updateArtifactsList(data.artifacts);
            updateRepresentationsList(data.representations);
            updateResourcesList(data.resources);
            updateCatalogsList(data.catalogs);
            updateContractsList(data.contracts);
            updateAgreementsList(data.agreements);
            updateRequestsList(data.requests);
            updateBrokersList(data.brokers);
            updateRulesList(data.rules);
            updateIdsComponentMetric("*", data.metrics);
            await updateConnectors();
        } finally {
            updateDataFetching(false);
        }
    }, [
        updateDataFetching, activeConnector, basicIdsGet, 
        validateRuleType, updateConnectorSelfDescription, updateArtifactsList, 
        updateRepresentationsList, updateResourcesList, updateCatalogsList, 
        updateContractsList, updateAgreementsList, updateRequestsList, 
        updateBrokersList, updateRulesList, updateIdsComponentMetric, updateConnectors
    ]);

    return useMemo(() => ({
        updateArtifacts,
        updateRepresentations,
        updateResources,
        updateCatalogs,
        updateContracts,
        updateAgreements,
        updateRequests,
        updateRules,
        updateBrokers,
        updateDatasets,
        updateConnectors,
        updateAll
    }), [
        updateArtifacts,
        updateRepresentations, 
        updateResources,
        updateCatalogs,
        updateContracts,
        updateAgreements,
        updateRequests,
        updateRules,
        updateBrokers,
        updateDatasets,
        updateConnectors,
        updateAll
    ]);}