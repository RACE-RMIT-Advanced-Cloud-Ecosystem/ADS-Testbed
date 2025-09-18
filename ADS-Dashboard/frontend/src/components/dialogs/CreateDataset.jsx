import { useEffect, useMemo, useState } from 'react';
import Dialog from "../dialog";
import { useDialog, useConnectors } from "@contexts/AppContext";
import s from "@styles/pages/create-dataset.module.css";
import si from "@styles/pages/index.module.css";
import Section from '../dialog/Section';
import BasicInput from "../pages/utils/BasicInput";
import BasicButton from '../pages/utils/BasicButton';
import { IoMdCloudUpload } from "react-icons/io";
import { FaSave } from "react-icons/fa";
import FileInput from '../pages/utils/FileInput';
import { uploadDataset, updateDataset } from '@utils/api';
import useUpdate from '@hooks/useUpdate';
import { toast } from 'react-toastify';
import ViewComponent from '../dialog/ViewComponent';

const dialogId = 'create-dataset';

function CreateDataset() {
    const { activeConnector } = useConnectors();
    const { closeDialog, dialogData } = useDialog();
    const props = useMemo(()=>dialogData[dialogId], [dialogData]);
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [resetTrigger, setResetTrigger] = useState(true);
    const { updateDatasets } = useUpdate();

    useEffect(() => {
        setTitle(props?.name || '');
        setDescription(props?.description || '');
    }, [props]);

    useEffect(() => {
        if (file) {
            if (!title && file.name) {
                setTitle(file.name);
            }
        }
    }, [file, title])

    const submit = async () => {
        if (!props && !file) return;
        
        setUploading(true);
        try {
            if (props) {
                await updateDataset(activeConnector, props.id, title, description);
                toast.success('Dataset updated successfully');
            } else {
                await uploadDataset(activeConnector, file, title, description);
                toast.success('Dataset uploaded successfully');
            }
            updateDatasets();
        } catch (error) {
            console.error(props ? 'Update failed:' : 'Upload failed:', error);
            toast.error(`Failed to ${props ? 'update' : 'upload'} dataset: ${error.message}`);
        } finally {
            setUploading(false);
            close();
        }
    };

    const onFileSelected = (files) => {
        files?.length && setFile(files[0]);
    }

    const clear = () => {
        setTitle('');
        setDescription('');
        setFile(null);
        setResetTrigger(!resetTrigger);
    };

    const close = () => {
        clear();
        closeDialog(dialogId);
    };

    return (
        <Dialog 
            dialogId={dialogId} size="auto" 
            className={si['input-dialog']} title={props ? "Edit Dataset" : "Create Dataset"}
        >

            <BasicInput label='Dataset Title' value={title} callback={setTitle} />
            <BasicInput label='Dataset Description' value={description} callback={setDescription} />
            {
                props ? 
                <ViewComponent light further>To change the dataset, please delete and create a new one!</ViewComponent> :
                <FileInput label='Select File To Upload' callback={onFileSelected} resetTrigger={resetTrigger}>
                    {
                        file ?
                        <div className={s['file-info']}>
                            <div className={s['filetype']}>{file.type || 'Unknown Type'}</div>
                            <div className={s['filename']}>{file.name}</div>
                            <div className={s['filesize']}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div> :
                        <div className={s['empty-file']}>Click to Browse...</div>
                    }
                </FileInput>
            }
            
            <Section layout='horizontal'>
                <BasicButton 
                    variation='primary' 
                    icon={props ? <FaSave /> : <IoMdCloudUpload />} 
                    text={props ? 'Update' : uploading ? 'Uploading...' : 'Upload'} 
                    onClick={submit} 
                    disabled={!props && (!file || uploading)}
                />
                <BasicButton variation='secondary' text='Cancel' onClick={close} />
            </Section>
        </Dialog>
    );
}

export default CreateDataset;