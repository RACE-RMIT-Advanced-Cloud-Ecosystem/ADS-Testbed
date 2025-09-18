import { useContext, useMemo, useCallback } from "react";
import { useStableValue } from "@utils/contextHelpers";

export const datasetsInitialState = {
    datasets: []
};

export function updateDatasetsList(state, payload) {
    if (JSON.stringify(state.datasets) === JSON.stringify(payload)) {
        return state;
    }
    return { ...state, datasets: payload };
}

export function createUseDatasets(appContext) {
    return function() {
        const { state, dispatch } = useContext(appContext);
        
        const updateDatasetsList = useCallback((datasets) => {
            dispatch({ type: 'UPDATE_DATASETS', payload: datasets });
        }, [dispatch]);

        const datasets = useStableValue(state.datasets);

        return useMemo(() => ({
            datasets,
            updateDatasetsList,
        }), [datasets, updateDatasetsList]);
    }
}