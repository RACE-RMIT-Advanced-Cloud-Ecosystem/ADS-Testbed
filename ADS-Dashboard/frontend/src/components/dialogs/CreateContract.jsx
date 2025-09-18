import { toast } from 'react-toastify';
import { useState } from 'react';
import Dialog from "../dialog";
import { useDialog } from "@contexts/AppContext";
import s from "@styles/pages/index.module.css";
import Section from '../dialog/Section';
import BasicInput from "../pages/utils/BasicInput";
import BasicButton from '../pages/utils/BasicButton';
import { FaSave } from "react-icons/fa";
import useIdsApi from '@hooks/useIdsApi';
import useUpdate from '@hooks/useUpdate';
import { getUtcDate } from '@utils/tools';

const dialogId = 'create-contract';

function CreateContract() {
    const { closeDialog } = useDialog();
    const { updateContracts } = useUpdate(); 
    const { createContracts } = useIdsApi();
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [consumer, setConsumer] = useState('');
    const [provider, setProvider] = useState('');

    const submit = () => {
        const contractInput = {
            title,
            description,
            start: startDate ? getUtcDate(startDate).toISOString() : '',
            end: endDate ? getUtcDate(endDate).toISOString() : '',
            ...(consumer && { consumer }),
            ...(provider && { provider })
        };
        createContracts(contractInput).then(result => {
            if (!result) {
                toast.error('Cannot create contract!')
            } else {
                toast.success('Successfully created contract!');
                updateContracts();
                clear();
                closeDialog(dialogId)
            }
        })
    };

    const clear = () => {
        setTitle('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        setConsumer('');
        setProvider('');
    };

    const close = () => {
        clear();
        closeDialog(dialogId);
    };

    return (
        <Dialog 
            dialogId={dialogId} size="auto" 
            className={s['input-dialog']} title="Create Contract"
        >
            <BasicInput label='Contract Title' value={title} callback={setTitle} />
            <BasicInput label='Contract Description' value={description} callback={setDescription} />
            <BasicInput label='Start Date' value={startDate} callback={setStartDate} type='date' />
            <BasicInput label='End Date' value={endDate} callback={setEndDate} type='date' />
            <BasicInput label='Consumer (Optional)' value={consumer} callback={setConsumer} placeholder='Consumer connector endpoint' />
            <BasicInput label='Provider (Optional)' value={provider} callback={setProvider} placeholder='Provider connector endpoint' />
            
            <Section layout='horizontal'>
                <BasicButton variation='primary' icon={<FaSave />} text='Submit' onClick={submit} />
                <BasicButton variation='secondary' text='Cancel' onClick={close} />
            </Section>
        </Dialog>
    );
}

export default CreateContract;