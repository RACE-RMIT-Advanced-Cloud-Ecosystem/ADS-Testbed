import s from "@styles/dialog.module.css"
import c from "clsx";
import PropTypes from "prop-types";

function Section({ children, layout = 'vertical', className, ...props }) {
    return (
        <div className={c(s['section'], s[layout], className)} {...props}>
            { children }
        </div>
    )
}

Section.propTypes = {
    children: PropTypes.node,
    layout: PropTypes.oneOf(['vertical', 'horizontal', 'horizontal-reverse']),
    className: PropTypes.string
}

export default Section;