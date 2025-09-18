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

const dialogId = 'create-catalog';

function CreateCatalog() {
    const { closeDialog } = useDialog();
    const { createCatalogs } = useIdsApi();
    const { updateCatalogs } = useUpdate();
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const submit = () => {
        const catalogInput = {
            title,
            description
        };
        createCatalogs(catalogInput).then(result => {
            if (!result) {
                toast.error('Cannot create catalog!')
            } else {
                toast.success('Successfully created catalog! Please update your connector in brokers page in order to post resources to it.');
                updateCatalogs();
                clear();
                closeDialog(dialogId)
            }
        })
    };

    const clear = () => {
        setTitle('');
        setDescription('');
    };

    const close = () => {
        clear();
        closeDialog(dialogId);
    };

    return (
        <Dialog 
            dialogId={dialogId} size="auto" 
            className={s['input-dialog']} title="Create Catalog"
        >
            <BasicInput label='Catalog Title' value={title} callback={setTitle} />
            <BasicInput label='Catalog Description' value={description} callback={setDescription} />
            
            <Section layout='horizontal'>
                <BasicButton variation='primary' icon={<FaSave />} text='Submit' onClick={submit} />
                <BasicButton variation='secondary' text='Cancel' onClick={close} />
            </Section>
        </Dialog>
    );
}

export default CreateCatalog;