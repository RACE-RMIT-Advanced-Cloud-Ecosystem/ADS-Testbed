import { useEffect, useState, useMemo } from 'react';
import Dialog from "@components/dialog";
import {useDialog} from "@contexts/AppContext";
import ViewMultiSection from "../dialog/ViewMultiSection";
import icons from '@utils/icons';

import useIdsApi from '@hooks/useIdsApi';

import SingleResource from "./SingleResource";
import SingleBroker from './SingleBroker';
import ViewComponent from '../dialog/ViewComponent';

const dialogId = 'view-broker';

function ViewBroker() {

    const {dialogData} = useDialog();
    const {idsGetAssociation} = useIdsApi();
    const props = useMemo(() => dialogData[dialogId], [dialogData]);

    // rules, resources
    const [resources, setResources] = useState([]);

    useEffect(() => {
        if (!props) return;

        (async () => {
            setResources(await idsGetAssociation(props._links.offers.href, 'resources'));
        })()
    }, [idsGetAssociation, props])

    return (
        <Dialog dialogId={dialogId} title="View Broker" size='large' >
            <SingleBroker props={props} base />
            <ViewMultiSection icon={icons['resource']} title="Associated Resources" className='resource'>
                {
                    resources.length ?
                    resources.map((resource, index) => (
                        <SingleResource key={index} props={resource} />
                    )) :
                    <ViewComponent fullWidth centered light>No Resources</ViewComponent>
                }
            </ViewMultiSection>
        </Dialog>
    )
}

export default ViewBroker;