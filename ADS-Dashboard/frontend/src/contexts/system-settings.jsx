import { useContext, useMemo, useCallback } from "react";
import { useStableValue } from "@utils/contextHelpers";

const settings = JSON.parse(localStorage.getItem('system-settings') || JSON.stringify({
    'date-format': 'au',
    'auto-refresh-interval': 60000,
    'active-connector': ''
}))

export const systemSettingsInitialState = {
    'system-settings': settings
}

export function updateSystemSettingsState(state, payload) {
    localStorage.setItem('system-settings', JSON.stringify({ ...state['system-settings'], ...payload }));
    return {
        ...state,
        'system-settings': { ...state['system-settings'], ...payload }
    };
}

export function createUseSystemSettings(appContext) {
    return function() {
        const { state, dispatch } = useContext(appContext);
          
        const updateSystemSettings = useCallback(payload => {
            dispatch({ type: 'UPDATE_SYSTEM_SETTINGS', payload });
        }, [dispatch]);

        const settings = useStableValue(state['system-settings']);
        
        return useMemo(() => ({
            settings,
            updateSystemSettings
        }), [settings, updateSystemSettings]);
    }
}