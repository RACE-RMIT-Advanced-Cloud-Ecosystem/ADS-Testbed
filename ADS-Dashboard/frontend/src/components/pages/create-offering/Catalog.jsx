import { useCatalogs, useDialog } from "@contexts/AppContext";
import { useEffect, useState } from "react";
import useDate from "@hooks/useDate"
import Table from "../utils/Table";
import { IoEye } from "react-icons/io5";
import TableActions from "../utils/TableActions";
import BasicButton from "../utils/BasicButton";
import { FaPlus } from "react-icons/fa";
import s from "@styles/pages/create-offering.module.css";

function Catalog({ selectedCatalog, setSelectedCatalog }) {
    const { catalogs } = useCatalogs();
    const { openDialog } = useDialog();
    const dateFormattor = useDate();

    const [data, setData] = useState([]);
    useEffect(() => {
        setData(catalogs.map(catalog => {
            const { title, description, creationDate } = catalog;
            const catalogId = catalog._links.self.href;
            return {
                '': (
                    <input 
                        type="radio" value={catalogId} 
                        name="catalog" readOnly
                        checked={catalogId === selectedCatalog} 
                    />
                ),
                'Title': title,
                'Description': description,
                'Created': dateFormattor(creationDate),
                'Preview': <TableActions><IoEye onClick={event=>{event.stopPropagation(); openDialog('view-catalog', catalog)}} /></TableActions>,

                _props: {
                    onClick: ()=>setSelectedCatalog(catalogId),
                }
            }
        }))
    }, [catalogs, dateFormattor, openDialog, selectedCatalog, setSelectedCatalog])

    return (
        <div>
            <Table 
                data={data} theme="catalog"
                headers={["", "Title", "Description", "Created", "Preview"]}
                emptyText="No catalog found" title="Pick a catalog"
                subTitle={
                    <BasicButton 
                        text="New Catalog" icon={<FaPlus />} 
                        className={s['create-in-place']} 
                        onClick={()=>openDialog('create-catalog')}
                        variation="theme"
                    />
                }
            />
        </div>
    )
}

export default Catalog;