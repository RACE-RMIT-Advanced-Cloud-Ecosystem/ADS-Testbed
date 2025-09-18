import s from "@styles/pages/utils.module.css";
import c from "clsx";
import { useRef } from "react";
import { useEffect } from "react";
import { useCallback } from "react";

function FileInput({
    label, description, icon, className, resetTrigger, 
    children, callback, iconClickAction, ...props
}) {

    const fileOnChange = useCallback(event => {
        const files = event.target.files;
        callback && callback(files);
    }, [callback])

    const fileInputRef = useRef(null);
    useEffect(() => {
        fileInputRef.current.value = null;
    }, [resetTrigger])

    return (
        <div className={c(s['basic-input'], s['file-input'], className)}>
            { label && <div className={s['label']}>{label}</div> }
            <div className={s['input-wrapper']}>
                { icon && <div className={s['icon']} onClick={iconClickAction}>{icon}</div> }
                <div className={c(s['file-input-wrapper'], 'clickable')}>
                    <input ref={fileInputRef} type="file" className="clickable" onChange={fileOnChange} {...props} />
                    { children }
                </div>
            </div>
            { description && <div className={s['description']}>{description}</div> }
        </div>
    )
}

export default FileInput;