import Table from './utils/Table'
import SearchBar from './utils/SearchBar';
import ExportButton from './utils/ExportButton';
import { useDialog, useRules, useContracts } from '@contexts/AppContext';
import { useEffect, useState } from 'react';
import useDate from "@hooks/useDate";
import TableActions from './utils/TableActions';
import { IoEye } from 'react-icons/io5';
import icons from "@utils/icons";
import policyTypeMapping from '../../utils/policyTypeMapping';
import PillTag from './utils/PillTag';

import PropTypes from "prop-types";
import si from "@styles/pages/index.module.css";
import c from "clsx";
import Tab from './utils/Tab';
import { FaTrash } from 'react-icons/fa6';

function Policies({ page = 'policies' }) {

    const {openDialog} = useDialog();
    const { rules } = useRules();
    const { contracts } = useContracts();
    const dateFormattor = useDate();

    const [displayTab, setDisplayTab] = useState(page)
    const [policyData, setPolicyData] = useState([]);
    const [contractsData, setContractsData] = useState([]);

    useEffect(() => {
        setDisplayTab(page)
    }, [page])

    useEffect(() => {
        setPolicyData(rules.map(rule => {
            const { title, creationDate, description, type } = rule;
            const theme = type.toLowerCase().replaceAll('_', '-');
            return {
                'Policy Title': title,
                'Type': <PillTag theme={theme}>{policyTypeMapping[type] || 'UNKNOWN'}</PillTag>,
                'Description': description,
                'Created': dateFormattor(creationDate),
                'Actions': (
                    <TableActions>
                        <IoEye onClick={()=>openDialog('view-policy', rule)} />
                        <FaTrash onClick={() => openDialog('confirm-deletion', { title, url: rule._links.self.href, type: 'policy' })} />
                    </TableActions>
                ),

                _type: type
            }
        }))
    }, [dateFormattor, openDialog, rules])

    useEffect(() => {
        setContractsData(contracts.map(contract => {
            const { title, description, start, end, creationDate } = contract;
            
            return {
                "Title": title,
                "Description": description,
                "Start Date": dateFormattor(start),
                "End Date": dateFormattor(end),
                "Created": dateFormattor(creationDate),
                "Actions": (
                    <TableActions>
                        <IoEye onClick={()=>openDialog('view-contract', contract)} />
                        <FaTrash onClick={() => openDialog('confirm-deletion', { title, url: contract._links.self.href, type: 'contract' })} />
                    </TableActions>
                ),

            }
        }))
    }, [contracts, dateFormattor, openDialog])

    return (
        <div>
            <h1>Policy Management</h1>
            <div className="sub-title">Create and manage usage policies and contracts for your data assets</div>

            <div className={c(si['horizontal-list'], si['tabs-group'])}>
                <Tab name='Policies' icon={icons['policy']} active={displayTab === 'policies'} onClick={()=>setDisplayTab('policies')} />
                <Tab name='Contracts' icon={icons['contract']} active={displayTab === 'contracts'} onClick={()=>setDisplayTab('contracts')} />
            </div>

            {
                displayTab === 'policies' ?
                <SearchBar 
                    placeholder='Search policies...' 
                    createNewText='Create Policy' createNewAction={()=>openDialog('create-policy')}
                    callback={()=>{}}
                /> :
                <SearchBar 
                    placeholder='Search contracts...' 
                    createNewText='Create Contract' createNewAction={()=>openDialog('create-contract')}
                    callback={()=>{}}
                />
            }
            {
                displayTab === 'policies' ?
                <Table
                    title="Policy Definitions"
                    subTitle={<ExportButton onClick={()=>{}} />}
                    headers={
                        ["Policy Title", "Type", "Description", "Created", "Actions"]
                    }
                    data={policyData}
                    emptyText="No policy found"
                /> :
                <Table
                    title="Contracts"
                    subTitle={<ExportButton onClick={()=>{}} />}
                    headers={
                        ["Title", "Description", "Created", "Start Date", "End Date", "Actions"]
                    }
                    data={contractsData}
                    emptyText="No policy found"
                />   
            }
        </div>
    )
}

Policies.propTypes = {
    page: PropTypes.oneOf(['policies', 'contracts'])
}

export default Policies;