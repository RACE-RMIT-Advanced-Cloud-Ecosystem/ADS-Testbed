/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer } from 'react';
import { getInitialState, createReducer, createHooks } from './contextRegistry';
import { initializeContexts } from './registerContexts';

// Initialize all contexts
initializeContexts();

// Create context
const AppContext = createContext();
export { AppContext };

// Provider component
export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(createReducer(), getInitialState());
    
    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}

// Export all hooks dynamically
const hooks = createHooks(AppContext);
export const {
    useConnectors,
    useIdsComponentMetric,
    useSystemSettings,
    useDialog,
    useEnums,
    useDataFetch,
    useArtifacts,
    useRepresentations,
    useResources,
    useCatalogs,
    useContracts,
    useRules,
    useAgreements,
    useRequests,
    useBrokers,
    useDatasets
} = hooks;