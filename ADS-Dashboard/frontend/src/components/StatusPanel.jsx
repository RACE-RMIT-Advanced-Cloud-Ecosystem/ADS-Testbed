import PropTypes from 'prop-types';
import s from '@styles/top-menu.module.css';
import c from 'clsx';
import { IoIosClose } from "react-icons/io";
import { useConnectors } from '@contexts/AppContext';
import { useEffect, useState } from 'react';

function StatusPanel({ active, togglePanel }) {

    const { connectStatus, connectors, activeConnector, lastUpdated } = useConnectors();
    const [connectorName, setConnectorName] = useState('');

    const [connected, setConnected] = useState(false);

    useEffect(() => {
        setConnected(connectStatus[activeConnector])
    }, [connectStatus, activeConnector])

    useEffect(() => {
        const connector = connectors.find(({id})=>id == activeConnector);
        if (connector) setConnectorName(connector.name);
    }, [activeConnector, connectors])

    return (
        <div className={c(s['status-panel'], { [s['active']]: active })}>
            <div className={s['title-part']}>
                <div className={s['title']}>Connection Status</div>
                <IoIosClose className={c(s['close-btn'], 'clickable')} onClick={togglePanel} />
            </div>
            <div className={s['status-part']}>
                {
                    activeConnector ?
                    <>
                    <div className={s['row']}>
                        <div className={s['label']}>Connector:</div>
                        <div className={s['value']}>{connectorName}</div>
                    </div>
                    <div className={s['row']}>
                        <div className={s['label']}>Status:</div>
                        <div 
                            className={c(s['value'], { [s['connected']]: connected, [s['disconnected']]: !connected })}
                        >{ connected ? 'Connected' : 'Disconnected' }</div>
                    </div>
                    <div className={s['row']}>
                        <div className={s['label']}>Last Updated:</div>
                        <div className={s['value']}>{new Date(lastUpdated).toLocaleString()}</div>
                    </div>
                    </> :

                    <div className={s['row']}>
                        <div>No connector selected!</div>
                    </div>
                }
            </div>
        </div>
    )
}

StatusPanel.propTypes = {
    active: PropTypes.bool.isRequired,
    togglePanel: PropTypes.func.isRequired
}

export default StatusPanel;