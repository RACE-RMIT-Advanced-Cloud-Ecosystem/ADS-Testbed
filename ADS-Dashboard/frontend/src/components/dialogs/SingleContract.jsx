import PropTypes from 'prop-types';

import useDate from "@hooks/useDate";
import {useDialog} from "@contexts/AppContext";

import ViewComponent from "../dialog/ViewComponent";
import ViewSection from "../dialog/ViewSection";

import { FaCalendarTimes, FaCalendarCheck } from "react-icons/fa";
import { FaCalendarPlus } from "react-icons/fa6";
import { getEntityId } from '../../utils/tools';

function SingleContract({ props, base = false }) {
    const { openDialog } = useDialog();
    const dateFormattor = useDate();
    
    return (
        <ViewSection 
            theme='contract' title={props?.title} base={base}
            onClick={base ? undefined : ()=>openDialog('view-contract', props)}
        >
            <ViewComponent fullWidth flex closer seprate>
                <ViewComponent keyValue ><FaCalendarPlus /><span>Created At:</span><span>{dateFormattor(props?.creationDate)}</span></ViewComponent>
                <ViewComponent keyValue ><FaCalendarCheck /><span>Start Date:</span><span>{dateFormattor(props?.start)}</span></ViewComponent>
                <ViewComponent keyValue ><FaCalendarTimes /><span>End Date:</span><span>{dateFormattor(props?.end)}</span></ViewComponent>
            </ViewComponent>

            <ViewComponent fullWidth light further>{ props?.description }</ViewComponent>
            <ViewComponent small further closer coloured>{ getEntityId(props?._links?.self?.href) }</ViewComponent>
        </ViewSection>
    )
}

SingleContract.propTypes = {
    props: PropTypes.object.isRequired,
    base: PropTypes.bool
}

export default SingleContract;