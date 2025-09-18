import { useCallback, useState } from 'react';
import si from '@styles/pages/index.module.css';
import c from 'clsx';
import Tab from '../utils/Tab';
import BasicButton from '../utils/BasicButton';
import { toast } from "react-toastify";
import useIdsApi from "@hooks/useIdsApi";
import useUpdate from "@hooks/useUpdate"

import Resource from './Resource';
import Catalog from './Catalog';
import Assets from './Assets';
import Policies from './Policies';
import Review from './Review';
import { FaSave } from 'react-icons/fa';
import { TbRefresh } from 'react-icons/tb';

const tabs = [
    'Resource',
    'Catalog',
    'Assets',
    'Policies',
    'Review',
];

function CreateOffering({ cancelOperation }) {

    const [displayTab, setDisplayTab] = useState(0);
    const { updateResources } = useUpdate();
    const {associate, createResource} = useIdsApi();

    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [keywords, setKeywords] = useState('');
    const [license, setLicense] = useState('');
    const [language, setLanguage] = useState('EN');
    const [publisher, setPublisher] = useState('');
    const [sovereign, setSovereign] = useState('');
    const [endpointDocumentation, setEndpointDocumentation] = useState('');
    const [samples, setSamples] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('undefined');

    const [selectedCatalog, setSelectedCatalog] = useState(null);

    const [selectedAssets, setSelectedAssets] = useState([]);

    const [selectedContract, setSelectedContract] = useState([]);
    const [selectedPolicies, setSelectedPolicies] = useState([]);

    const switchPage = useCallback((to) => {
        if (to === 'next') {
            if (displayTab === tabs.length - 1) return;
            setDisplayTab(displayTab + 1);
        } else {
            if (displayTab === 0) return;
            setDisplayTab(displayTab - 1);
        }
    }, [displayTab])

    const updateAssets = useCallback((asset) => {
        if (selectedAssets.includes(asset)) {
            setSelectedAssets(selectedAssets.filter(a => a !== asset));
        } else {
            setSelectedAssets([...selectedAssets, asset]);
        }
    }, [selectedAssets]);

    const updatePolicies = useCallback((policy) => {
        if (selectedPolicies.includes(policy)) {
            setSelectedPolicies(selectedPolicies.filter(p => p !== policy));
        } else {
            setSelectedPolicies([...selectedPolicies, policy]);
        }
    }, [selectedPolicies]);

    const submitCreation = async () => {

        if (!title) return toast.error("Please input a resource title!")
        if (!selectedPolicies.length) return toast.error("Please select at least one policy!");
        if (!selectedContract) return toast.error("Please select a contract!");
        if (!selectedAssets.length) return toast.error("Please select at least one asset!");
        if (!selectedCatalog) return toast.error("Please select a catalog!");

        toast.info("Creating Resource...")
        setLoading(true);
        const resourceEndpoint = await createResource({
            title, description, keywords: keywords ? keywords.split(',') : undefined,
            publisher, language, license, sovereign, endpointDocumentation,
            samples: samples ? samples.split(',') : undefined, paymentMethod
        })
        if (!resourceEndpoint) { 
            toast.error("Failed to create resource!");
            setLoading(false);
            return;
        }

        // toast.info("Appending Policies to Contract...")
        const appPoliciesToContractResult = await associate(`${selectedContract}/rules`, selectedPolicies);
        if (!appPoliciesToContractResult) { 
            toast.error("Failed to append policy to contract!");
            setLoading(false);
            return;
        }

        // toast.info("Appending Asset to Resource...")
        const appAssetToResourceResult = await associate(`${resourceEndpoint}/representations`, selectedAssets);
        if (!appAssetToResourceResult) { 
            toast.error("Failed to append asset to resource!");
            setLoading(false);
            return;
        }

        // toast.info("Appending Contract to Resource...")
        const appContractToResourceResult = await associate(`${resourceEndpoint}/contracts`, [selectedContract]);
        if (!appContractToResourceResult) { 
            toast.error("Failed to append contract to resource!");
            setLoading(false);
            return;
        }

        // toast.info("Appending Resource to Catalog...")
        const appResourceToCatalog = await associate(`${selectedCatalog}/offers`, [resourceEndpoint]);
        if (!appResourceToCatalog) { 
            toast.error("Failed to append resource to catalog!");
            setLoading(false);
            return;
        }

        // toast.info("Appending Resource to Contract...")
        const appResourceToContract = await associate(`${selectedContract}/offers`, [resourceEndpoint]);
        if (!appResourceToContract) { 
            toast.error("Failed to append resource to contract!");
            setLoading(false);
            return;
        }

        toast.success("Successfully Created Resource!");
        setLoading(false);
        updateResources();
        cancelOperation();
        return;
    }

    return (
        <div>
            <h1>Create Data Offerings</h1>
            <div className="sub-title">Create a to offer and associate your assets and policies.</div>

            <div className={c(si['horizontal-list'], si['tabs-group'])}>
                {tabs.map((tab, index) => (
                    <Tab key={tab} name={tab} active={displayTab === index} onClick={()=>setDisplayTab(index)} />
                ))}
            </div>

            {
                displayTab === 0 ? <Resource
                    title={title} setTitle={setTitle}
                    description={description} setDescription={setDescription}
                    keywords={keywords} setKeywords={setKeywords}
                    license={license} setLicense={setLicense}
                    language={language} setLanguage={setLanguage}
                    publisher={publisher} setPublisher={setPublisher}
                    sovereign={sovereign} setSovereign={setSovereign}
                    endpointDocumentation={endpointDocumentation} setEndpointDocumentation={setEndpointDocumentation}
                    samples={samples} setSamples={setSamples}
                    paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
                /> :
                displayTab === 1 ? <Catalog 
                    selectedCatalog={selectedCatalog} setSelectedCatalog={setSelectedCatalog}
                /> : 
                displayTab === 2 ? <Assets
                    selectedAssets={selectedAssets} updateSelection={updateAssets}
                /> :
                displayTab === 3 ? <Policies
                    selectedContract={selectedContract} setSelectedContract={setSelectedContract}
                    selectedPolicies={selectedPolicies} updateSelectedPolicies={updatePolicies}
                /> : <Review 
                    title={title}
                    description={description}
                    keywords={keywords}
                    license={license}
                    language={language}
                    publisher={publisher}
                    sovereign={sovereign}
                    endpointDocumentation={endpointDocumentation}
                    samples={samples}
                    paymentMethod={paymentMethod}
                    selectedCatalog={selectedCatalog}
                    selectedAssets={selectedAssets}
                    selectedContract={selectedContract}
                    selectedPolicies={selectedPolicies}
                />
            }

            <div className={c(si['horizontal-list'])}>
                { displayTab !== 0 && <BasicButton text="Go back" onClick={() => switchPage('back')} variation='secondary' />}
                { displayTab !== tabs.length - 1 && <BasicButton text="Next" onClick={() => switchPage('next')} variation='primary' /> }
                { displayTab === tabs.length - 1 && <BasicButton text={loading ? 'Creating...' : 'Save'} icon={loading ? <TbRefresh className='loading' /> : <FaSave />} onClick={submitCreation} variation='primary' /> }
                <BasicButton text="Cancel" onClick={cancelOperation} variation='secondary' />
            </div>

        </div>
    )
}

export default CreateOffering;