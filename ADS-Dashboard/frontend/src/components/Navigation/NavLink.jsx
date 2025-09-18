import PropTypes from 'prop-types'
import { Link, useLocation } from 'react-router';
import c from 'clsx';
import s from '@styles/navigation.module.css';

function NavLink({ title, icon, className, to, ...props }) {
    const location = useLocation();
    const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
    
    return (
        <Link className={c(s['nav-link'], isActive && s['active'], className)} to={to} {...props}>
            { icon }
            { title && <div className={s['title']}>{ title }</div> }
        </Link>
    );
}

NavLink.propTypes = {
    title: PropTypes.string,
    icon: PropTypes.node,
    className: PropTypes.string,
    to: PropTypes.string,
}

export default NavLink;