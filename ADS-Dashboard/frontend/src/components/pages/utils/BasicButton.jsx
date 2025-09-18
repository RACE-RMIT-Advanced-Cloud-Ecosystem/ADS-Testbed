import PropTypes from "prop-types";
import s from "@styles/pages/utils.module.css";
import c from "clsx";

function BasicButton({ 
    text, icon, className, onClick, variation = 'primary',
    link = false, download = false, disabled = false, ...props 
}) {
    const Component = link ? 'a' : 'div';
    
    return (
        <Component 
            className={c('clickable', s['basic-btn'], s[variation], {[s['disabled']]: disabled}, className)}
            onClick={disabled ? undefined : onClick} download={download || undefined}
            {...props}
        >
            {icon}
            <span>{text}</span>
        </Component>
    );
}

BasicButton.propTypes = {
    text: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    variation: PropTypes.oneOf(['primary', 'secondary', 'theme']),
    link: PropTypes.bool,
}


export default BasicButton;