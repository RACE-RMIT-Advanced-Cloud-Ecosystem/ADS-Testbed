import { useMemo, useRef } from "react";

export function useStableValue(value) {
    const prevValue = useRef(value);
    
    return useMemo(() => {
        if (JSON.stringify(prevValue.current) === JSON.stringify(value)) {
            return prevValue.current;
        }
        prevValue.current = value;
        return value;
    }, [value]);
}