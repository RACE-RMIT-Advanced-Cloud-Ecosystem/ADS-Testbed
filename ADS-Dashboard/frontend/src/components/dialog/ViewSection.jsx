import s from "@styles/dialog.module.css";
import c from "clsx";
import PropTypes from "prop-types";

import PillTag from "../pages/utils/PillTag";
import ViewComponent from "./ViewComponent";

function ViewSection({ theme, children, title, className, base = false, ...pros }) {
    return (
        <div className={c(s['view-section'], theme, className, {'clickable': !base, [s['non-base']]: !base})} {...pros}>
            <ViewComponent flex>
                {theme && <PillTag theme={theme} className={s['tag']}>{ theme.toUpperCase() }</PillTag>}
                {title && <div className={s['title']}>{ title }</div>}
            </ViewComponent>
            { children }
        </div>
    )
}

ViewSection.propTypes = {
    theme: PropTypes.string,
    title: PropTypes.string,
    className: PropTypes.string,
    base: PropTypes.bool,
    children: PropTypes.node.isRequired
}

export default ViewSection;