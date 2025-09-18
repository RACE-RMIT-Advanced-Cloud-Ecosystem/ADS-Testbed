import PropTypes from 'prop-types';

import useDate from "@hooks/useDate";
import {useDialog} from "@contexts/AppContext";

import ViewComponent from "../dialog/ViewComponent";
import ViewSection from "../dialog/ViewSection";

import { FaCalendarPlus } from "react-icons/fa6";
import { getEntityId } from '../../utils/tools';

function SingleCatalog({ props, base = false }) {
    const { openDialog } = useDialog();
    const dateFormattor = useDate();
    
    return (
        <ViewSection 
            theme='catalog' title={props?.title} base={base}
            onClick={base ? undefined : ()=>openDialog('view-catalog', props)}
        >
            <ViewComponent keyValue ><FaCalendarPlus /><span>Created At:</span><span>{dateFormattor(props?.creationDate)}</span></ViewComponent>
            <ViewComponent fullWidth light further>{ props?.description }</ViewComponent>
            <ViewComponent small further closer coloured>{ getEntityId(props?._links?.self?.href) }</ViewComponent>
        </ViewSection>
    )
}

SingleCatalog.propTypes = {
    props: PropTypes.object.isRequired,
    base: PropTypes.bool
}

export default SingleCatalog;