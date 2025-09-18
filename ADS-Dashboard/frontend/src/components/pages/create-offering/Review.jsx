import ViewComponent from "../../dialog/ViewComponent";
import ViewSection from "../../dialog/ViewSection";
import s from "@styles/pages/create-offering.module.css";

import {
    useCatalogs, useRepresentations, 
    useContracts, useRules
} from "@contexts/AppContext";
import { useEffect, useState } from "react";
import icons from "@/utils/icons";

import PillTag from "../utils/PillTag";

import SingleRepresentation from "../../dialogs/SingleRepresentation";
import SingleCatalog from "../../dialogs/SingleCatalog";
import SingleContract from "../../dialogs/SingleContract";
import SinglePolicy from "../../dialogs/SinglePolicy";
import ViewMultiSection from "../../dialog/ViewMultiSection";

function Review({
    title,
    description,
    keywords,
    license,
    language,
    publisher,
    sovereign,
    endpointDocumentation,
    samples,
    paymentMethod,
    selectedCatalog,
    selectedAssets,
    selectedContract,
    selectedPolicies,
}) {
    const { catalogs } = useCatalogs();
    const { representations:assets } = useRepresentations();
    const { contracts } = useContracts();
    const { rules } = useRules();

    const [ catalog, setCatalog ] = useState({});
    const [ representations, setRepresentations ] = useState([]);
    const [ contract, setContract ] = useState({});
    const [ policies, setPolicies ] = useState([]);

    useEffect(() => {
        setCatalog(catalogs.filter(catalog => catalog._links.self.href === selectedCatalog)[0]);
    }, [catalogs, selectedCatalog])

    useEffect(() => {
        setRepresentations(assets.filter(asset => selectedAssets.includes(asset._links.self.href)));
    }, [assets, selectedAssets])

    useEffect(() => {
        setContract(contracts.filter(contract => contract._links.self.href === selectedContract)[0]);
    }, [contracts, selectedContract])

    useEffect(() => {
        setPolicies(rules.filter(rule => selectedPolicies.includes(rule._links.self.href)));
    }, [rules, selectedPolicies])

    return (
        <div className={s['review']}>
            <ViewSection theme='resource' title='Resource Offering' base>
                {
                    keywords &&
                    <ViewComponent flex>Keywords: { (keywords ? keywords.split(',') : []).map(keyword => {{
                        return <PillTag theme='resource' key={keyword}>{keyword}</PillTag>
                    }}) }</ViewComponent>
                }
                {
                    samples &&
                    <ViewComponent flex>Samples: { (samples ? samples.split(',') : []).map(sample => {{
                        return <PillTag theme='resource' key={sample}>{sample}</PillTag>
                    }}) }</ViewComponent>
                }
                <ViewComponent keyValue closer><span>Title</span><span>{title}</span></ViewComponent>
                <ViewComponent keyValue closer><span>Published By:</span><span>{publisher}</span></ViewComponent>
                <ViewComponent keyValue closer><span>Sovereign:</span><span>{sovereign}</span></ViewComponent>
                <ViewComponent keyValue closer><span>License:</span><span>{license}</span></ViewComponent>
                <ViewComponent keyValue closer><span>Language:</span><span>{language}</span></ViewComponent>
                <ViewComponent keyValue closer><span>Endpoint Documentation:</span><span>{endpointDocumentation}</span></ViewComponent>
                <ViewComponent keyValue><span>Payment Method:</span><span>{paymentMethod}</span></ViewComponent>
    
                <ViewComponent fullWidth light further>{ description }</ViewComponent>
            </ViewSection>
            <ViewMultiSection icon={icons['catalog']} title="Selected Catalog" className='catalog'>
                {
                    catalog ?
                    <SingleCatalog props={catalog} /> :
                    <ViewComponent fullWidth centered light>No catalog selected</ViewComponent>
                }
            </ViewMultiSection>
            <ViewMultiSection icon={icons['representation']} title="Selected Assets" className='representation'>
                {
                    representations.length ? 
                    representations.map((representation, index) => {
                        return <SingleRepresentation key={index} props={representation} />
                    }) :
                    <ViewComponent fullWidth centered light>No representations selected</ViewComponent>
                }
            </ViewMultiSection>
            <ViewMultiSection  icon={icons['contract']} title="Selected Contract" className='contract'>
                {
                    contract ?
                    <SingleContract props={contract} /> :
                    <ViewComponent fullWidth centered light>No contract selected</ViewComponent>
                }
            </ViewMultiSection>
            <ViewMultiSection  icon={icons['policy']} title="Selected Policies" className='policy'>
                {
                    policies.length ?
                    policies.map((policy, index) => {
                        return <SinglePolicy key={index} props={policy} />
                    }) :
                    <ViewComponent fullWidth centered light>No policies selected</ViewComponent>
                }
            </ViewMultiSection>
        </div>
    )
}

export default Review;