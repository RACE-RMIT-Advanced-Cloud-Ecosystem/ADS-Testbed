import s from "@styles/dialog.module.css";
import c from "clsx";
import PropTypes from "prop-types";

function ViewMultiSection({ icon, title, className, children, ...props }) {
    return (
        <div className={c(s['view-multi-section'], className)} {...props}>
            <div className={c(s['header'], 'flexbox')}>
                { icon && <div className={s['icon']}>{ icon }</div> }
                { title && <div className={s['title']}>{ title }</div> }
            </div>
            <div className={s['body']}>
                { children }
            </div>
        </div>
    )
}

ViewMultiSection.propTypes = {
    icon: PropTypes.node,
    title: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node.isRequired
}

export default ViewMultiSection;
