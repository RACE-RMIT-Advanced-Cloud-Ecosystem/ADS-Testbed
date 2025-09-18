import PropTypes from "prop-types";
import s from "@styles/pages/utils.module.css";
import BasicButton from "./BasicButton";

function Tab({ name, icon, active, onClick }) {
    return (
        <BasicButton 
            text={name}
            icon={icon}
            variation={active ? 'primary' : 'secondary'}
            onClick={onClick}
            className={s['tab']}
        />
    );
}

Tab.propTypes = {
    name: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
    active: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
}

export default Tab;