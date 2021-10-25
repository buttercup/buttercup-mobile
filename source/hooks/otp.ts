import { useContext, useEffect, useMemo, useState } from "react";
import { EntryID, VaultSourceID } from "buttercup";
import { OTPContext } from "../contexts/otp";
import { getCodes, getEmitter } from "../services/otp";
import { OTP, OTPCode } from "../types";

export function useEntryOTPCodes(entryID: EntryID): { [key: string]: OTPCode } {
    const {
        otpCodes
    } = useContext(OTPContext);
    const entryCodes: { [key: string]: OTPCode } = useMemo(() => otpCodes.reduce(
        (output, otpCode: OTPCode) => otpCode.entryID === entryID
            ? ({
                ...output,
                [otpCode.entryProperty]: otpCode
            })
            : output,
            {}
        ),
        [otpCodes]
    );
    return entryCodes;
}

export function useSourceOTPItems(sourceID?: VaultSourceID): Array<OTP> {
    const [codes, setCodes] = useState<Array<OTP>>([]);
    const emitter = useMemo(getEmitter, []);
    useEffect(() => {
        if (!sourceID) {
            setCodes([]);
            return;
        }
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
