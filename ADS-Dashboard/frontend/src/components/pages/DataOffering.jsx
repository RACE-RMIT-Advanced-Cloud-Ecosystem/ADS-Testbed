import Table from './utils/Table'

import s from "@styles/pages/data-offering.module.css";
import si from '@styles/pages/index.module.css';
import c from 'clsx';

import { FaDatabase, FaFolder } from "react-icons/fa";
import Tab from './utils/Tab';
import { useEffect, useState } from 'react';
import SearchBar from './utils/SearchBar';
import { useResources, useCatalogs, useDialog } from '@contexts/AppContext';
import useDate from "@hooks/useDate";
import TableActions from './utils/TableActions';
import { IoEye } from 'react-icons/io5';
import PillTag from './utils/PillTag';
import CreateOffering from './create-offering';
import { FaTrash } from "react-icons/fa";
import { TbPencilPlus } from 'react-icons/tb';

function DataOffering({ page = 'resources' }) {

    const [displayTab, setDisplayTab] = useState(page);
    const dateFormattor = useDate();
    const { resources } = useResources();
    const { catalogs } = useCatalogs();
    const { openDialog } = useDialog();

    const [resourcesData, setResourcesData] = useState([]);
    const [catalogsData, setCatalogsData] = useState([]);

    useEffect(() => {
        setDisplayTab(page);
    }, [page])

    useEffect(() => {
        setResourcesData(resources.map((resource) => {
            const { title, publisher, keywords, creationDate } = resource;
            let description = resource.description;
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
                        <IoEye onClick={()=>openDialog('view-resource', resource)} />
                        <TbPencilPlus onClick={()=>openDialog('update-resource-register', resource)} title='Register/Degister with Brokers' />
                        <FaTrash onClick={()=>openDialog('confirm-deletion', { title, url: resource._links.self.href, type: 'resource' })} />    
                    </TableActions>
                ),
                "_keywords": keywords
            }
        }))
    }, [openDialog, resources, dateFormattor])

    useEffect(() => {
        setCatalogsData(catalogs.map(catalog => {
            const { title, description, creationDate, modificationDate } = catalog;
            return {
                'Title': title,
                'Description': description,
                'Created': creationDate,
                'Modified': modificationDate,
                'Actions': (
                    <TableActions>
                        <IoEye onClick={()=>openDialog('view-catalog', catalog)}/>
                        <FaTrash onClick={()=>openDialog('confirm-deletion', { title, url: catalog._links.self.href, type: 'catalog' })} />
                    </TableActions>
                )
            }
        }))
    }, [catalogs, openDialog]);

    return (
        displayTab === 'create' ?
        <CreateOffering cancelOperation={()=>setDisplayTab(page)} /> :
        <div>
            <h1>Data Offerings</h1>
            <div className="sub-title">Manage catalogs and resources in your dataspace connector</div>

            <div className={c(si['horizontal-list'], si['tabs-group'])}>
                <Tab name='Resources' icon={<FaDatabase />} active={displayTab === 'resources'} onClick={()=>setDisplayTab('resources')} />
                <Tab name='Catalogs' icon={<FaFolder />} active={displayTab === 'catalogs'} onClick={()=>setDisplayTab('catalogs')} />
            </div>

            {
                displayTab === 'resources' ?

                <SearchBar 
                    placeholder='Search resources...' 
                    createNewText='Create Resource' createNewAction={()=>setDisplayTab('create')} 
                    callback={()=>{}}
                /> :
                <SearchBar 
                    placeholder='Search catalogs...' 
                    createNewText='Create Catalog' createNewAction={()=>openDialog('create-catalog')}
                    callback={()=>{}}
                />
            }
            {
                displayTab === 'resources' ? (
                    <Table
                        title="Data Resources"
                        subTitle="Resources (offers) available in your connector"
                        headers={
                            ["Title","Description","Publisher","Keywords","Created","Actions"]
                        }
                        data={resourcesData}
                        count emptyText="No resource found"
                        className={s['resources-table']}
                    />
                ) : (
                    <Table
                        title="Data Catalogs"
                        subTitle="Catalogs that organize your data resources"
                        headers={
                            ["Title","Description","Created","Modified","Actions"]
                        }
                        data={catalogsData}
                        count emptyText="No catalog found"
                    />
                )
            }
        </div>
    )
}
export default DataOffering;