import { useState, useEffect } from 'react';
import { useEnums } from '@contexts/AppContext';
import s from "@styles/pages/create-offering.module.css";

import BasicInput from '../utils/BasicInput';

function Resource({
    title, setTitle,
    description, setDescription,
    keywords, setKeywords,
    license, setLicense,
    language, setLanguage,
    publisher, setPublisher,
    sovereign, setSovereign,
    endpointDocumentation, setEndpointDocumentation,
    samples, setSamples,
    paymentMethod, setPaymentMethod,
}) {

    const { enums } = useEnums();
    const [languages, setLanguages] = useState();
    const [paymentMethods, setPaymentMethods] = useState();

    useEffect(() => {
        setLanguages(enums.LANGUAGE.map(({jsonInput, displayName}) => {
            return {
                label: displayName, value: jsonInput
            }
        }))
        setPaymentMethods(enums.PAYMENT_METHOD.map(({jsonInput, displayName}) => {
            return {
                label: displayName, value: jsonInput
            }
        }))
    }, [enums])

    return (
        <div className={s['page']}>
            <BasicInput value={title} callback={setTitle} label="Resource Title" />
            <BasicInput value={description} callback={setDescription} label="Resource Description" />
            <BasicInput value={keywords} callback={setKeywords} label="Keywords" placeholder="Keywords of your resource offering, split by comma" />
            <BasicInput value={license} callback={setLicense} label="License" placeholder="License URL" />
            <BasicInput value={language} callback={setLanguage} options={languages} type='select' label="Language" />
            <BasicInput value={publisher} callback={setPublisher} label="Publisher"  placeholder="Publisher URL" />
            <BasicInput value={sovereign} callback={setSovereign} label="Sovereign" placeholder="Sovereign URL" />
            <BasicInput value={endpointDocumentation} callback={setEndpointDocumentation} label="Endpoint Documentation" placeholder="Endpoint Documentation URL" />
            <BasicInput value={samples} callback={setSamples} label="Samples" placeholder="Samples of your resource offering, split by comma" />
            <BasicInput value={paymentMethod} callback={setPaymentMethod} options={paymentMethods} type='select' label="Payment Method" />
        </div>
    )
}

export default Resource;