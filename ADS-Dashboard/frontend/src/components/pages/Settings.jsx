import { useRef, useState, useEffect } from 'react';
import s from "@styles/pages/settings.module.css";
import su from "@styles/pages/utils.module.css";
import si from "@styles/pages/index.module.css";
import c from "clsx";

import BasicButton from "./utils/BasicButton";

import { FaSave } from "react-icons/fa";
import { useSystemSettings } from "@contexts/AppContext";
import BasicInput from "./utils/BasicInput";
import { toast } from 'react-toastify';

function Settings() {

    const {settings: systemSettings, updateSystemSettings} = useSystemSettings();

    const [dateFormat, setDateFormat] = useState(systemSettings['date-format']);
    const [autoRefreshInterval, setAutoRefreshInterval] = useState(systemSettings['auto-refresh-interval']);

    const dateFormatOptions = useRef([
        { label: 'AU (DD/MM/YYYY)', value: 'au' },
        { label: 'US (MM/DD/YYYY)', value: 'us' },
        { label: 'ISO (YYYY-MM-DD)', value: 'iso' }
    ])

    const autoRefershIntervalOptions = useRef([
        { label: '30 Seconds', value: '30000' },
        { label: '1 Minute', value: '60000' },
        { label: '2 Minutes', value: '120000' },
        { label: '5 Minutes', value: '300000' },
        { label: 'Never', value: '-1' }
    ])

    useEffect(() => {
        const {
            'date-format': updatedDateFormat,
            'auto-refresh-interval': updatedAutoRefreshInterval,
        } = systemSettings;

        setDateFormat(updatedDateFormat);
        setAutoRefreshInterval(updatedAutoRefreshInterval);
    }, [systemSettings])

    const saveSettings = () => {
        const settings = {
            'date-format': dateFormat,
            'auto-refresh-interval': autoRefreshInterval,
        }
        updateSystemSettings(settings);
        toast.success("Successfully saved settings!");
    }

    return (
        <div className={s['settings']}>
            <h1>Settings</h1>
            <div className="sub-title">Configure dashboard and system settings</div>

            <div className={c(su['block'], s['block'])}>
                <div className={su['header']}>
                    <div className={su['title']}>Locale Settings</div>
                    <div className={su['sub-title']}>Configure regional and display preferences</div>
                </div>

                <BasicInput 
                    label="Date Format"
                    value={dateFormat}
                    callback={setDateFormat}
                    type='select'
                    options={dateFormatOptions.current}
                    description="Controls how dates are displayed throughout the dashboard"
                    className={s['input-elem']}
                />
            </div>

            <div className={c(su['block'], s['block'])}>
                <div className={su['header']}>
                    <div className={su['title']}>System Settings</div>
                    <div className={su['sub-title']}>Configure system behavior and connectivity</div>
                </div>

                <BasicInput 
                    label="Auto-refresh Interval"
                    value={autoRefreshInterval}
                    callback={setAutoRefreshInterval}
                    type='select'
                    options={autoRefershIntervalOptions.current}
                    description="How often the dashboard automatically refreshes data"
                    className={s['input-elem']}
                />
            </div>

            <div className={c(si['horizontal-list'], si['reverse'], s['buttons-list'])}>
                <BasicButton 
                    className={s['button']} text='Save Settings' 
                    variation="primary" icon={<FaSave />} 
                    onClick={saveSettings}
                />
                <BasicButton className={s['button']} text='Reset to Defaults' variation="secondary" />
            </div>
        </div>
    )
}

export default Settings;