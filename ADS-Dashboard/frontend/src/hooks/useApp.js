import { useCallback, useEffect, useRef } from 'react';
import { 
    useConnectors, useSystemSettings, useEnums
} from '@contexts/AppContext';

import { getConnectors } from '@utils/api';
import useIdsApi from './useIdsApi';
import useUpdate from './useUpdate';

export default function useApp() {
    const { settings } = useSystemSettings();
    const { activeConnector, updateConnectorsList, updateActiveConnector } = useConnectors();
    const { updateEnums } = useEnums();
    const { getEnums } = useIdsApi();
    const { updateConnectors, updateDatasets, updateAll } = useUpdate();
    
    const initialized = useRef(false);

    const initialLoad = useCallback(async () => {
        if (initialized.current) return;
        
        try {
            const connectors = await getConnectors();
            if (connectors) {
                updateConnectorsList(connectors);
                const activeConnector = settings['active-connector'] ?? '';
                const exists = connectors.find(c => c.id === activeConnector);
                updateActiveConnector(activeConnector && exists ? activeConnector : connectors[0]?.id);
                initialized.current = true;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [updateActiveConnector, updateConnectorsList, settings]);

    useEffect(() => {
        initialLoad();
    }, [initialLoad]);

    useEffect(() => {
        if (!settings['auto-refresh-interval'] || settings['auto-refresh-interval'] <= 0) {
            return
        }
        updateConnectors();
        const interval = setInterval(updateConnectors, settings['auto-refresh-interval']);
        return () => clearInterval(interval);
    }, [settings, updateConnectors])

    useEffect(() => {
        if (activeConnector) {
            getEnums().then(enums => updateEnums(enums));
            updateDatasets();
        }
        if (!settings['auto-refresh-interval'] || settings['auto-refresh-interval'] <= 0) {
            return
        }
        updateAll();
        const interval = setInterval(updateAll, settings['auto-refresh-interval']);
        return () => clearInterval(interval);
    }, [activeConnector, settings, updateAll, updateEnums, getEnums, updateDatasets])
}