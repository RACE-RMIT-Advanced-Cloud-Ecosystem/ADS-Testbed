import { useRepresentations, useDialog } from "@contexts/AppContext";
import { useEffect, useState } from "react";
import { trimSentence } from "@utils/tools";
import useDate from "@hooks/useDate"
import Table from "../utils/Table";
import { IoEye } from "react-icons/io5";
import TableActions from "../utils/TableActions";
import BasicButton from "../utils/BasicButton";
import { FaPlus } from "react-icons/fa";
import s from "@styles/pages/create-offering.module.css";

function Assets({ selectedAssets, updateSelection }) {
    const { representations } = useRepresentations();
    const { openDialog } = useDialog();
    const dateFormattor = useDate();

    const [data, setData] = useState([]);
    useEffect(() => {
        setData(representations.map(representation => {
            const { title, description, creationDate } = representation;
            const representationId = representation._links.self.href;
            return {
                '': (
                    <input 
                        type="checkbox" value={representationId} 
                        name="asset" readOnly
                        checked={selectedAssets.includes(representationId)} 
                    />
                ),
                'Title': title,
                'Description': trimSentence(description),
                'Created': dateFormattor(creationDate),
                'Preview': <TableActions><IoEye onClick={event=>{event.stopPropagation(); openDialog('view-representation', representation)}} /></TableActions>,

                _props: {
                    onClick: ()=>updateSelection(representationId),
                }
            }
        }))
    }, [dateFormattor, openDialog, representations, selectedAssets, updateSelection])

    return (
        <div>
            <Table 
                data={data} theme="representation"
                headers={["", "Title", "Description", "Created", "Preview"]}
                emptyText="No asset found" title="Pick a asset"
                subTitle={
                    <BasicButton 
                        text="New Asset" icon={<FaPlus />} 
                        className={s['create-in-place']} 
                        onClick={()=>openDialog('create-asset')}
                        variation="theme"
                    />
                }
            />
        </div>
    )
}

export default Assets;