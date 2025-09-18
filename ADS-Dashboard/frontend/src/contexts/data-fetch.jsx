import { useContext, useMemo, useCallback } from "react";
import { useStableValue } from "@utils/contextHelpers";

export const dataFetchInitialState = {
    'fetching': null,
};

export function updateDataFetching(state, payload) {
    return {
        ...state,
        'fetching': payload
    };
}

export function createUseDataFetch(appContext) {
    return function() {
        const { state, dispatch } = useContext(appContext);
        
        const updateDataFetching = useCallback((fetching) => {
            dispatch({ type: 'UPDATE_DATA_FETCHING', payload: fetching });
        }, [dispatch]);

        const fetching = useStableValue(state.fetching);
        
        return useMemo(() => ({
            fetching,
            updateDataFetching
        }), [fetching, updateDataFetching]);
    }
}