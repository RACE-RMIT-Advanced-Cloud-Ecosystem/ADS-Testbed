import PropTypes from "prop-types";
import s from "@styles/pages/utils.module.css";
import c from "clsx";

function PillTag({ children, theme, className = '', ...props }) {
    return (
        <div className={c(s['pill-tag'], theme, className)} {...props}>
            {children}
        </div>
    )
}

PillTag.propTypes = {
    children: PropTypes.node.isRequired,
    theme: PropTypes.string,
    className: PropTypes.string
}

export default PillTag;