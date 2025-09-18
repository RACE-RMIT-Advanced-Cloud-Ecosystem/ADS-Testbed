import s from "@styles/dialog.module.css";
import c from "clsx";
import PropTypes from "prop-types";

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';

SyntaxHighlighter.registerLanguage('json', json);

function ViewComponent({
    className = '', children,
    fullWidth = false, flex = false, keyValue = false, 
    closer = false, further = false, light = false,
    seprate = false, centered = false, small = false,
    coloured = false, independent = false, title = false,
    code = '', ...props
}) {
    return (
        <div 
            className={c(
                s['view-component'], 
                { 
                    'flexbox': flex || keyValue,
                    [s['full-width']]: fullWidth, 
                    [s['key-value']]: keyValue,
                    [s['closer']]: closer,
                    [s['further']]: further,
                    [s['light']]: light,
                    [s['seprate']]: seprate,
                    [s['centered']]: centered,
                    [s['small']]: small,
                    [s['coloured']]: coloured,
                    [s['independent']]: independent,
                    [s['title']]: title
                }, 
                className
            )}
            {...props}
            >
            {
                code ?

                <SyntaxHighlighter language={code} style={prism} customStyle={{ width: '100%', background: 'white', borderRadius: '10px' }}>
                    { children }
                </SyntaxHighlighter> :
                
                children
            }
        </div>
    )
}

ViewComponent.propTypes = {
    className: PropTypes.string,
    fullWidth: PropTypes.bool,
    flex: PropTypes.bool,
    keyValue: PropTypes.bool,
    closer: PropTypes.bool,
    further: PropTypes.bool,
    light: PropTypes.bool,
    seprate: PropTypes.bool,
    centered: PropTypes.bool,
    small: PropTypes.bool,
    coloured: PropTypes.bool,
    code: PropTypes.string,
    independent: PropTypes.bool,
    title: PropTypes.string,
    children: PropTypes.node.isRequired
}

export default ViewComponent;