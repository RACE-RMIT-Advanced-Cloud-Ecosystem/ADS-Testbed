import { useEffect, useState } from 'react';

import Table from './utils/Table'
import SimpleCard from './utils/SimpleCard';
import SearchBar from './utils/SearchBar';
import ExportButton from './utils/ExportButton';
import TableActions from './utils/TableActions';

import si from '@styles/pages/index.module.css'
import s from '@styles/pages/contracts.module.css'

import { IoEye } from "react-icons/io5";
import { FaHandshake, FaCalendarTimes } from "react-icons/fa";

import { useAgreements, useDialog } from "@contexts/AppContext"
import useDate from '@hooks/useDate';
import PillTag from './utils/PillTag';

function Agreements() {

    const dateFormattor = useDate();
    const { agreements } = useAgreements();
    const { openDialog } = useDialog();
    
    const [data, setData] = useState([]);
    const [activeAgreements, setActiveAgreements] = useState(0);
    const [expiredAgreements, setExpiredAgreements] = useState(0);

    useEffect(() => {
        setData(agreements.map(agreement => {
            const agreementContent = JSON.parse(agreement.value);

            const { 
                '@id': contractIdUrl,
                'ids:provider': idsProvider,
                'ids:consumer': idsConsumer,
                'ids:contractStart': idsContractStart,
                'ids:contractEnd': isdContractEnd,
            } = agreementContent;

            const provider = idsProvider['@id'];
            const consumer = idsConsumer['@id'];
            const contractStart = idsContractStart['@value'];
            const contractEnd = isdContractEnd['@value'];

            const id = contractIdUrl.split('/').pop();
            const isActive = new Date(contractEnd) > new Date();

            return ({
                "Agreement ID": id,
                "Provider": provider,
                "Consumer": consumer,
                "Direction": agreement.remoteId === 'genesis' ? <PillTag theme='positive'>OUTGOING</PillTag> : <PillTag theme='neutral'>INCOMING</PillTag>,
                "Start Date": dateFormattor(contractStart),
                "End Date": dateFormattor(contractEnd),
                "Status": isActive ? 'Active' : 'Expired',
                "Actions": <TableActions><IoEye onClick={()=>openDialog('view-agreement', agreement)} /></TableActions>,

                _isActive: isActive,
                _direction: agreement.remoteId === 'genesis'
            })
        }))
    }, [agreements, dateFormattor, openDialog])

    useEffect(() => {
        const activeAgreements = data.filter(agreement => agreement._isActive).length;
        const expiredAgreements = data.length - activeAgreements;
        setActiveAgreements(activeAgreements);
        setExpiredAgreements(expiredAgreements);
    }, [data])


    return (
        <div>
            <h1>Agreement Management</h1>
            <div className="sub-title">Manage agreements incoming/outgoing</div>

            <SearchBar 
                placeholder='Search agreements...' filters={['All Status', 'Active']} 
                callback={()=>{}}
            />

            <div className={si['horizontal-list']}>
                <SimpleCard icon={<FaHandshake />} title={activeAgreements} subTitle='Active Agreements' iconExtClass={s['matric-card-icon']} />
                <SimpleCard icon={<FaCalendarTimes />} title={expiredAgreements} subTitle='Expired Agreements' iconExtClass={s['matric-card-icon']} />
            </div>

            <Table
                title="Agreements"
                subTitle={<ExportButton onClick={()=>{}}/>}
                headers={
                    ["Agreement ID","Provider","Consumer","Direction","Start Date","End Date","Status","Actions"]
                }
                data={data}
                count emptyText="No agreement found"
            />
        </div>
    )
}
export default Agreements;