import Dialog from "../dialog";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useDialog, useBrokers } from "@contexts/AppContext";
import useIdsApi from "@hooks/useIdsApi";
import Table from "../pages/utils/Table";
import ViewComponent from "../dialog/ViewComponent";
import { TbRefresh } from "react-icons/tb";
import PillTag from "../pages/utils/PillTag";
import BasicButton from "../pages/utils/BasicButton";

const dialogId = 'update-resource-register';
const headers = ["","Name","Location","Resource Register Status"]

function UpdateResourceRegister() {

    const { dialogData } = useDialog();
    const { brokers } = useBrokers();
    const { 
        getResourceRegisteredStatus,
        altRegisterResource
    } = useIdsApi();

    const props = useMemo(() => dialogData[dialogId], [dialogData]);

    const [ resourceId, setResourceId ] = useState('');
    const [ registerStatus, setRegisterStatus ] = useState(null);
    const [ tableData, setTableData ] = useState([]);
    const [ processing, setProcessing ] = useState(false); 
    const [ altList, setAltList ] = useState([]);

    useEffect(() => {
        if (brokers.length === 1) {
            setAltList([brokers[0].location]);
        }
    }, [brokers])

    const updateRegisterStatus = useCallback(async () => {
        if (!resourceId || !brokers.length) {
            setRegisterStatus(null);
            return;
        }

        const results = await Promise.all(brokers.map(async broker => {
            const {location, status} = broker;
            if (status !== 'Registered') {
                return { location, status: false }
            };
            
            const result = await getResourceRegisteredStatus(resourceId, location);
            return { location, status: result };
        }));
        
        setRegisterStatus(results.reduce((acc, curr) => {
            acc[curr.location] = curr.status;
            return acc;
        }, {}));
    }, [brokers, getResourceRegisteredStatus, resourceId])

    useEffect(() => {
        setResourceId(
            props ? 
            props._links.self.href.split('/').pop() :
            ''
        );
    }, [props])

    useEffect(() => {
        updateRegisterStatus();
    }, [brokers, getResourceRegisteredStatus, props, resourceId, updateRegisterStatus])

    const updateSelection = useCallback((location) => {
        if (processing) return;

        setAltList(prev => {
            const newAltList = prev.includes(location) ?
                prev.filter(l => l !== location) :
                [...prev, location];

            return newAltList;
        });
    }, [processing])

    const altRegistering = async () => {
        setProcessing(true);
        await Promise.all(altList.map(location => 
            altRegisterResource(registerStatus[location], location, resourceId)
        ));
        await updateRegisterStatus();
        setAltList(brokers.length === 1 ? [brokers[0].location] : []);
        setProcessing(false);
    }

    const updateRegistering = async () => {
        setProcessing(true);
        await Promise.all(altList.map(location => 
            altRegisterResource(false, location, resourceId)
        ));
        await updateRegisterStatus();
        setAltList(brokers.length === 1 ? [brokers[0].location] : []);
        setProcessing(false);
    }

    useEffect(() => {
        setTableData(brokers.map(broker => {
            const { title, location, status } = broker;
            const registered = status === 'Registered';
            const registredToBroker = registerStatus?.[location];
            
            return {
                '': (
                    registered ?
                    <input type="checkbox" readOnly checked={altList.includes(location)} /> : 
                    <></>
                ),
                'Name': title,
                'Location': location,
                'Resource Register Status': <PillTag theme={registredToBroker ? 'positive' : 'negative'}>{ registredToBroker ? 'Registered' : 'Not Registered' }</PillTag>,

                _registered: registredToBroker,
                _props: {
                    onClick: () => updateSelection(location),
                }
            }
        }))
    }, [altList, brokers, registerStatus, updateSelection])

    return (
        <Dialog dialogId={dialogId} title="Register or Unregister Resource" size="medium">
            {
                registerStatus ? 
                <Table 
                    title="Select brokers to register/degister resource"
                    subTitle={
                        <ViewComponent flex>
                            {
                                processing ?
                                <>
                                <TbRefresh className="loading" />
                                <span>Register / Deregistering Resource...</span>
                                </> :
                                <>
                                <BasicButton text="Update" onClick={updateRegistering} />
                                <BasicButton text="Register / Unregister" onClick={altRegistering} />
                                </>
                            }
                        </ViewComponent>
                    }
                    data={tableData}
                    headers={headers}
                /> :
                <ViewComponent flex><TbRefresh className="loading" /><span>Checking Broker Register Status...</span></ViewComponent>
            }
        </Dialog>
    )
}

export default UpdateResourceRegister;
