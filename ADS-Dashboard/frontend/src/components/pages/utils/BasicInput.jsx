import PropTypes from 'prop-types';
import s from "@styles/pages/utils.module.css";
import c from "clsx";

function Option({ label, value, groupName, items }) {
    return (
        groupName ?
        <optgroup label={groupName}>
            {
                items.map(({label, value}, index) => (
                    <option key={index} value={value}>{label}</option>
                ))
            }
        </optgroup> :
        <option value={value}>{label}</option>
    )
}  

function BasicInput({ 
    type = 'text', label, description, icon, className, 
    value, callback, options = [], iconClickAction = undefined,
    ...props
}) {
    return (
        <div className={c(s['basic-input'], className)}>
            { label && <div className={s['label']}>{label}</div> }
            <div className={s['input-wrapper']}>
                { icon && <div className={s['icon']} onClick={iconClickAction}>{icon}</div> }
                {
                    type == 'select' ?
                    <select onChange={event=>callback(event.target.value)} value={value ?? ''} {...props}>
                        { 
                            options.map(option => {
                                return <Option key={option.label || option.groupName} {...option} />
                            })
                        }
                    </select> :
                    <input type={type} value={value} onChange={event=>callback(event.target.value)} {...props} />
                }
            </div>
            { description && <div className={s['description']}>{description}</div> }
        </div>
    )
}

BasicInput.propTypes = {
    type: PropTypes.string,
    label: PropTypes.string,
    description: PropTypes.string,
    icon: PropTypes.node,
    className: PropTypes.string,
    value: PropTypes.string,
    callback: PropTypes.func,
    options: PropTypes.array,
    iconClickAction: PropTypes.func
}

export default BasicInput;