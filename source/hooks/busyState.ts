import { useEffect, useState } from "react";
import { getBusyState, getEmitter } from "../services/busyState";

export function useBusyState(): string {
    const [busyState, setBusyState] = useState<string>(getBusyState());
    useEffect(() => {
        const emitter = getEmitter();
        emitter.on("change", setBusyState);
        return () => {
            emitter.off("change", setBusyState);
        };
    }, []);
    return busyState;
}
