import s from '@styles/main-layout.module.css'
import LeftNavigation from './Navigation';
import { Outlet } from "react-router";
import TopMenu from './TopMenu';
import StatusPanel from './StatusPanel';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';

import ViewAgreement from './dialogs/ViewAgreement';
import ViewArtifact from './dialogs/ViewArtifact';
import ViewCatalog from './dialogs/ViewCatalog';
import ViewContract from './dialogs/ViewContract';
import ViewPolicy from './dialogs/ViewPolicy';
import ViewRepresentation from './dialogs/ViewRepresentation';
import ViewResource from './dialogs/ViewResource';
import CreateAsset from './dialogs/CreateAsset';
import CreatePolicy from './dialogs/CreatePolicy';
import CreateContract from './dialogs/CreateContract';
import CreateCatalog from './dialogs/CreateCatalog';
import ViewBroker from './dialogs/ViewBroker';
import CreateBroker from './dialogs/CreateBroker';
import ConfirmDeletion from './dialogs/ConfirmDeletion';
import UpdateResourceRegister from './dialogs/UpdateResourceRegister';
import ViewOfferDetails from './dialogs/ViewOfferDetails';
import CreateDataset from './dialogs/CreateDataset';


function MainLayout() {

    const [ expandPanel, setExpandPanel ] = useState(false);

    return (
        <div className={s['main-layout']}>
            <LeftNavigation />
            <TopMenu panelActive={expandPanel} togglePanel={() => setExpandPanel(!expandPanel)} />
            <StatusPanel active={expandPanel} togglePanel={() => setExpandPanel(!expandPanel)} />
            <div className={s['main']}>
                <Outlet />
            </div>

            <ViewAgreement />
            <ViewArtifact />
            <ViewCatalog />
            <ViewContract />
            <ViewPolicy />
            <ViewRepresentation />
            <ViewResource />
            <ViewBroker />

            <CreateAsset />
            <CreatePolicy />
            <CreateContract />
            <CreateCatalog />
            <CreateBroker />
            <CreateDataset />
            
            <UpdateResourceRegister />
            <ViewOfferDetails />
            <ConfirmDeletion />
            
            <ToastContainer />
        </div>
    )
}

export default MainLayout;