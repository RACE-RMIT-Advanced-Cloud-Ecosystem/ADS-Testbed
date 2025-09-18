import s from "@styles/pages/utils.module.css";
import c from "clsx";
import PropTypes from "prop-types";

function Collapsible({ summary, children, className, stopPropagation = false, ...props }) {
    return (
        <details 
            className={c(s['collapsible'], className)} 
            onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
            {...props}
        >
            <summary className={c('clickable', s['summary'])}>
                { summary }
            </summary>
            { children }
        </details>
    )
}

Collapsible.propTypes = {
    summary: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string
}

export default Collapsible;