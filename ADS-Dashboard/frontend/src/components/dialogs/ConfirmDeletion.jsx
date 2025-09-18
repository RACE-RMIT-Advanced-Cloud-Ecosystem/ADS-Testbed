import { useDialog, useConnectors } from "@contexts/AppContext";
import Dialog from "../dialog";
import BasicButton from "../pages/utils/BasicButton";
import useIdsApi from "@hooks/useIdsApi";
import useUpdate from "@hooks/useUpdate";
import { useState } from "react";
import { toast } from "react-toastify";
import { AiOutlineLoading } from 'react-icons/ai';
import c from "clsx";
import s from "@styles/dialog.module.css"
import { deleteDataset, deleteConnector } from "../../utils/api";

const dialogId = 'confirm-deletion';

function ConfirmDeletion() {
    const {dialogData, closeDialog} = useDialog();
    const {deleteEntity, idsGetAssociation} = useIdsApi();
    const { connectors, activeConnector, updateConnectorsList } = useConnectors();
    const {
        updateArtifacts,
        updateRepresentations,
        updateResources,
        updateCatalogs,
        updateContracts,
        updateRequests,
        updateRules,
        updateBrokers,
        updateConnectors,
        updateDatasets,
    } = useUpdate();
    const [loading, setLoading] = useState(false);

    const deletion = async () => {
        if (!dialogData?.[dialogId]) {
            return;
        }

        const type = dialogData[dialogId].type;
        const url = dialogData[dialogId].url;
        setLoading(true);

        if (type === 'dataset') {
            await deleteDataset(activeConnector, url);
            await updateDatasets();
        } else if (type === 'connector') {
            if (activeConnector === url) {
                toast.error('Cannot delete active connector!');
                closeDialog(dialogId);
                return;
            }
            if (await deleteConnector(url)) {
                updateConnectorsList(connectors.filter(connector => connector.id !== url));
            } else {
                toast.error('Error when deleting connector!');
            }
        } else {
            if (type === 'asset') {
                const artifacts = await idsGetAssociation(`${url}/artifacts`, 'artifacts');
                for (const artifact of artifacts) {
                    await deleteEntity(artifact._links.self.href);
                }
            }
            
            await deleteEntity(url);
        }
        setLoading(false);
        switch(type) {
            case 'asset': 
                updateArtifacts();
                updateRepresentations(); 
                break;
            case 'resource': updateResources(); break;
            case 'catalog': updateCatalogs(); break;
            case 'contract': updateContracts(); break;
            case 'request': updateRequests(); break;
            case 'policy': updateRules(); break;
            case 'broker': updateBrokers(); break;
            case 'connector': updateConnectors(); break;
        }
        closeDialog(dialogId);
        toast.success(`Successfully deleted ${type}`)
    }

    return (
        <Dialog title="Confirm Deletion" size="small" dialogId={dialogId}>
            Are you sure you want to delete {dialogData?.[dialogId]?.type} "{dialogData?.[dialogId]?.title}"?
            <div className={c("flexbox", s['buttons-on-bottom'])}>
                <BasicButton text="Cancel" variation="secondary" onClick={() => closeDialog(dialogId)} />
                <BasicButton text={loading ? <AiOutlineLoading className="loading" /> : "Confirm"} variation="theme" className="negative" onClick={deletion} />
            </div>
        </Dialog>
    )
}

export default ConfirmDeletion;