import s from "@styles/pages/catalog-browser.module.css"
import su from "@styles/pages/utils.module.css"
import c from "clsx";
import SearchBar from "./utils/SearchBar";
import { useBrokers, useDialog } from "@contexts/AppContext";
import { memo, useEffect, useState } from "react";
import ViewComponent from "../dialog/ViewComponent";
import PillTag from "./utils/PillTag";
import { trimSentence } from "@utils/tools";
import useIdsApi from '@hooks/useIdsApi';

const baseFilters = ['All brokers', 'RDA']

const ResourceCard = memo(({ props = {} }) => {

    const { openDialog } = useDialog();
    const [keywords, setKeywords] = useState([]);

    useEffect(() => {
        if (!props.keyword) return;

        if (typeof props.keyword === 'object' && Array.isArray(props.keyword)) {
            setKeywords(props.keyword);
        } else {
            setKeywords([props.keyword])
        }
    }, [props.keyword]);

    return (
        <div 
            className={c(su['block'], s['resource-card'], 'resource', 'clickable')}
            onClick={() => openDialog('view-offer-details', props)}
        >
            <div className={s['basic-info']}>
                {props.title && <ViewComponent title coloured>{ props.title }</ViewComponent>}
                {props.description && <ViewComponent fullWidth light>{ trimSentence(props.description) }</ViewComponent>}
                {keywords.length && <ViewComponent flex fullWidth closer>{ keywords.map(k => <PillTag key={k}>{k}</PillTag>) }</ViewComponent>}
            </div>
            <div className={s['extra-info']}>
                {props.paymentModality && <ViewComponent keyValue closer><span>Payment Method: </span><span>{ props.paymentModality }</span></ViewComponent>}
                {props.publisher && <ViewComponent keyValue closer><span>Publisher: </span><span>{ props.publisher }</span></ViewComponent>}
                {props.standardLicense && <ViewComponent keyValue closer><span>License: </span><span>{ props.standardLicense }</span></ViewComponent>}
            </div>
        </div>
    )
})

function ToolBar() {
    return (
        <div className={c(s['toolbar'], su['block'])}>
            
        </div>
    )
}


function CatalogBrowser() {

    const { brokers } = useBrokers();
    const { brokerSearch } = useIdsApi();

    const [ filters, setFilters ] = useState(baseFilters)

    const [ brokersMapping, setBrokersMapping ] = useState({})
    const [ searchResults, setSearchResults ] = useState(null);
    
    useEffect(() => {
        setBrokersMapping(brokers.reduce((acc, b) => {
            acc[b.title] = b.location
            return acc
        }, {}))
        setFilters([...baseFilters, ...brokers.map(b => b.title)])
    }, [brokers])

    const search = async (query, appliedFilter, signal) => {
        if (!query) {
            setSearchResults(null);
            return;
        }

        // DELETE - SKIP RDA
        if (appliedFilter === 'RDA') {
            setSearchResults([]);
            return;
        }

        try {
            if (appliedFilter === 'All brokers') {
                const allResults = await Promise.allSettled(
                    Object.values(brokersMapping).map(brokerUrl => 
                        brokerSearch(brokerUrl, query, 'keyword', signal)
                    )
                );
                
                const combinedResults = allResults
                    .filter(result => result.status === 'fulfilled')
                    .flatMap(result => result.value || []);
                
                if (!signal?.aborted) {
                    setSearchResults(combinedResults);
                }
            } else {
                const brokerUrl = brokersMapping[appliedFilter] || 'https://broker-reverseproxy/infrastructure';
                const results = await brokerSearch(brokerUrl, query, 'keyword', signal);
                if (!signal?.aborted) {
                    setSearchResults(results);
                }
            }
        } catch (error) {
            if (error.name !== 'AbortError' && !signal?.aborted) {
                console.error('Search failed:', error);
                setSearchResults([]);
            }
        }
    }

    return (
        <div className={s['catalog-browser']}>
            <h1>Catalog Browser</h1>
            <div className="sub-title">Browse resource offers and making requests</div>

            <ToolBar />

            <SearchBar
                placeholder="Search resources..."
                filters={filters}
                className={s['search-bar']}
                inputProps={{
                    className: s['search-input']
                }}
                callback={search}
            />


            <div className={s['search-results']}>
                {
                    searchResults ?
                    searchResults.length ? 
                    searchResults.map((r, i) => (
                        <ResourceCard key={i} props={r} />
                    )) :
                    <div className={s['search-result-empty']}>No results found</div> :
                    <div className={s['search-result-empty']}>Search for resources</div>
                }
            </div>
        </div>
    )
}

export default CatalogBrowser;