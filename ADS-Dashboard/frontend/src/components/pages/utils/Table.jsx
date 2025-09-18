import s from '@styles/pages/utils.module.css';
import c from 'clsx';
import PropTypes from 'prop-types';
import { memo } from 'react';

function Table({ title, subTitle, headers, data, count = false, emptyText = 'No data found', className, theme = '' }) {
    return (
        <div className={c(s['table'], s['block'], s['fw'], theme, { [s['themed']]: !!theme })}>
            <div className={c(s['header'], s['horizontal'], s['plain'])}>
                <div className={s['title']}>{ title }{ count && ` (${data.length})` }</div>
                <div className={s['sub-title']}>{ subTitle }</div>
            </div>
            <table cellSpacing={0} className={c(className)}>
                <thead>
                    <tr>
                        { headers.map(header => (
                            <th key={header}>{ header }</th>
                        )) }
                    </tr>
                </thead>
                <tbody>
                    { data.map((row, index) => (
                        <tr key={index} {...(row._props || {})}>
                            { headers.map(header => (
                                <td key={header}>{ row[header] || '-' }</td>
                            )) }
                        </tr>
                    ))}
                </tbody>
            </table>
            { data.length === 0 && <div className={s['empty-text']}>{ emptyText }</div> }
        </div>
    )
}

Table.propTypes = {
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ]),
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    count: PropTypes.bool,
    emptyText: PropTypes.string,
    className: PropTypes.string,
    theme: PropTypes.string
}

export default memo(Table, (prevProps, nextProps) => {
    return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data) &&
           prevProps.title === nextProps.title &&
           prevProps.subTitle === nextProps.subTitle &&
           JSON.stringify(prevProps.headers) === JSON.stringify(nextProps.headers);
});