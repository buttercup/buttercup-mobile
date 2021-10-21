import { useEffect, useMemo, useState } from "react";
import { VaultSourceID } from "buttercup";
import { getCodes, getEmitter } from "../services/otp";
import { OTP } from "../types";

export function useSourceOTPItems(sourceID: VaultSourceID): Array<OTP> {
    const [codes, setCodes] = useState<Array<OTP>>([]);
    const emitter = useMemo(getEmitter, []);
    useEffect(() => {
        const cb = () => {
            const sourceCodes = getCodes().filter(code => code.sourceID === sourceID);
            setCodes(sourceCodes);
        };
        emitter.on("updated", cb);
        cb();
        return () => {
            emitter.off("updated", cb);
        };
    }, [emitter, sourceID]);
    return codes;
}
