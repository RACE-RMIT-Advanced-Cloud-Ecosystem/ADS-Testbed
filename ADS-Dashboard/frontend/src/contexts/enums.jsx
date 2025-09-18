import { useContext, useMemo, useCallback } from "react";
import { useStableValue } from "@utils/contextHelpers";

export const enumsInitialState = {
    enums: null,
};

export function updateEnums(state, payload) {
    return {
        ...state,
        enums: payload
    };
}

export function createUseEnums(appContext) {
    return function() {
        const { state, dispatch } = useContext(appContext);
        
        const updateEnums = useCallback((enums) => {
            dispatch({ type: 'UPDATE_ENUMS', payload: enums });
        }, [dispatch]);

        const enums = useStableValue(state.enums);
        
        return useMemo(() => ({
            enums,
            updateEnums
        }), [enums, updateEnums]);
    }
}