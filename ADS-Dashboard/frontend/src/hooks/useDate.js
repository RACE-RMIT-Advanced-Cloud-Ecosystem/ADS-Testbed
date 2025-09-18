import { useSystemSettings } from "@contexts/AppContext"
import { useCallback } from "react";

export default function useDate() {
    const { settings } = useSystemSettings();

    const dateFormattor = useCallback((date = null) => {
        const d = date ? new Date(date) : new Date();
        switch (settings['date-format']) {
            case 'au':
                return d.toLocaleString('en-AU');
            case 'us':
                return d.toLocaleString('en-US');
            case 'iso':
                return d.toISOString();
            default:
                return d.toLocaleString();
        }
    }, [settings])

    return dateFormattor;
}