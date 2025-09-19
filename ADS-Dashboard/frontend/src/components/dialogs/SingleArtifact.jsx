import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import {useDialog} from "@contexts/AppContext";
import useDate from "@hooks/useDate";
import useIdsApi from '@hooks/useIdsApi';

import ViewComponent from "../dialog/ViewComponent";
import ViewSection from "../dialog/ViewSection";
import BasicButton from '../pages/utils/BasicButton';

import { FaDownload } from "react-icons/fa";
import { FaCalendarPlus } from "react-icons/fa6";
import { getEntityId } from '../../utils/tools';

import s from "@styles/dialogs/index.module.css";

function SingleArtifact({ props, base = false }) {
    const { openDialog } = useDialog();
    const dateFormattor = useDate();
    const {urlParser} = useIdsApi();
    const [dataUrl, setDataUrl] = useState('');
    const [showDownloadingIndicator, setShowDownloadingIndicator] = useState(false);

    useEffect(() => {
        if (!props) return;
        setDataUrl(urlParser(props._links.data.href));
        setShowDownloadingIndicator(false);
    }, [props, urlParser])

    const startDownloading = useCallback(event => {
        event.stopPropagation();
        setShowDownloadingIndicator(true);
    }, [])

    
    return (
        <ViewSection 
            theme='artifact' title={props?.title} base={base}
            onClick={base ? undefined : ()=>openDialog('view-artifact', props)}
        >
            <ViewComponent keyValue ><FaCalendarPlus /><span>Created At:</span><span>{dateFormattor(props?.creationDate)}</span></ViewComponent>
            <ViewComponent keyValue closer><span>Total Accessed Time:</span><span>{props?.numAccessed}</span></ViewComponent>
            <ViewComponent keyValue closer><span>Size In Bytes:</span><span>{props?.byteSize}</span></ViewComponent>
            <ViewComponent keyValue><span>Created By You?</span><span>{props?.remoteId === 'genesis' ? 'Yes' : 'No'}</span></ViewComponent>

            <ViewComponent fullWidth light further>{ props?.description }</ViewComponent>

            <ViewComponent small further coloured>{ getEntityId(props?._links?.self?.href) }</ViewComponent>
            <BasicButton 
                className={s['fixed-size-btn']} 
                icon={showDownloadingIndicator ? <div className={s['download-indicator']} /> : <FaDownload />} 
                text={showDownloadingIndicator ? undefined : "Download"} variation='theme' link download 
                href={dataUrl} onClick={startDownloading} 
            />
            {
                showDownloadingIndicator &&
                <ViewComponent further closer coloured>Your data is being retrieved from the provider. The download will start once the data has been completely transferred. Please stay on this page...</ViewComponent>
            }
        </ViewSection>
    )
}

SingleArtifact.propTypes = {
    props: PropTypes.object.isRequired,
    base: PropTypes.bool
}

export default SingleArtifact;