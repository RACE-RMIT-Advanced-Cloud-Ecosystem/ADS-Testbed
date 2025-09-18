import { useEffect, useState, useMemo } from 'react';
import Dialog from "@components/dialog";
import {useDialog} from "@contexts/AppContext";
import ViewMultiSection from "../dialog/ViewMultiSection";
import icons from '@utils/icons';

import useIdsApi from '@hooks/useIdsApi';

import SingleContract from './SingleContract';
import SinglePolicy from './SinglePolicy';
import ViewComponent from '../dialog/ViewComponent';

const dialogId = 'view-policy';

function ViewPolicy() {

    const {dialogData} = useDialog();
    const {idsGetAssociation} = useIdsApi();
    const props = useMemo(() => dialogData[dialogId], [dialogData]);

    const [contracts, setContracts] = useState([]);

    useEffect(() => {
        if (!props) return;

        (async () => {
            setContracts(await idsGetAssociation(props._links.contracts.href, 'contracts'));
        })()
    }, [idsGetAssociation, props])

    return (
        <Dialog dialogId={dialogId} title="View Resource" size='large' >
            <SinglePolicy props={props} base />
            <ViewMultiSection icon={icons['contract']} title="Associated Contracts" className='contract'>
                {
                    contracts.length ?
                    contracts.map((contract, index) => (
                        <SingleContract key={index} props={contract} />
                    )) :
                    <ViewComponent fullWidth centered light>No Contracts</ViewComponent>
                }
            </ViewMultiSection>
        </Dialog>
    )
}

export default ViewPolicy;