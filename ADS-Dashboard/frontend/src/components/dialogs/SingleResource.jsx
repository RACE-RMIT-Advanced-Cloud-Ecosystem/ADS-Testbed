// import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import {useDialog} from "@contexts/AppContext";
import useDate from "@hooks/useDate";

import ViewComponent from "../dialog/ViewComponent";
import ViewSection from "../dialog/ViewSection";

import { FaCalendarPlus } from "react-icons/fa6";
import PillTag from '../pages/utils/PillTag';
import { getEntityId } from '../../utils/tools';

function SingleResource({ props, base = false }) {
    const { openDialog } = useDialog();
    const dateFormattor = useDate();
    
    return (
        <ViewSection 
            theme='resource' title={props?.title} base={base}
            onClick={base ? undefined : ()=>openDialog('view-resource', props)}
        >
            <ViewComponent keyValue ><FaCalendarPlus /><span>Created At:</span><span>{dateFormattor(props?.creationDate)}</span></ViewComponent>
            <ViewComponent flex>{ (props?.keywords || []).map(keyword => {{
                return <PillTag theme='resource' key={keyword}>{keyword}</PillTag>
            }}) }</ViewComponent>
            <ViewComponent keyValue closer><span>Published By:</span><span>{props?.publisher}</span></ViewComponent>
            <ViewComponent keyValue closer><span>Sovereign:</span><span>{props?.sovereign}</span></ViewComponent>
            <ViewComponent keyValue closer><span>Language:</span><span>{props?.language}</span></ViewComponent>
            <ViewComponent keyValue closer><span>Endpoint Documentation:</span><span>{props?.endpointDocumentation}</span></ViewComponent>
            <ViewComponent keyValue closer><span>Payment Modality:</span><span>{props?.paymentModality}</span></ViewComponent>

            <ViewComponent fullWidth light further>{ props?.description }</ViewComponent>
            <ViewComponent small further closer coloured>{ getEntityId(props?._links?.self?.href) }</ViewComponent>
        </ViewSection>
    )
}

SingleResource.propTypes = {
    props: PropTypes.object.isRequired,
    base: PropTypes.bool
}

export default SingleResource;