import PropTypes from 'prop-types'
import s from '@styles/navigation.module.css';

function Section({ title, children }) {
    return (
        <div className={s['section']}>
            { title && <div className={s['section-title']}>{ title }</div> }
            { children }
        </div>
    )
}

Section.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node
}

export default Section;