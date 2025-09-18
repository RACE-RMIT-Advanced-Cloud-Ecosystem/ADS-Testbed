import SearchBar from './utils/SearchBar';
import Table from './utils/Table';

function Transfers() {
    return (
        <div>
            <h1>Data Transfers</h1>
            <div className="sub-title">Monitor and manage data transfer processes</div>

            <SearchBar 
                placeholder='Search transfers...' filters={['Transfer Date', 'Start Date', 'End Date']} 
                callback={()=>{}}
            />
        

            <Table 
                title="Active Incoming Agreements"
                subTitle="Active agreements where this connector is the consumer"
                headers={["Agreement ID","Provider","Start Date","End Date","Policies","Artifacts","Actions"]}
                data={[]}
                count emptyText="No agreements found"
            />
            <Table 
                title="Transfer History"
                subTitle="Completed data transfers from connected providers"
                headers={["Title","Status","Transfer Date","Transfer ID","Actions"]}
                data={[]}
                count emptyText="No transfers found"
            />
        </div>
    )
}

export default Transfers;