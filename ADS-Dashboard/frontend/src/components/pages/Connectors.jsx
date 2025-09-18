import { useConnectors, useDialog, useSystemSettings } from '@contexts/AppContext';
import useUpdate from "@hooks/useUpdate";
import { useEffect, useMemo, useState } from 'react';
import { addConnector } from '@utils/api';
import { getErrorMessage } from '@utils/tools';
import { toast } from "react-toastify";

import s from "@styles/pages/index.module.css";

import { FaEdit, FaSave } from "react-icons/fa";
import { FaTrash } from 'react-icons/fa6';

import Dialog from '@components/dialog';
import BasicInput from './utils/BasicInput';
import Section from '@components/dialog/Section';
import BasicButton from './utils/BasicButton';
import PillTag from './utils/PillTag';
import TableActions from './utils/TableActions';
import Table from './utils/Table'
import SearchBar from './utils/SearchBar';

const dialogId = 'add-connector';

function AddConnector() {
    const {closeDialog, dialogData} = useDialog();
    const {updateConnectors} = useUpdate();
    const {connectors, activeConnector, updateConnectorsList, updateActiveConnector} = useConnectors();
    const { updateSystemSettings } = useSystemSettings();
    const props = useMemo(() => dialogData[dialogId], [dialogData]);

    const [ connectorName, setConnectorName ] = useState('');
    const [ connectorEndpoint, setConnectorEndpoint ] = useState('');
    const [ connectorUsername, setConnectorUsername ] = useState('');
    const [ connectorPassword, setConnectorPassword ] = useState('');

    useEffect(() => {
        setConnectorName(props?.name ?? '');
        setConnectorEndpoint(props?.endpoint ?? '');
        setConnectorUsername(props?.username ?? '');
    }, [props])

    const clearAll = () => {
        setConnectorName('');
        setConnectorEndpoint('');
        setConnectorUsername('');
        setConnectorPassword('');
    }

    const close = () => {
        closeDialog(dialogId);
        clearAll();
    }

    const submit = async () => {
        const connectorData = {
            ...(props ?? {}),
            name: connectorName, endpoint: connectorEndpoint, 
            username: connectorUsername, 
            password: 
                connectorPassword || 
                (
                    props && props.username === connectorUsername ? 
                    undefined : ''
                ),
        };

        const result = await addConnector(connectorData);

        if (result.error) {
            toast.error(`Error when ${props ? 'updating' : 'adding'} connector: ${getErrorMessage(result.error)}`);
            return;
        }

        if (props) {
            // Update existing connector
            const updatedConnectors = connectors.map(c => 
                c.id === props.id ? { ...c, ...result } : c
            );
            updateConnectorsList(updatedConnectors);
        } else {
            // Add new connector
            updateConnectorsList([...connectors, result]);
        }
        if (!activeConnector) {
            const newConnectorId = result.id;
            updateActiveConnector(newConnectorId);
            updateSystemSettings({'active-connector': newConnectorId});
        }
        updateConnectors();
        close();
    }

    return (
        <Dialog 
            title={props ? `Edit Connector: ${props.name}` : "Add Connector"} 
            dialogId={dialogId} size='auto' className={s['input-dialog']}
        >
            <Section>
                <BasicInput 
                    label="Connector Name"
                    value={connectorName} callback={setConnectorName}
                />
                <BasicInput 
                    label="Connector Endpoint"
                    value={connectorEndpoint} callback={setConnectorEndpoint}
                />
            </Section>
            <Section>
                <BasicInput 
                    label="Username (Optional)"
                    description="Username for authentication connector's backend endpoints"
                    value={connectorUsername} callback={setConnectorUsername}
                />
                <BasicInput 
                    type='password' label="Password (Optional)"
                    description="Password for authentication connector's backend endpoints"
                    value={connectorPassword} callback={setConnectorPassword}
                    placeholder={props?.auth ? "(Fill to update password)" : undefined}
                />
            </Section>
            <Section layout='horizontal'>
                <BasicButton variation='primary' icon={<FaSave />} text='Submit' onClick={submit} />
                <BasicButton variation='secondary' text='Cancel' onClick={close} />
            </Section>
        </Dialog>
    );
}

function Connectors() {

    const {connectors, connectStatus} = useConnectors();
    const {openDialog} = useDialog();

    const [data, setData] = useState([]);

    useEffect(() => {
        setData(connectors.map(connector => {
            const {id, name, endpoint} = connector;
            return ({
                Name: name, Endpoint: endpoint,
                Status: <PillTag theme={connectStatus[id] ? 'positive' : 'negative'}>{ connectStatus[id] ? 'ONLINE' : 'OFFLINE' }</PillTag>,
                Actions: (
                    <TableActions>
                        <FaEdit onClick={() => openDialog(dialogId, connector)} />
                        <FaTrash onClick={()=>openDialog('confirm-deletion', { title: name, url: id, type: 'connector' })} />
                    </TableActions>
                ),
                _status: !!connectStatus[id]
            })
        }))
    }, [connectors, connectStatus, openDialog])

    return (
        <div>
            <h1>Connector Management</h1>
            <div className="sub-title">Configure and monitor dataspace connectors</div>
            <SearchBar 
                placeholder='Search connectors...' 
                createNewText='Add Connector' createNewAction={()=>openDialog(dialogId)} 
                callback={()=>{}}
            />
            <Table
                title="Configured Connectors"
                headers={
                    ["Name","Endpoint","Status","Actions"]
                }
                data={data}
                emptyText="No registered connector found"
            />
            <AddConnector />
        </div>
    )
}
export default Connectors;