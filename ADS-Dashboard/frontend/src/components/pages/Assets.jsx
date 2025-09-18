import Table from './utils/Table'
import SearchBar from './utils/SearchBar';
import { useDialog, useRepresentations, useDatasets } from '@contexts/AppContext';
import { useEffect, useState } from 'react';
import useDate from "@hooks/useDate";
import TableActions from './utils/TableActions';
import { IoEye } from 'react-icons/io5';
import { FaTrash } from "react-icons/fa";
import { TbPencil } from "react-icons/tb";
import si from '@styles/pages/index.module.css';
import c from 'clsx';
import Tab from './utils/Tab';
import icons from '@utils/icons'


const assetHeaders = ["Title","Media Type","Created","Actions"];
const datasetHeaders = ["Title","Description","Created","Size","Actions"];

function Assets() {
    const dateFormattor = useDate();
    const {openDialog} = useDialog();
    const {representations} = useRepresentations();
    const {datasets} = useDatasets();

    const [displayTab, setDisplayTab] = useState('assets');
    const [assetData, setAssetData] = useState([]);
    const [datasetData, setDatasetData] = useState([]);

    useEffect(() => {
        setAssetData(representations.map(representation => {
            const { title, creationDate, mediaType } = representation;
            return {
                'Title': title,
                'Media Type': mediaType,
                'Created': dateFormattor(creationDate),
                'Actions': (
                    <TableActions>
                        <IoEye onClick={()=>openDialog('view-representation', representation)} />
                        <FaTrash onClick={()=>openDialog('confirm-deletion', { title, url: representation._links.self.href, type: 'asset' })} />
                    </TableActions>
                )
            } 
        }))
    }, [dateFormattor, openDialog, representations])

    useEffect(() => {
        setDatasetData(datasets.map(dataset => {
            const { name: title, description, uploadedAt, size, id } = dataset;
            return {
                'Title': title,
                'Description': description,
                'Created': dateFormattor(uploadedAt),
                'Size': `${(size / 1024 / 1024).toFixed(2)} MB`,
                'Actions': (
                    <TableActions>
                        <TbPencil onClick={()=>openDialog('create-dataset', dataset)} />
                        <FaTrash onClick={()=>openDialog('confirm-deletion', { title, url: id, type: 'dataset' })} />
                    </TableActions>
                )
            }
        }))
    }, [dateFormattor, openDialog, datasets])

    return (
        <div>
            <h1>My Assets</h1>
            <div className="sub-title">Manage your assets and datasets</div>

            <div className={c(si['horizontal-list'], si['tabs-group'])}>
                <Tab name='Assets' icon={icons['representation']} active={displayTab === 'assets'} onClick={()=>setDisplayTab('assets')} />
                <Tab name='Datasets' icon={icons['dataset']} active={displayTab === 'datasets'} onClick={()=>setDisplayTab('datasets')} />
            </div>

            {
                displayTab === 'assets' ?
                <SearchBar 
                    placeholder='Search assets...' 
                    createNewText='Create Asset' createNewAction={()=>openDialog('create-asset')}
                    callback={()=>{}}
                /> :
                <SearchBar 
                    placeholder='Search dataset...' 
                    createNewText='Create Dataset' createNewAction={()=>openDialog('create-dataset')}
                    callback={()=>{}}
                />
            }
            {
                displayTab === 'assets' ?
                <Table
                    title="Assets"
                    headers={assetHeaders}
                    data={assetData}
                    emptyText="No assets found"
                /> :
                <Table
                    title="Datasets"
                    headers={datasetHeaders}
                    data={datasetData}
                    emptyText="No datasets found"
                />
            }
            {/* <Table
                title="Assets"
                headers={assetHeaders}
                data={assetData}
                emptyText="No assets found"
            /> */}
        </div>
    )
}
export default Assets;