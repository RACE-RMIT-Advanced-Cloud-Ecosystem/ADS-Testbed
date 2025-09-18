import PropTypes from 'prop-types';

import useDate from "@hooks/useDate";
import {useDialog} from "@contexts/AppContext";

import ViewComponent from "../dialog/ViewComponent";
import ViewSection from "../dialog/ViewSection";
import { useEffect, useState } from "react";

import { FaCalendarTimes, FaCalendarCheck } from "react-icons/fa";
import { FaCalendarPlus } from "react-icons/fa6";
import { getEntityId } from '../../utils/tools';
import { strToJsonStr } from '@utils/tools';
import Collapsible from '../pages/utils/Collapsible';
import useIdsApi from '@hooks/useIdsApi';

function SingleAgreement({ props, base = false }) {
    const dateFormattor = useDate();
    const { openDialog } = useDialog();
    const { validateRuleType } = useIdsApi();

    const [value, setValue] = useState(null);
    const [isExpired, setIsExpired] = useState(false);
    const [agreementId, setAgreementId] = useState(undefined);
    const [ruleType, setRuleType] = useState('');

    useEffect(() => {
        if (!props) return;
        setValue(JSON.parse(props.value));
    }, [props])

    useEffect(() => {
        if (!props?.value) return;
        
        (async () => {
            const type = await validateRuleType(JSON.parse(props.value));
            setRuleType(type);
        })()
    }, [props?.value, validateRuleType])

    useEffect(() => {
        if (!value) return;

        const endDate = new Date(value['ids:contractEnd']['@value']);
        setIsExpired(endDate < new Date());

        const id = value['@id'].split('/').pop();
        setAgreementId(id);
    }, [value])
    
    return (
        <ViewSection 
            theme='agreement' title={agreementId} base={base}
            onClick={base ? undefined : ()=>openDialog('view-agreement', props)}
        >
            <ViewComponent fullWidth flex closer seprate>
                <ViewComponent keyValue ><FaCalendarPlus /><span>Created At:</span><span>{dateFormattor(props?.creationDate)}</span></ViewComponent>
                <ViewComponent keyValue ><FaCalendarCheck /><span>Contract Start Date:</span><span>{dateFormattor(value?.['ids:contractStart']?.['@value'])}</span></ViewComponent>
                <ViewComponent keyValue ><FaCalendarTimes /><span>Contract End Date:</span><span>{dateFormattor(value?.['ids:contractEnd']?.['@value'])}</span></ViewComponent>
            </ViewComponent>

            <ViewComponent keyValue closer><span>Provider:</span><span>{value?.['ids:provider']?.['@id']}{props?.remoteId === 'genesis' ? ' (You)' : ''}</span></ViewComponent>
            <ViewComponent keyValue ><span>Consumer:</span><span>{value?.['ids:consumer']?.['@id']}{props?.remoteId !== 'genesis' ? ' (You)' : ''}</span></ViewComponent>

            <ViewComponent keyValue closer><span>Agreement Confirmed?</span><span>{props?.confirmed ? 'Yes' : 'No'}</span></ViewComponent>
            <ViewComponent keyValue ><span>Agreement Expired?</span><span>{isExpired ? 'Yes' : 'No'}</span></ViewComponent>
            { (props?.value && ruleType) && <ViewComponent keyValue further><span>Rule Type: </span><span>{ruleType}</span></ViewComponent> }
            <ViewComponent small further closer coloured>{ getEntityId(props?._links?.self?.href) }</ViewComponent>
            {
                props?.value &&

                <Collapsible summary="Expand to view policy in JSON format" stopPropagation>
                    <ViewComponent fullWidth light further code="json">{ strToJsonStr(props?.value) }</ViewComponent>
                </Collapsible>
            }
        </ViewSection>
    )
}

SingleAgreement.propTypes = {
    props: PropTypes.object.isRequired,
    base: PropTypes.bool
}

export default SingleAgreement;