import { useContext, useMemo, useCallback } from "react";
import { useStableValue } from "@utils/contextHelpers";

export const idsComponentMetricInitialState = {
    'ids-components-metric': {}
}

export function updateIdsComponentMetric(state, payload) {
    const { component, value } = payload;
    const altValue = component === '*' ? value : { [component]: value };

    return {
        ...state,
        'ids-components-metric': { ...state['ids-components-metric'], ...altValue }
    };
}

export function createUseIdsComponentMetric(appContext) {
    return function() {
        const { state, dispatch } = useContext(appContext);
          
        const updateIdsComponentMetric = useCallback((component, value) => {
            dispatch({ type: 'UPDATE_IDS_COMPONENT_METRIC', payload: { component, value } });
        }, [dispatch]);

        const metrics = useStableValue(state['ids-components-metric']);
        
        return useMemo(() => ({
            metrics,
            updateIdsComponentMetric
        }), [metrics, updateIdsComponentMetric]);
    }
}