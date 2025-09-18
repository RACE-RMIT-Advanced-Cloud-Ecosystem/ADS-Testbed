import PropTypes from 'prop-types';
import s from '@styles/pages/utils.module.css';
import c from 'clsx';

import debounce from '@utils/debounce';

import { IoSearch } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";

import { useState, useCallback } from 'react';
import BasicButton from './BasicButton';
import BasicInput from './BasicInput';

function SearchBar({ 
    placeholder, callback, filters = [], 
    createNewText = '', createNewAction = undefined, 
    children, className, inputProps = {}
}) {

    const [appliedFilter, setAppliedFilter] = useState(filters[0])
    const [searchText, setSearchText] = useState('')
    const [loading, setLoading] = useState(false)

    const wrappedCallback = async (query, filter, signal) => {
        setLoading(true);
        try {
            await callback(query, filter, signal);
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
            }
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedCallback = useCallback(debounce(wrappedCallback, 500), [callback]);
    const inputSearch = value => {
        setSearchText(value)
        debouncedCallback(value, appliedFilter);
    }

    return (
        <div className={c(s['block'], s['search-bar'], s['fw'], className)}>
            <BasicInput 
                placeholder={placeholder}
                icon={loading ? <AiOutlineLoading className={'loading'} /> : <IoSearch />}
                value={searchText}
                callback={inputSearch}
                {...inputProps}
            />
            {
                filters.length ?
                <select onChange={event=>setAppliedFilter(event.target.value)} value={appliedFilter} className={s['filters']}>
                    { filters.map((filter, index) => <option key={index} value={filter}>{filter}</option>) }
                </select> : <></>
            }
            { children }
            {
                createNewText && createNewAction ? 
                <BasicButton className={s['add-new-btn']} onClick={createNewAction} variation="primary" icon={<FaPlus />} text={createNewText} /> : <></>
            }
        </div>
    )
}

SearchBar.propTypes = {
    placeholder: PropTypes.string,
    callback: PropTypes.func,
    filters: PropTypes.array,
    createNewText: PropTypes.string,
    createNewAction: PropTypes.func,
    children: PropTypes.node,
    className: PropTypes.string,
    inputProps: PropTypes.object
}

export default SearchBar;