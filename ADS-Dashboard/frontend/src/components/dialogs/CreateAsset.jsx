import { useEffect, useState } from 'react';
import Dialog from "../dialog";
import { useDialog, useEnums, useDatasets, useConnectors } from "@contexts/AppContext";
import s from "@styles/pages/index.module.css";
import si from "@styles/dialogs/index.module.css";
import useUpdate from '@hooks/useUpdate';
import useIdsApi from '@hooks/useIdsApi';

import ViewSection from "../dialog/ViewSection";
import Section from '../dialog/Section';

import BasicInput from "../pages/utils/BasicInput";
import BasicButton from '../pages/utils/BasicButton';

import { FaSave } from "react-icons/fa";

import { toast } from 'react-toastify';

const dialogId = 'create-asset';

const mediaTypeOptions = [
    { 
        groupName: 'Texts', items: [
            { label: 'text/plain', value: 'text/plain' },
            { label: 'application/json', value: 'application/json' },
        ]
    },
    {
        groupName: 'Images', items: [
            { label: 'image/png', value: 'image/png' },
            { label: 'image/jpeg', value: 'image/jpeg' },
        ]
    },
    {
        groupName: 'PDFs', items: [
            { label: 'application/pdf', value: 'application/pdf' },
        ]
    },
    {
        groupName: 'Other', items: [
            { label: 'Other', value: 'other' }
        ]
    }
]

const artifactTypeOptions = [
    { label: 'Access URL', value: 'accessUrl' },
    { label: 'Value', value: 'value' },
    { label: 'My Dataset', value: 'dataset' }
];

function CreateAsset() {

    const { closeDialog } = useDialog();
    const { enums } = useEnums();
    const { updateRepresentations, updateArtifacts } = useUpdate();
    const { datasets } = useDatasets();
    const { createAsset } = useIdsApi();
    const { activeConnector } = useConnectors();
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [mediaType, setMediaType] = useState('text/plain');
    const [mediaTypeOther, setMediaTypeOther] = useState('');
    const [language, setLanguage] = useState('EN');
    const [artifactType, setArtifactType] = useState('value');
    const [inputValue, setInputValue] = useState('');
    const [accessUrl, setAccessURL] = useState('');
    const [basicAuth, setBasicAuth] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [languages, setLanguages] = useState([]);
    const [datasetOptions, setDatasetOptions] = useState([]);
    const [selectedDataset, setSelectedDataset] = useState('');

    useEffect(() => {
        if (!enums) return;

        setLanguages(enums.LANGUAGE.map(({jsonInput, displayName}) => {
            return {
                label: displayName, value: jsonInput
            }
        }))
    }, [enums])

    useEffect(() => {
        setDatasetOptions(datasets.map(({name, id})=>({label: name, value: id})));
        setSelectedDataset(datasets[0]?.id || '');
    }, [datasets])

    useEffect(() => {
        if (artifactType === 'dataset' && selectedDataset && datasets.length > 0) {
            const dataset = datasets.find(d => d.id === selectedDataset);
            if (dataset?.mimetype) {
                const isKnownType = mediaTypeOptions.some(group => 
                    group.items.some(item => item.value === dataset.mimetype)
                );
                if (isKnownType) {
                    setMediaType(dataset.mimetype);
                } else {
                    setMediaType('other');
                    setMediaTypeOther(dataset.mimetype);
                }
            }
        }
    }, [artifactType, selectedDataset, datasets])

    const submit = () => {
        const mediaTypeValue = mediaType === 'other' ? mediaTypeOther : mediaType;
        const datasetBaseUrl = import.meta.env.VITE_PROXY_BASE_URL || 'https://omejdn/dashboard'
        const dataValues = 
            artifactType === 'value' ? { value: inputValue } :
            artifactType === 'dataset' ? { accessUrl: `${datasetBaseUrl}/api/system/datasets/${activeConnector}/${selectedDataset}` } :
            { accessUrl, ...(basicAuth && { basicAuth }), ...(apiKey && { apiKey }) };

        const input = {
            title, description, language, mediaType: mediaTypeValue,
            ...dataValues
        }

        createAsset(input).then(result => {
            if (!result) {
                toast.error('Cannot create asset!')
            } else {
                toast.success('Successfully created asset!');
                updateArtifacts();
                updateRepresentations();
                clear();
                closeDialog(dialogId)
            }
        })
    }

    const clear = () => {
        setTitle('');
        setDescription('');
        setMediaType('text/plain');
        setMediaTypeOther('');
        setLanguage('EN');
        setArtifactType('value');
        setInputValue('');
        setAccessURL('');
        setBasicAuth('');
        setApiKey('');
    }

    const close = () => {
        clear();
        closeDialog(dialogId);
    }

    return (
        <Dialog 
            dialogId={dialogId} size="auto" 
            className={s['input-dialog']} title="Create Asset"
        >
            <BasicInput label='Asset Title' value={title} callback={setTitle} />
            <BasicInput label='Asset Description' value={description} callback={setDescription} />
            <ViewSection theme='representation' base className={si['view-section']}>
                <BasicInput 
                    className='mb1' label='Media Type' type='select' options={mediaTypeOptions}
                    value={mediaType} callback={setMediaType} disabled={artifactType === 'dataset'}
                />
                {
                    mediaType === 'other' && (
                        <BasicInput 
                            label='Enter Media Type' value={mediaTypeOther} 
                            callback={setMediaTypeOther}  disabled={artifactType === 'dataset'} 
                        />
                    )
                }
                <BasicInput 
                    label='Language' value={language} callback={setLanguage} 
                    type='select' options={languages}
                />
            </ViewSection>
            <ViewSection theme='artifact' base className={si['view-section']}>
                <BasicInput 
                    label='Artifact Type' value={artifactType} callback={setArtifactType}
                    type='select' options={artifactTypeOptions}
                    className='mb1' 
                />
                {artifactType === 'value' ? (
                    <BasicInput label='Input Value' value={inputValue} callback={setInputValue} />
                ) : 
                artifactType === 'dataset' ? (
                    <BasicInput label='Select Dataset' type='select' options={datasetOptions} value={selectedDataset} callback={setSelectedDataset} />
                ) : (
                    <>
                        <BasicInput label='Access URL' value={accessUrl} callback={setAccessURL} className='mb1'  />
                        <BasicInput label='Basic Auth (optional)' value={basicAuth} callback={setBasicAuth} className='mb1'  />
                        <BasicInput label='API Key (optional)' value={apiKey} callback={setApiKey} />
                    </>
                )}
            </ViewSection>

            <Section layout='horizontal' className='mb1' >
                <BasicButton variation='primary' icon={<FaSave />} text='Submit' onClick={submit} />
                <BasicButton variation='secondary' text='Cancel' onClick={close} />
            </Section>
        </Dialog>
    )
}

export default CreateAsset;