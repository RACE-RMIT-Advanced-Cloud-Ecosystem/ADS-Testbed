import { useEffect, useState, useMemo } from 'react';
import Dialog from "@components/dialog";
import {useDialog} from "@contexts/AppContext";
import ViewMultiSection from "../dialog/ViewMultiSection";
import icons from '@utils/icons';

import useIdsApi from '@hooks/useIdsApi';

import SingleResource from "./SingleResource";
import SinglePolicy from './SinglePolicy';
import SingleContract from './SingleContract';
import ViewComponent from '../dialog/ViewComponent';

const dialogId = 'view-contract';

function ViewContract() {

    const {dialogData} = useDialog();
    const {idsGetAssociation} = useIdsApi();
    const props = useMemo(() => dialogData[dialogId], [dialogData]);

    // rules, resources
    const [rules, setRules] = useState([]);
    const [resources, setResources] = useState([]);

    useEffect(() => {
        if (!props) return;

        (async () => {
            setRules(await idsGetAssociation(props._links.rules.href, 'rules'));
            setResources(await idsGetAssociation(props._links.offers.href, 'resources'));
        })()
    }, [idsGetAssociation, props])

    return (
        <Dialog dialogId={dialogId} title="View Contract" size='large' >
            <SingleContract props={props} base />
            <ViewMultiSection icon={icons['policy']} title="Associated Policies" className='policy'>
                {
                    rules.length ?
                    rules.map((policy, index) => (
                        <SinglePolicy key={index} props={policy} />
                    )) :
                    <ViewComponent fullWidth centered light>No Rules</ViewComponent>
                }
            </ViewMultiSection>
            <ViewMultiSection icon={icons['resource']} title="Associated Resources"  className='resource'>
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

export default ViewContract;