import { useEffect, useState } from 'react';
import Dialog from "../dialog";
import { useDialog, useEnums } from "@contexts/AppContext";
import s from "@styles/pages/index.module.css";
import Section from '../dialog/Section';
import BasicInput from "../pages/utils/BasicInput";
import BasicButton from '../pages/utils/BasicButton';
import { FaSave } from "react-icons/fa";
import policyEntriesMapping from '@utils/policyEntriesMapping';
import useIdsApi from '@hooks/useIdsApi';
import { toast } from 'react-toastify';
import useUpdate from '@hooks/useUpdate';
import { getUtcDate } from '@utils/tools';

const dialogId = 'create-policy';

function CreatePolicy() {
    const { closeDialog } = useDialog();
    const { enums } = useEnums();
    const { createPolicy } = useIdsApi();
    const { updateRules } = useUpdate();
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedPattern, setSelectedPattern] = useState('PROVIDE_ACCESS');
    const [dynamicFields, setDynamicFields] = useState({});
    const [policyPatterns, setPolicyPatterns] = useState([]);

    useEffect(() => {
        if (!enums?.POLICY_PATTERN) return;
        setPolicyPatterns(enums.POLICY_PATTERN.map(({jsonInput, displayName}) => ({
            label: `${jsonInput} (${displayName})`, value: jsonInput
        })));
    }, [enums]);

    useEffect(() => {
        if (!selectedPattern) {
            setDynamicFields({});
            return;
        }
        
        const fields = policyEntriesMapping[selectedPattern];
        if (fields) {
            const initialFields = {};
            fields.forEach(field => {
                initialFields[field.name] = '';
            });
            setDynamicFields(initialFields);
        } else {
            setDynamicFields({});
        }
    }, [selectedPattern]);

    const handleDynamicFieldChange = (fieldName, value) => {
        setDynamicFields(prev => ({ ...prev, [fieldName]: value }));
    };

    const submit = () => {
        const transformedFields = { ...dynamicFields };
        
        if (selectedPattern && policyEntriesMapping[selectedPattern]) {
            policyEntriesMapping[selectedPattern].forEach(field => {
                if (field.type === 'date' && transformedFields[field.name]) {
                    transformedFields[field.name] = getUtcDate(transformedFields[field.name]).toISOString();
                    console.log(transformedFields[field.name])
                }
            });
        }
        
        const policyInput = {
            title,
            description,
            type: selectedPattern,
            ...transformedFields
        };
        createPolicy(policyInput).then(result => {
            if (!result) {
                toast.error('Cannot create policy!')
            } else {
                toast.success('Successfully created policy!');
                updateRules();
                clear();
                closeDialog(dialogId)
            }
        })
    };

    const clear = () => {
        setTitle('');
        setDescription('');
        setSelectedPattern('PROVIDE_ACCESS');
        setDynamicFields({});
    };

    const close = () => {
        clear();
        closeDialog(dialogId);
    };

    const renderDynamicFields = () => {
        if (!selectedPattern || !policyEntriesMapping[selectedPattern]) return null;
        
        return policyEntriesMapping[selectedPattern].map(field => (
            <BasicInput
                key={field.name}
                label={field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                value={dynamicFields[field.name] || ''}
                callback={(value) => handleDynamicFieldChange(field.name, value)}
                type={field.type}
            />
        ));
    };

    return (
        <Dialog 
            dialogId={dialogId} size="auto" 
            className={s['input-dialog']} title="Create Policy"
        >
            <BasicInput label='Policy Title' value={title} callback={setTitle} />
            <BasicInput label='Policy Description' value={description} callback={setDescription} />
            <BasicInput 
                label='Policy Pattern' 
                value={selectedPattern} 
                callback={setSelectedPattern}
                type='select' 
                options={policyPatterns}
            />
            {renderDynamicFields()}
            
            <Section layout='horizontal'>
                <BasicButton variation='primary' icon={<FaSave />} text='Submit' onClick={submit} />
                <BasicButton variation='secondary' text='Cancel' onClick={close} />
            </Section>
        </Dialog>
    );
}

export default CreatePolicy;