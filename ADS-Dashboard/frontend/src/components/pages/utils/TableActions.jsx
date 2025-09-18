import s from "@styles/pages/utils.module.css";
import c from "clsx";
import PropTypes from "prop-types";

function TableActions({ children, className = '', ...props }) {
    return (
        <div className={c(s['table-actions'], 'flexbox', className)} {...props}>
            { children }
        </div>
    )
}

TableActions.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
}

export default TableActions;