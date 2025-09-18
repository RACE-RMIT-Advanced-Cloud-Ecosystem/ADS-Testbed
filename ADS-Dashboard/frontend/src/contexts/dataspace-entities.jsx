import { useContext, useMemo, useCallback } from "react";
import { useStableValue } from "@utils/contextHelpers";

// Initial states
export const artifactsInitialState = { artifacts: [] };
export const representationsInitialState = { representations: [] };
export const resourcesInitialState = { resources: [] };
export const catalogsInitialState = { catalogs: [] };
export const contractsInitialState = { contracts: [] };
export const rulesInitialState = { rules: [] };
export const agreementsInitialState = { agreements: [] };
export const requestsInitialState = { requests: [] };
export const brokersInitialState = { brokers: [] };

// Update functions
export function updateArtifactsList(state, payload) {
    if (JSON.stringify(state.artifacts) === JSON.stringify(payload)) {
        return state;
    }
    return { ...state, artifacts: payload };
}

export function updateRepresentationsList(state, payload) {
    if (JSON.stringify(state.representations) === JSON.stringify(payload)) {
        return state;
    }
    return { ...state, representations: payload };
}

export function updateResourcesList(state, payload) {
    if (JSON.stringify(state.resources) === JSON.stringify(payload)) {
        return state;
    }
    return { ...state, resources: payload };
}

export function updateCatalogsList(state, payload) {
    if (JSON.stringify(state.catalogs) === JSON.stringify(payload)) {
        return state;
    }
    return { ...state, catalogs: payload };
}

export function updateContractsList(state, payload) {
    if (JSON.stringify(state.contracts) === JSON.stringify(payload)) {
        return state;
    }
    return { ...state, contracts: payload };
}

export function updateRulesList(state, payload) {
    if (JSON.stringify(state.rules) === JSON.stringify(payload)) {
        return state;
    }
    return { ...state, rules: payload };
}

export function updateAgreementsList(state, payload) {
    if (JSON.stringify(state.agreements) === JSON.stringify(payload)) {
        return state;
    }
    return { ...state, agreements: payload };
}

export function updateRequestsList(state, payload) {
    if (JSON.stringify(state.requests) === JSON.stringify(payload)) {
        return state;
    }
    return { ...state, requests: payload };
}

export function updateBrokersList(state, payload) {
    if (JSON.stringify(state.brokers) === JSON.stringify(payload)) {
        return state;
    }
    return { ...state, brokers: payload };
}

// Hook creators
export function createUseArtifacts(appContext) {
    return function() {
        const { state, dispatch } = useContext(appContext);
        
        const updateArtifactsList = useCallback((artifacts) => {
            dispatch({ type: 'UPDATE_ARTIFACTS', payload: artifacts });
        }, [dispatch]);

        const artifacts = useStableValue(state.artifacts);

        return useMemo(() => ({
            artifacts,
            updateArtifactsList,
        }), [artifacts, updateArtifactsList]);
    }
}

export function createUseRepresentations(appContext) {
    return function() {
        const { state, dispatch } = useContext(appContext);
        
        const updateRepresentationsList = useCallback((representations) => {
            dispatch({ type: 'UPDATE_REPRESENTATIONS', payload: representations });
        }, [dispatch]);

        const representations = useStableValue(state.representations);

        return useMemo(() => ({
            representations,
            updateRepresentationsList,
        }), [representations, updateRepresentationsList]);
    }
}

export function createUseResources(appContext) {
    return function() {
        const { state, dispatch } = useContext(appContext);
        
        const updateResourcesList = useCallback((resources) => {
            dispatch({ type: 'UPDATE_RESOURCES', payload: resources });
        }, [dispatch]);

        const resources = useStableValue(state.resources);

        return useMemo(() => ({
            resources,
            updateResourcesList,
        }), [resources, updateResourcesList]);
    }
}

export function createUseCatalogs(appContext) {
    return function() {
        const { state, dispatch } = useContext(appContext);
        
        const updateCatalogsList = useCallback((catalogs) => {
            dispatch({ type: 'UPDATE_CATALOGS', payload: catalogs });
        }, [dispatch]);

        const catalogs = useStableValue(state.catalogs);

        return useMemo(() => ({
            catalogs,
            updateCatalogsList,
        }), [catalogs, updateCatalogsList]);
    }
}

export function createUseContracts(appContext) {
    return function() {
        const { state, dispatch } = useContext(appContext);
        
        const updateContractsList = useCallback((contracts) => {
            dispatch({ type: 'UPDATE_CONTRACTS', payload: contracts });
        }, [dispatch]);

        const contracts = useStableValue(state.contracts);

        return useMemo(() => ({
            contracts,
            updateContractsList,
        }), [contracts, updateContractsList]);
    }
}

export function createUseRules(appContext) {
    return function() {
        const { state, dispatch } = useContext(appContext);
        
        const updateRulesList = useCallback((rules) => {
            dispatch({ type: 'UPDATE_RULES', payload: rules });
        }, [dispatch]);

        const rules = useStableValue(state.rules);

        return useMemo(() => ({
            rules,
            updateRulesList,
        }), [rules, updateRulesList]);
    }
}

export function createUseAgreements(appContext) {
    return function() {
        const { state, dispatch } = useContext(appContext);
        
        const updateAgreementsList = useCallback((agreements) => {
            dispatch({ type: 'UPDATE_AGREEMENTS', payload: agreements });
        }, [dispatch]);

        const agreements = useStableValue(state.agreements);

        return useMemo(() => ({
            agreements,
            updateAgreementsList,
        }), [agreements, updateAgreementsList]);
    }
}

export function createUseRequests(appContext) {
    return function() {
        const { state, dispatch } = useContext(appContext);
        
        const updateRequestsList = useCallback((requests) => {
            dispatch({ type: 'UPDATE_REQUESTS', payload: requests });
        }, [dispatch]);

        const requests = useStableValue(state.requests);

        return useMemo(() => ({
            requests,
            updateRequestsList,
        }), [requests, updateRequestsList]);
    }
}

export function createUseBrokers(appContext) {
    return function() {
        const { state, dispatch } = useContext(appContext);
        
        const updateBrokersList = useCallback((brokers) => {
            dispatch({ type: 'UPDATE_BROKERS', payload: brokers });
        }, [dispatch]);

        const brokers = useStableValue(state.brokers);

        return useMemo(() => ({
            brokers,
            updateBrokersList,
        }), [brokers, updateBrokersList]);
    }
}