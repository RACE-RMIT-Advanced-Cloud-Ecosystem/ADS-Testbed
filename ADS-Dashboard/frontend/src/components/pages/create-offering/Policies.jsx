import { useContracts, useRules, useDialog } from "@contexts/AppContext";
import { useEffect, useState } from "react";
import useDate from "@hooks/useDate"
import Table from "../utils/Table";
import { IoEye } from "react-icons/io5";
import TableActions from "../utils/TableActions";
import BasicButton from "../utils/BasicButton";
import { FaPlus } from "react-icons/fa";
import s from "@styles/pages/create-offering.module.css";
import c from "clsx";
import Collapsible from "../utils/Collapsible";
import PillTag from "../utils/PillTag";
import policyTypeMapping from "@utils/policyTypeMapping";

function Policies({ 
    selectedContract, setSelectedContract,
    selectedPolicies, updateSelectedPolicies
 }) {
    const { contracts } = useContracts();
    const { rules } = useRules();
    const { openDialog } = useDialog();
    const dateFormattor = useDate();

    const [contractData, setContractData] = useState([]);
    const [policyData, setPolicyData] = useState([]);

    useEffect(() => {
        setContractData(contracts.map(contract => {
            const { title, description, creationDate } = contract;
            const contractId = contract._links.self.href;
            return {
                '': (
                    <input 
                        type="radio" value={contractId} 
                        name="contract" readOnly
                        checked={contractId === selectedContract} 
                    />
                ),
                'Title': title,
                'Description': description,
                'Created': dateFormattor(creationDate),
                'Preview': <TableActions><IoEye onClick={event=>{event.stopPropagation(); openDialog('view-contract', contract)}} /></TableActions>,

                _props: {
                    onClick: ()=>setSelectedContract(contractId),
                }
            }
        }))
    }, [contracts, dateFormattor, openDialog, selectedContract, setSelectedContract]);

    useEffect(() => {
        setPolicyData(rules.map(rule => {
            const { title, description, creationDate, type } = rule;
            const ruleId = rule._links.self.href;
            const theme = type.toLowerCase().replaceAll('_', '-');
            return {
                '': (
                    <input
                        type="checkbox" value={ruleId}
                        name="rule" readOnly
                        checked={selectedPolicies.includes(ruleId)}
                    />
                ),
                'Title': title,
                'Description': description,
                'Type': <PillTag theme={theme}>{policyTypeMapping[type] || 'UNKNOWN'}</PillTag>,
                'Created': dateFormattor(creationDate),
                'Preview': <TableActions><IoEye onClick={event=>{event.stopPropagation(); openDialog('view-policy', rule)}} /></TableActions>,

                _props: {
                    onClick: ()=>updateSelectedPolicies(ruleId),
                }
            }
        }))
    }, [dateFormattor, openDialog, rules, selectedPolicies, updateSelectedPolicies])

    return (
        <div>
            <Collapsible summary="Pick a contract" open className={c(s['full-width-collapsible'], 'contract')}>
                <Table 
                    data={contractData} theme="contract"
                    headers={["", "Title", "Description", "Created", "Preview"]}
                    emptyText="No contract found" title="Pick a contract"
                    subTitle={
                        <BasicButton 
                            text="New Contract" icon={<FaPlus />} 
                            className={s['create-in-place']} 
                            onClick={()=>openDialog('create-contract')}
                            variation="theme"
                        />
                    }
                />
            </Collapsible>
            <Collapsible summary="Pick a policy" open className={c(s['full-width-collapsible'], 'policy')}>
                <Table 
                    data={policyData} theme="policy"
                    headers={["", "Title", "Type", "Description", "Created", "Preview"]}
                    emptyText="No policy found" title="Pick a policy"
                    subTitle={
                        <BasicButton
                            text="New Policy" icon={<FaPlus />}
                            className={s['create-in-place']}
                            onClick={()=>openDialog('create-policy')}
                            variation="theme"
                        />
                    }
                />
            </Collapsible>
        </div>
    )
}

export default Policies;