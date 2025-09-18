import PropTypes from "prop-types";
import s from '@styles/pages/utils.module.css';
import c from 'clsx';

function SimpleCard({ icon, title, subTitle, iconExtClass, ...args }) {
    return (
        <div className={c(s['simple-card'], s['block'])} {...args}>
            <div className={c(s['icon'], iconExtClass)}>{ icon }</div>
            <div className={s['section-right']}>
                <div className={s['title']}>{ title }</div>
                <div className={s['sub-title']}>{ subTitle }</div>
            </div>
        </div>
    )
}

SimpleCard.propTypes = {
    icon: PropTypes.element,
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,
    iconExtClass: PropTypes.string,
}

export default SimpleCard;
