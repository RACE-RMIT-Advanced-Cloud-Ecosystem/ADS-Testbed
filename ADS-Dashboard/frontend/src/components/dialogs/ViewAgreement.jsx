import { useEffect, useState, useMemo } from 'react';
import Dialog from "@components/dialog";
import {useDialog} from "@contexts/AppContext";
import ViewMultiSection from "../dialog/ViewMultiSection";

import useIdsApi from '@hooks/useIdsApi';

import SingleArtifact from './SingleArtifact';
import SingleAgreement from './SingleAgreement';
import icons from '@utils/icons';
import ViewComponent from '../dialog/ViewComponent';

const dialogId = 'view-agreement';

function ViewAgreement() {

    const {dialogData} = useDialog();
    const {idsGetAssociation} = useIdsApi();
    const props = useMemo(() => dialogData[dialogId], [dialogData]);

    const [artifacts, setArtifacts] = useState([]);

    useEffect(() => {
        if (!props) return;
        (async () => {
            setArtifacts(await idsGetAssociation(props._links.artifacts.href, 'artifacts'));
        })()
    }, [idsGetAssociation, props])

    return (
        <Dialog dialogId={dialogId} title="View Agreement" size='large' >
            <SingleAgreement props={props} base />
            <ViewMultiSection icon={icons['artifact']} title="Associated Artifacts" className='artifact'>
                {
                    artifacts.length ?
                    artifacts.map((artifact, index) => (
                        <SingleArtifact key={index} props={artifact} />
                    )) :
                    <ViewComponent fullWidth centered light>No Artifacts</ViewComponent>
                }
            </ViewMultiSection>
        </Dialog>
    )
}

export default ViewAgreement;