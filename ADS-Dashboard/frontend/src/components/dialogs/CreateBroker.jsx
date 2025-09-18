import { useDialog } from '@contexts/AppContext';
import { useState } from 'react';
import useUpdate from '@hooks/useUpdate';
import useIdsApi from '../../hooks/useIdsApi';
import { toast } from "react-toastify";

import s from "@styles/pages/index.module.css";

import Dialog from '@components/dialog';
import BasicInput from '../pages/utils/BasicInput';
import BasicButton from '../pages/utils/BasicButton';
import Section from '@components/dialog/Section';

import { FaSave } from "react-icons/fa";

const dialogId = 'create-broker';

function CreateBroker() {
    const {closeDialog} = useDialog();
    const { createBroker } = useIdsApi();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');

    const { updateBrokers } = useUpdate();

    const clearAll = () => {
        setTitle('');
        setDescription('');
        setLocation('');
    }

    const close = () => {
        closeDialog(dialogId);
        clearAll();
    }

    const submit = async () => {
        if (!location) {
            toast.error('Please fill broker location!');
            return;
        }

        const newBroker = {
            title,
            description,
            location,
        };

        if (await createBroker(newBroker)) {
            toast.success('Broker added successfully');
            updateBrokers();
        } else {
            toast.error('Failed to add broker');
        }
        close();
    }

    return (
        <Dialog 
            title="New Broker" dialogId={dialogId} 
            size='auto' className={s['input-dialog']}
        >
            <Section>
                <BasicInput 
                    label="Title"
                    value={title} 
                    callback={setTitle}
                />
                <BasicInput 
                    label="Description"
                    value={description} 
                    callback={setDescription}
                />
                <BasicInput 
                    label="Location (URL)"
                    value={location} 
                    callback={setLocation}
                    placeholder="e.g. https://broker-reverseproxy/infrastructure"
                />
            </Section>
            <Section layout='horizontal'>
                <BasicButton variation='primary' icon={<FaSave />} text='Submit' onClick={submit} />
                <BasicButton variation='secondary' text='Cancel' onClick={close} />
            </Section>
        </Dialog>
    );
}

export default CreateBroker;