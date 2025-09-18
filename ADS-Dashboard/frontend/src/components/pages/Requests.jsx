import Table from './utils/Table'

import s from "@styles/pages/data-offering.module.css";

import { useEffect, useState } from 'react';
import SearchBar from './utils/SearchBar';
import { useRequests, useDialog } from '@contexts/AppContext';
import TableActions from './utils/TableActions';
import { IoEye } from 'react-icons/io5';
import PillTag from './utils/PillTag';
import { FaTrash } from 'react-icons/fa';
import useDate from "@hooks/useDate";

function Requests() {

    const { requests } = useRequests();
    const { openDialog } = useDialog();
    const dateFormattor = useDate();
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(requests.map((request) => {
            const { title, publisher, keywords, creationDate } = request;
            let description = request.description;
            // display discription max 100 words
            const descLength = description.length;
            if (descLength > 100) {
                description = description.slice(0, 100);
                description += '...';
            }

            return {
                'Title': title,
                'Description': description,
                'Publisher': publisher,
                'Keywords': 
                    <div className={s['keywords']}>
                        {keywords.map((keyword) => (
                            <PillTag key={keyword} theme='resource'>{keyword}</PillTag>
                        ))}
                    </div>,
                'Created': dateFormattor(creationDate),
                'Actions': (
                    <TableActions>
                        <IoEye onClick={()=>openDialog('view-resource', request)} />
                        <FaTrash onClick={() => openDialog('confirm-deletion', { title, url: request._links.self.href, type: 'request' })} />
                    </TableActions>
                ),
                "_keywords": keywords
            }
        }))
    }, [dateFormattor, openDialog, requests])


    return (
        <div>
            <h1>Data Requests</h1>
            <div className="sub-title">Manage data offering that requested by you</div>

            <SearchBar 
                placeholder='Search requests...' 
                callback={()=>{}}
            />

            <Table
                title="Data Requests"
                subTitle="Resources (requests) available in your connector"
                headers={
                    ["Title","Description","Publisher","Keywords","Created","Actions"]
                }
                data={data}
                count emptyText="No request found"
                className={s['resources-table']}
            />
        </div>
    )
}
export default Requests;