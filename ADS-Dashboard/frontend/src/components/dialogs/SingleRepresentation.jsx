import PropTypes from 'prop-types';

import useDate from "@hooks/useDate";
import {useDialog} from "@contexts/AppContext";

import ViewComponent from "../dialog/ViewComponent";
import ViewSection from "../dialog/ViewSection";

import { FaCalendarPlus } from "react-icons/fa6";
import { getEntityId } from '../../utils/tools';

function SingleRepresentation({ props, base = false }) {
    const { openDialog } = useDialog();
    const dateFormattor = useDate();
    
    return (
        <ViewSection 
            theme='representation' title={props?.title} base={base}
            onClick={base ? undefined : ()=>openDialog('view-representation', props)}
        >
            <ViewComponent keyValue ><FaCalendarPlus /><span>Created At:</span><span>{dateFormattor(props?.creationDate)}</span></ViewComponent>
            <ViewComponent keyValue closer><span>Media Type:</span><span>{props?.mediaType}</span></ViewComponent>
            <ViewComponent keyValue closer><span>Language:</span><span>{props?.language}</span></ViewComponent>
            <ViewComponent keyValue><span>Created By You?</span><span>{props?.remoteId === 'genesis' ? 'Yes' : 'No'}</span></ViewComponent>

            <ViewComponent fullWidth light further>{ props?.description }</ViewComponent>
            <ViewComponent small further closer coloured>{ getEntityId(props?._links?.self?.href) }</ViewComponent>
        </ViewSection>
    )
}

SingleRepresentation.propTypes = {
    props: PropTypes.object.isRequired,
    base: PropTypes.bool
}

export default SingleRepresentation;