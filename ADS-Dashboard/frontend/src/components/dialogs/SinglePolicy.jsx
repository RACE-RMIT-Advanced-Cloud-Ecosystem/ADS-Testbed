import PropTypes from 'prop-types';

import useDate from "@hooks/useDate";
import {useDialog, useEnums} from "@contexts/AppContext";

import ViewComponent from "../dialog/ViewComponent";
import ViewSection from "../dialog/ViewSection";

import { FaCalendarPlus } from "react-icons/fa6";
import { strToJsonStr } from '@utils/tools';
import policyTypeMapping from '@utils/policyTypeMapping';
import Collapsible from '../pages/utils/Collapsible';
import { useEffect, useState } from 'react';
import { getEntityId } from '@utils/tools';

function SinglePolicy({ props, base = false }) {
    const { openDialog } = useDialog();
    const { enums } = useEnums();
    const dateFormattor = useDate();
    const [ policyDescription, setPolicyDescription ] = useState(''); 

    useEffect(() => {
        if (!props || !enums) return;
        const desc = enums.POLICY_PATTERN.filter(e=>e.jsonInput === props.type)[0]?.displayName;
        setPolicyDescription(desc);
    }, [props, enums])
    
    return (
        <ViewSection 
            theme='policy' title={props?.title} base={base}
            onClick={base ? undefined : ()=>openDialog('view-policy', props)}
        >
            <ViewComponent keyValue ><FaCalendarPlus /><span>Created At:</span><span>{dateFormattor(props?.creationDate)}</span></ViewComponent>
            <ViewComponent keyValue closer><span>Policy Type:</span><span>{ policyTypeMapping[props?.type] } ( {props?.type} )</span></ViewComponent>
            <ViewComponent keyValue><span>Policy Description:</span><span>{ policyDescription }</span></ViewComponent>
            <ViewComponent fullWidth light further>{ props?.description }</ViewComponent>
            <ViewComponent small further closer coloured>{ getEntityId(props?._links?.self?.href) }</ViewComponent>
            <Collapsible summary="Expand to view policy in JSON format" stopPropagation>
                <ViewComponent fullWidth light further code="json">{ strToJsonStr(props?.value) }</ViewComponent>
            </Collapsible>
        </ViewSection>
    )
}

SinglePolicy.propTypes = {
    props: PropTypes.object.isRequired,
    base: PropTypes.bool
}

export default SinglePolicy;