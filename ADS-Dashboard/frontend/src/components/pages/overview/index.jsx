import s from '@styles/pages/overview.module.css';
import IdsMetricCard from './IdsMetricCard';
import Table from '../utils/Table';
import { useConnectors } from "@contexts/AppContext";
import useDate from '@hooks/useDate';
import { useEffect, useState } from 'react';
import PillTag from '../utils/PillTag';

const subMetricFields = {
    agreement: ['confirmed'],
}

function Overview() {
    const dateFormattor = useDate();
    const { connectors, lastUpdated, connectStatus } = useConnectors();

    const [connectorsData, setConnectorsData] = useState([]);

    useEffect(() => {
        setConnectorsData(connectors.map(connector => {
            const { id, name, endpoint } = connector;
            const status = connectStatus[id];
            return {
                'Connector Name': name,
                'Endpoint': endpoint,
                'Status': <PillTag theme={status ? 'positive' : 'negative'}>{ status ? 'ONLINE' : 'OFFLINE' }</PillTag>,
                'Last Updated': dateFormattor(lastUpdated),

                _status: status
            }
        }))
    }, [connectStatus, connectors, dateFormattor, lastUpdated])

    return (
        <div className={s['overview']}>
            <div className={s['metric-cards']}>
                <IdsMetricCard name='agreement' to={'/agreements'} subMetricFields={subMetricFields.agreement} />
                <IdsMetricCard name='representation' to={'/assets'} />
                <IdsMetricCard name='artifact' to={'/assets'} />
                <IdsMetricCard name='policy' to={'/policies'} />
                <IdsMetricCard name='resource' to={'/data-offerings'} />
                <IdsMetricCard name='request' to={'/requests'} />
                <IdsMetricCard name='catalog' to={'/data-offerings/catalogs'} />
                <IdsMetricCard name='contract' to={'/policies/contracts'} />
                <IdsMetricCard name='broker' to={'/brokers'} />
            </div>

            <Table
                title="Active Connectors"
                headers={
                    ["Connector Name","Endpoint","Status","Last Updated"]
                }
                data={connectorsData}
                emptyText="No active connector found"
            />
        </div>
    )
}

export default Overview;