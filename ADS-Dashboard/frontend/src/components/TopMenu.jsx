import s from '@styles/top-menu.module.css'
import c from 'clsx';
import PropTypes from 'prop-types';

import { TbRefresh } from "react-icons/tb";
import { FaAngleDown } from "react-icons/fa6";

import { useConnectors, useSystemSettings, useDataFetch } from '@contexts/AppContext';
import BasicInput from './pages/utils/BasicInput';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import useUpdate from '@hooks/useUpdate';

function TopMenu({ panelActive, togglePanel }) {

    const {
        connectors, 
        activeConnector,
        connectStatus,
        updateActiveConnector
    } = useConnectors();
    const {
        updateSystemSettings
    } = useSystemSettings();
    const { fetching } = useDataFetch();

    const location = useLocation();

    const [connected, setConnected] = useState(false);
    const { updateAll } = useUpdate();

    const selectConnector = useCallback((connector) => {
        updateSystemSettings({'active-connector': connector});
        updateActiveConnector(connector)
    }, [updateActiveConnector, updateSystemSettings])

    useEffect(() => {
        setConnected(connectStatus[activeConnector])
    }, [connectStatus, activeConnector])

    const [disableConnectorSelection, setDisableConnectorSelection] = useState(true);

    useEffect(() => {
        if (
            connectors.length &&
            location.pathname !== '/settings' &&
            location.pathname !== '/connectors'
        ) {
            setDisableConnectorSelection(false);
        } else {
            setDisableConnectorSelection(true);
        }
    }, [connectors, location])

    const [connectorOptions, setConnectorOptions] = useState([]);

    useEffect(() => {
        if (disableConnectorSelection) {
            setConnectorOptions([{ label: 'Global', value: activeConnector }])
        } else {
            setConnectorOptions(connectors.map(({name, id})=>({label: name, value: id})))
        }
    }, [activeConnector, connectors, disableConnectorSelection])

    return (
        <div className={s['top-menu']}>
            <div 
                className={c(s['status-indicator'], 'clickable', { [s['active']]: panelActive })}
                onClick={togglePanel}
            >
                <div className={c(s['indicator'], { [s['connected']]: connected, [s['disconnected']]: !connected } )} />
                {connected ? 'Connected' : 'Disconnected'}
                <FaAngleDown className={s['expand-indicator']} />
            </div>

            <BasicInput 
                type='select' value={activeConnector} 
                options={connectorOptions} 
                callback={selectConnector}
                disabled={disableConnectorSelection} className={s['connector-selector']}
            />

            <div className={c(s['refresh-btn'], 'clickable')} onClick={updateAll}>
                <TbRefresh className={fetching ? 'loading' : ''} />
            </div>
        </div>
    )
}

TopMenu.propTypes = {
    panelActive: PropTypes.bool.isRequired,
    togglePanel: PropTypes.func.isRequired
}

export default TopMenu;
