import { useEffect, useState, useMemo } from 'react';
import Dialog from "@components/dialog";
import {useDialog} from "@contexts/AppContext";
import ViewMultiSection from "../dialog/ViewMultiSection";
import icons from '@utils/icons';

import useIdsApi from '@hooks/useIdsApi';

import SingleResource from "./SingleResource";
import SingleRepresentation from "./SingleRepresentation";
import SingleContract from './SingleContract';
import SingleCatalog from './SingleCatalog';
import ViewComponent from '../dialog/ViewComponent';

const dialogId = 'view-resource';

function ViewResource() {

    const {dialogData} = useDialog();
    const {idsGetAssociation} = useIdsApi();
    const props = useMemo(() => dialogData[dialogId], [dialogData]);

    // contracts, representations, catalogs
    const [representations, setRepresentations] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [catalogs, setCatalogs] = useState([]);

    useEffect(() => {
        if (!props) return;

        (async () => {
            setRepresentations(await idsGetAssociation(props._links.representations.href, 'representations'));
            setContracts(await idsGetAssociation(props._links.contracts.href, 'contracts'));
            setCatalogs(await idsGetAssociation(props._links.catalogs.href, 'catalogs'));
        })()
    }, [idsGetAssociation, props])

    return (
        <Dialog dialogId={dialogId} title="View Resource" size='large' >
            <SingleResource props={props} base />
            <ViewMultiSection icon={icons['representation']} title="Associated Representations" className='representation'>
                {
                    representations.length ? 
                    representations.map((representation, index) => (
                        <SingleRepresentation key={index} props={representation} />
                    )) :
                    <ViewComponent fullWidth centered light>No Representations</ViewComponent>
                }
            </ViewMultiSection>
            <ViewMultiSection icon={icons['contract']} title="Associated Contracts" className='contract'>
                {
                    contracts.length ? 
                    contracts.map((contract, index) => (
                        <SingleContract key={index} props={contract} />
                    )) :
                    <ViewComponent fullWidth centered light>No Contracts</ViewComponent>
                }
            </ViewMultiSection>
            <ViewMultiSection icon={icons['catalog']} title="Associated Catalogs" className='catalog'>
                {
                    catalogs.length ?
                    catalogs.map((catalog, index) => (
                        <SingleCatalog key={index} props={catalog} />
                    )) :
                    <ViewComponent fullWidth centered light>No Catalogs</ViewComponent>
                }
            </ViewMultiSection>
        </Dialog>
    )
}

export default ViewResource;