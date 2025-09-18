import { useContext, useMemo, useCallback } from "react";
import { useStableValue } from "@utils/contextHelpers";

export const dialogInitialState = {
    'dialog': {},
    'dialog-data': {},
}

export function openDialog(state, {dialogId, data = null}) {
    if (!dialogId || state['dialog'][dialogId] ) return state;

    return {
        ...state,
        'dialog': { ...state['dialog'], [dialogId]: true },
        'dialog-data': { ...state['dialog-data'], [dialogId]: data }
    };
}

export function closeDialog(state, {dialogId}) {
    if (!dialogId) return state;
    const { [dialogId]: _, ...newDialogData } = state['dialog-data'];
    return {
        ...state,
        'dialog': { ...state['dialog'], [dialogId]: false },
        'dialog-data': newDialogData
    };
}

export function createUseDialog(appContext) {
    return function() {
        const { state, dispatch } = useContext(appContext);
        
        const openDialog = useCallback((dialogId, data = null) => {
            dispatch({ type: 'OPEN_DIALOG', payload: { dialogId, data } });
        }, [dispatch]);
        
        const closeDialog = useCallback((dialogId) => {
            dispatch({ type: 'CLOSE_DIALOG', payload: { dialogId } });
        }, [dispatch]);

        const dialogs = useStableValue(state['dialog']);
        const dialogData = useStableValue(state['dialog-data']);
        
        return useMemo(() => ({
            dialogs,
            dialogData,
            openDialog,
            closeDialog
        }), [dialogs, dialogData, openDialog, closeDialog]);
    }
}