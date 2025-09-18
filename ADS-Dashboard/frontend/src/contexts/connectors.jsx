import { useContext, useMemo, useCallback } from "react";
import { useStableValue } from "@utils/contextHelpers";

export const connectorsInitialState = {
    'connectors': [],
    'active-connector': null,
    'connector-conn-status': {},
    'connector-last-update': null,
    'connector-self-description': {}
}

export function updateConnectorsList(state, payload) {
    return {
        ...state,
        'connectors': payload
    };
}

export function updateActiveConnector(state, payload) {
    return {
        ...state,
        'active-connector': payload
    };
}

export function updateConnectorConnectionState(state, {connectorId, connStatus}) {
    if (state['connector-conn-status'][connectorId] === connStatus) {
        return state;
    }
    return {
        ...state,
        'connector-conn-status': {...state['connector-conn-status'], [connectorId]: connStatus}
    };
}

export function updateConnectorLastUpdate(state) {
    return {
        ...state,
        'connector-last-update': Date.now()
    };
}

export function updateConnectorSelfDescription(state, payload) {
    return {
        ...state,
        'connector-self-description': payload
    }
}

export function createUseConnectors(appContext) {
    return function() {
        const { state, dispatch } = useContext(appContext);
          
        const updateConnectorsList = useCallback((connectors) => 
            dispatch({ type: 'UPDATE_CONNECTORS_LIST', payload: connectors }), [dispatch]);
        const updateActiveConnector = useCallback((connectorId) => 
            dispatch({ type: 'UPDATE_ACTIVE_CONNECTOR', payload: connectorId }), [dispatch]);
        const updateConnectorConnectionState = useCallback((connectorId, connStatus) => 
            dispatch({ type: 'UPDATE_CONNECTOR_CONNECTION_STATE', payload: {connectorId, connStatus} }), [dispatch]);
        const updateConnectorLastUpdate = useCallback(() => 
            dispatch({ type: 'UPDATE_CONNECTOR_LAST_UPDATE', payload: null }), [dispatch]);
        const updateConnectorSelfDescription = useCallback(() => 
            dispatch({ type: 'UPDATE_CONNECTOR_SELF_DESCRIPTION', payload: null }), [dispatch]);

        const connectors = useStableValue(state['connectors']);
        const activeConnector = useStableValue(state['active-connector']);
        const connectStatus = useStableValue(state['connector-conn-status']);
        const lastUpdated = useStableValue(state['connector-last-update']);
        const selfDescription = useStableValue(state[['connector-self-description']]);

        return useMemo(() => ({
            connectors,
            activeConnector,
            connectStatus,
            lastUpdated,
            selfDescription,
            updateConnectorsList,
            updateActiveConnector,
            updateConnectorConnectionState,
            updateConnectorLastUpdate,
            updateConnectorSelfDescription
        }), [
            connectors,
            activeConnector,
            connectStatus,
            lastUpdated,
            selfDescription,
            updateConnectorsList,
            updateActiveConnector,
            updateConnectorConnectionState,
            updateConnectorLastUpdate,
            updateConnectorSelfDescription
        ]);
    }
}