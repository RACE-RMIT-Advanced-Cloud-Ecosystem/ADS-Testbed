import { useEffect, useState, useMemo, useCallback } from "react";
import Dialog from "../dialog";
import { useDialog } from "@contexts/AppContext";
import useIdsApi from "@hooks/useIdsApi";
import ViewComponent from "../dialog/ViewComponent";
import Section from "../dialog/Section";
import PillTag from "../pages/utils/PillTag";
import useDate from "@hooks/useDate";
import { FaCalendarTimes, FaCalendarCheck } from "react-icons/fa";
import { FaCalendarPlus } from "react-icons/fa";
import s from "@styles/pages/view-offer-details.module.css";
import c from "clsx";
import { TbRefresh } from "react-icons/tb";
import BasicButton from "../pages/utils/BasicButton";
import { toast } from "react-toastify";
import { getUrlByEndpoint } from "@utils/tools";
import useUpdate from "@hooks/useUpdate"

const dialogId = 'view-offer-details';

function ViewOfferDetails() {

    const { dialogData, closeDialog } = useDialog();
    const { brokerSearch, getConnectorEndpoint, requestResource, getResourceDescription } = useIdsApi();
    const dateFormattor = useDate();
    const { updateAgreements, updateRequests } = useUpdate();
    const props = useMemo(() => dialogData[dialogId], [dialogData]);

    const [offerDetails, setOfferDetails] = useState(null);
    const [mediaTypes, setMediaTypes] = useState({});
    const [loading, setLoading] = useState(false);

    const getMediaTypes = useCallback(async (brokerLocation, accessUrl) => {
        const result = await brokerSearch(brokerLocation, accessUrl, 'id');
        setMediaTypes(prev => ({
            ...prev,
            [accessUrl]: result?.[accessUrl]?.filenameExtension || null
        }))
    }, [brokerSearch])

    const close = useCallback(() => {
        setOfferDetails(null);
        setLoading(false);
        setMediaTypes({});
        closeDialog(dialogId);
    }, [closeDialog])

    useEffect(() => {
        if (!props || !props.brokerLocation || !props.accessUrl) {
            setOfferDetails(null);
            return;
        }

        (async () => {
            const brokerLocation = props.brokerLocation;

            const response = await brokerSearch(brokerLocation, props.accessUrl, 'id');
            if (!response) {
                setOfferDetails(null);
                return;
            }

            const details = response[props.accessUrl];
            const contractOfferId = details.contractOffer;
            const contractOffer = response[contractOfferId];
            const permissionsId = contractOffer.permission;
            const permissions = [];
            (typeof permissionsId === 'string' ? [permissionsId] : permissionsId).forEach(permissionId => {
                const permission = response[permissionId];
                const constraint = response[permission.constraint];
                permission.constraint = constraint;
                permissions.push(permission);
            });
            const representations = [];
            (typeof details.representation === 'string' ? [details.representation] : details.representation).forEach(representationId => {
                const representation = response[representationId];
                representation.mediaType && getMediaTypes(brokerLocation, representation.mediaType);
                const artifact = response[representation.instance];
                representation.instance = artifact;
                representations.push(representation);
            });
            details.representation = representations;
            contractOffer.permission = permissions;
            details.contractOffer = contractOffer;
            setOfferDetails(details);
        })();
    }, [brokerSearch, props, getMediaTypes])

    const submitRequest = useCallback(async () => {
        if (!offerDetails || loading) return;

        setLoading(true);
        const connectorEndpoint = await getConnectorEndpoint(props.accessUrl, props.brokerLocation);
        if (!connectorEndpoint) {
            toast.error('Failed to get connector endpoint, please consule the publisher directly!');
            close();
            return;
        }

        const artifactIds = offerDetails.representation.map(r => getUrlByEndpoint(connectorEndpoint, r.instance.sameAs));
        const resourceDescription = await getResourceDescription(connectorEndpoint, offerDetails.sameAs);
        if (!resourceDescription) {
            toast.error('Failed to get resource description, please consule the publisher directly!');
            close();
            return;
        }

        const permissions = resourceDescription['ids:contractOffer']?.[0]?.['ids:permission'];
        const rulesList = [];
        artifactIds.forEach(artifactId => {
            permissions.forEach(permission => {
                rulesList.push({ ...permission, 'ids:target': artifactId })
            })
        });

        const request = await requestResource(connectorEndpoint, getUrlByEndpoint(connectorEndpoint, offerDetails.sameAs), artifactIds, false, rulesList);
        if (!request) {
            toast.error('Failed to request resource, please consule the publisher directly!');
        } else {
            toast.success('Resource requested successfully!');
            updateAgreements();
            updateRequests();
        }
        close();
    }, [
        close, loading, getConnectorEndpoint, getResourceDescription, 
        offerDetails, props?.accessUrl, props?.brokerLocation, requestResource,
        updateAgreements, updateRequests
    ])

    return (
        <Dialog dialogId={dialogId} title={`Viewing ${offerDetails?.title}`} size="large">
            {
            offerDetails ? <>
            <Section className={c('resource', s['section'])}>
                <ViewComponent title coloured>{ offerDetails.title }</ViewComponent>
                <ViewComponent keyValue ><FaCalendarPlus /><span>Created At:</span><span>{dateFormattor(offerDetails.created)}</span></ViewComponent>
                    { 
                        offerDetails.keyword && 
                        <ViewComponent flex>
                            {(typeof offerDetails.keyword === 'object' && Array.isArray(offerDetails.keyword) ? offerDetails.keyword : [offerDetails.keyword]).map(keyword => <PillTag key={keyword}>{keyword}</PillTag>)}
                        </ViewComponent>
                    }
                    { 
                        offerDetails.sample && 
                        <ViewComponent flex>
                            {(typeof offerDetails.sample === 'object' && Array.isArray(offerDetails.sample) ? offerDetails.sample : [offerDetails.sample]).map(sample => <PillTag key={sample}>{sample}</PillTag>)}
                        </ViewComponent>
                    }
                {offerDetails.language && <ViewComponent keyValue closer><span>Language:</span><span>{offerDetails.language || 'Unknown'}</span></ViewComponent>}
                {offerDetails.publisher && <ViewComponent keyValue closer><span>Publisher:</span><span>{offerDetails.publisher || 'Unknown'}</span></ViewComponent>}
                {offerDetails.standardLicense && <ViewComponent keyValue closer><span>License:</span><span>{offerDetails.license || 'Unknown'}</span></ViewComponent>}
                {offerDetails.version && <ViewComponent keyValue closer><span>Version:</span><span>{offerDetails.version || 'Unknown'}</span></ViewComponent>}
                <ViewComponent fullWidth light>{ offerDetails.description }</ViewComponent>
            </Section>
            {
                (offerDetails.representation || []).map((representation, index) => {
                    const { created, language, mediaType, instance }  = representation;
                    const { fileName } = instance;
                    const realMediaType = 
                        typeof mediaTypes[mediaType] === 'undefined' ? <TbRefresh className="loading" /> :
                        mediaTypes[mediaType] === null ? "Unknown" : mediaTypes[mediaType];
                        
                    return (
                        <Section key={index} className={c('representation', s['section'], s['sub-section'])}>
                            <ViewComponent title coloured>Representation {index + 1}</ViewComponent>
                            <ViewComponent keyValue><FaCalendarPlus /><span>Created At:</span><span>{dateFormattor(created)}</span></ViewComponent>
                            <ViewComponent keyValue closer><span>Language:</span><span>{language || 'Unknown'}</span></ViewComponent>
                            <ViewComponent keyValue closer><span>Media Type:</span><span>{realMediaType}</span></ViewComponent>
                            <ViewComponent keyValue closer><span>Filename:</span><span>{fileName || 'Unknown'}</span></ViewComponent>
                        </Section>
                    )
                }
               )
            }
            <Section className={c('contract', s['section'])}>
                <ViewComponent title coloured>Contract</ViewComponent>
                <ViewComponent fullWidth flex closer seprate>
                    <ViewComponent keyValue ><FaCalendarPlus /><span>Contract Date:</span><span>{dateFormattor(offerDetails.contractOffer?.contractDate)}</span></ViewComponent>
                    <ViewComponent keyValue ><FaCalendarCheck /><span>Start Date:</span><span>{dateFormattor(offerDetails.contractOffer?.contractStart)}</span></ViewComponent>
                    <ViewComponent keyValue ><FaCalendarTimes /><span>End Date:</span><span>{dateFormattor(offerDetails.contractOffer?.contractEnd)}</span></ViewComponent>
                </ViewComponent>
                {
                    (offerDetails.contractOffer?.permission || []).map((permission, index) =>
                        <Section key={index} className={c('policy', s['section'], s['sub-section'])}>
                            <ViewComponent title coloured further>Permission {index + 1}</ViewComponent>
                            <ViewComponent keyValue closer><span>Title:</span><span>{permission.title || 'Unknown'}</span></ViewComponent>
                            <ViewComponent keyValue closer><span>Description:</span><span>{permission.description || 'Unknown'}</span></ViewComponent>
                            <ViewComponent keyValue closer><span>Action:</span><span>{permission.action || 'Unknown'}</span></ViewComponent>
                            <ViewComponent flex closer seprate coloured>{ permission.constraint?.leftOperand } - {permission.constraint?.operator} - {permission.constraint?.rightOperand}</ViewComponent>
                        </Section>
                    )
                }
            </Section>
            <ViewComponent flex>
                <BasicButton icon={loading ? <TbRefresh className="loading" /> : undefined} text={loading ? "Requesting Resource..." : "Request Resource"} onClick={submitRequest} />
                <BasicButton variation="secondary" text="Cancel" onClick={()=>closeDialog(dialogId)} />
            </ViewComponent>
            </>:
            <ViewComponent flex><TbRefresh className="loading" /><span>Loading offer information, please wait...</span></ViewComponent>
            }
        </Dialog>
    )
}

export default ViewOfferDetails;
