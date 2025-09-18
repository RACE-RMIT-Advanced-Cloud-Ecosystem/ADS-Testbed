import { useBrokers, useDialog } from '@contexts/AppContext';
import { useCallback, useEffect, useState } from 'react';
import { toast } from "react-toastify";
import useDate from "@hooks/useDate";
import Table from './utils/Table'
import SearchBar from './utils/SearchBar';
import PillTag from './utils/PillTag';
import useUpdate from '@hooks/useUpdate';
import useIdsApi from '@hooks/useIdsApi';
import TableActions from './utils/TableActions';
import { IoEye } from 'react-icons/io5';
import { TbPencilPlus, TbPencilX } from 'react-icons/tb';
import { FaTrash } from 'react-icons/fa6';

function Brokers() {
    const dateFormatter = useDate();
    const {openDialog} = useDialog();
    const {brokers} = useBrokers();
    const { registerUnregisterBroker } = useIdsApi();
    const { updateBrokers } = useUpdate();

    const [data, setData] = useState([]);

    const updateBrokerRegisterStatus = useCallback((registered, location) => {
        toast.info("Updating broker register...");
        registerUnregisterBroker(registered, location).then(result => {
            if (result) {
                toast.success(`Broker updated successfully`);
                updateBrokers();
            }
        }).catch(error => {
            toast.error(`Failed to update broker: ${error.message}`);
        });
    }, [registerUnregisterBroker, updateBrokers])

    useEffect(() => {
        setData(brokers.map(broker => {
            const { title, description, location, status, creationDate } = broker;
            const registered = status === 'Registered'
            return {
                'Title': title,
                'Description': description,
                'Location': location,
                'Status': <PillTag theme={registered ? 'positive' : 'negative'}>{ status }</PillTag>,
                'Created': dateFormatter(creationDate),
                'Actions': (
                    <TableActions>
                        <IoEye onClick={() => openDialog('view-broker', broker)} />
                        <TbPencilPlus
                            title={registered ? 'Update Broker' :'Register Broker'}
                            onClick={() => updateBrokerRegisterStatus(false, location)} 
                        />
                        {
                            registered && 
                            <TbPencilX 
                                title='Unregister Broker'
                                onClick={() => updateBrokerRegisterStatus(true, location)}
                            />
                        }
                        <FaTrash onClick={()=>openDialog('confirm-deletion', { title, url: broker._links.self.href, type: 'broker' })} />
                    </TableActions>
                ),

                _status: status
            }
        }))
    }, [dateFormatter, brokers, updateBrokerRegisterStatus, openDialog])

    return (
        <div>
            <h1>Metadata Brokers</h1>
            <div className="sub-title">Manage metadata brokers registered across all connectors</div>
            <SearchBar 
                placeholder='Search brokers...' 
                createNewText='New Broker' 
                createNewAction={()=>openDialog('create-broker')} 
                callback={()=>{}}
            />
            <Table
                title="Registered Brokers"
                headers={
                    ["Title","Description","Location","Status","Created","Actions"]
                }
                data={data}
                emptyText="No registered broker found"
            />
        </div>
    )
}
export default Brokers;