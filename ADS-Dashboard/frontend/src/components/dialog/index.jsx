import { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types'
import s from "@styles/dialog.module.css";
import c from "clsx";
import { useDialog } from '@contexts/AppContext';
import { IoClose } from "react-icons/io5";
import Section from './Section';

function Dialog({ 
    title, className = '', size = 'small', 
    layout = 'vertical',
    children, dialogId, clickToClose = true 
}) {
    const dialogRef = useRef(null);
    const {dialogs: state, closeDialog} = useDialog();

    const dialogOnClick = useCallback(event => {
        if (event.target === dialogRef.current && clickToClose) {
            closeDialog(dialogId);
        }
    }, [clickToClose, closeDialog, dialogId]);

    useEffect(() => {
        if (dialogRef.current) {
            if (state[dialogId]) {
                dialogRef.current.showModal();
            } else {
                dialogRef.current.close();
            }
        }
    }, [state, dialogId]);

    return (
        <dialog 
            ref={dialogRef} onClick={dialogOnClick} className={s['dialog']}
            onClose={() => closeDialog(dialogId)}
        >
            <div onClick={e => e.stopPropagation()} className={c(s['main'], s[size], className)}>
                <div className={s['header']}>
                    { title && <div className={s['title']}>{ title }</div> }
                    <IoClose 
                        className={c(s['close-btn'], 'clickable')} 
                        onClick={() => closeDialog(dialogId)}
                    />
                </div>
                <Section layout={layout} className={s['body']}>
                    { children }
                </Section>
            </div>
        </dialog>
    );
}

Dialog.propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    layout: PropTypes.oneOf(['vertical', 'horizontal']),
    size: PropTypes.oneOf(['small', 'medium', 'large', 'auto']),
    children: PropTypes.node.isRequired,
    dialogId: PropTypes.string.isRequired,
    clickToClose: PropTypes.bool,
};

export default Dialog;