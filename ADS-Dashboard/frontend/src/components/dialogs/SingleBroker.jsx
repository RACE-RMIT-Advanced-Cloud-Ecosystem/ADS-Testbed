import PropTypes from 'prop-types';

import {useDialog} from "@contexts/AppContext";
import useDate from "@hooks/useDate";

import ViewComponent from "../dialog/ViewComponent";
import ViewSection from "../dialog/ViewSection";

import { FaCalendarPlus } from "react-icons/fa6";
import { getEntityId } from '../../utils/tools';

function SingleBroker({ props, base = false }) {
    const { openDialog } = useDialog();
    const dateFormattor = useDate();
    
    return (
        <ViewSection 
            theme='broker' title={props?.title} base={base}
            onClick={base ? undefined : ()=>openDialog('view-broker', props)}
        >
            <ViewComponent keyValue ><FaCalendarPlus /><span>Created At:</span><span>{dateFormattor(props?.creationDate)}</span></ViewComponent>
            <ViewComponent keyValue><span>Location:</span><span>{ props?.location }</span></ViewComponent>

            <ViewComponent fullWidth light further>{ props?.description }</ViewComponent>

            <ViewComponent small further coloured>{ getEntityId(props?._links?.self?.href) }</ViewComponent>
        </ViewSection>
    )
}

SingleBroker.propTypes = {
    props: PropTypes.object.isRequired,
    base: PropTypes.bool
}

export default SingleBroker;