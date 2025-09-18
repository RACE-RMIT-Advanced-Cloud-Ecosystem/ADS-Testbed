import { useEffect, useState, useMemo } from 'react';
import Dialog from "@components/dialog";
import {useDialog} from "@contexts/AppContext";
import ViewMultiSection from "../dialog/ViewMultiSection";

import useIdsApi from '@hooks/useIdsApi';
import SingleArtifact from './SingleArtifact';
import SingleRepresentation from './SingleRepresentation';

import icons from '@utils/icons';
import SingleAgreement from './SingleAgreement';
import ViewComponent from '../dialog/ViewComponent';

const dialogId = 'view-artifact';

function ViewArtifact() {

    const {dialogData} = useDialog();
    const {idsGetAssociation} = useIdsApi();
    const props = useMemo(() => dialogData[dialogId], [dialogData]);

    const [representations, setRepresentations] = useState([]);
    const [agreements, setAgreements] = useState([]);

    useEffect(() => {
        if (!props) return;

        (async () => {
            setRepresentations(await idsGetAssociation(props._links.representations.href, 'representations'));
            setAgreements(await idsGetAssociation(props._links.agreements.href, 'agreements'));
        })()
    }, [idsGetAssociation, props])

    return (
        <Dialog dialogId={dialogId} title="View Artifact" size='large' >
            <SingleArtifact props={props} base />
            <ViewMultiSection icon={icons['representation']} title="Associated Representations" className='representation'>
                {
                    representations.length ?
                    representations.map((representation, index) => (
                        <SingleRepresentation key={index} props={representation} />
                    )) :
                    <ViewComponent fullWidth centered light>No Representations</ViewComponent>
                }
            </ViewMultiSection>
            <ViewMultiSection icon={icons['agreement']} title="Associated Agreements" className='agreement'>
                {
                    agreements.length ?
                    agreements.map((agreement, index) => (
                        <SingleAgreement key={index} props={agreement} />
                    )) :
                    <ViewComponent fullWidth centered light>No Agreements</ViewComponent>
                }
            </ViewMultiSection>
        </Dialog>
    )
}

export default ViewArtifact;