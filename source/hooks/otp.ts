import { useContext, useEffect, useMemo, useState } from "react";
import { EntryID, VaultSourceID } from "buttercup";
import { OTPContext } from "../contexts/otp";
import { getEmitter as getAllEmitter, getOTPs as getAllOTPs, getPendingOTPs, removePendingOTP } from "../services/otpAll";
import { getEmitter, getOTPs } from "../services/otpVault";
import { OTP, OTPCode } from "../types";

export function useAllOTPItems(): Array<OTP> {
    const [codes, setCodes] = useState<Array<OTP>>([]);
    const emitter = useMemo(getAllEmitter, []);
    useEffect(() => {
        const cb = () => {
            setCodes(getAllOTPs());
        };
        emitter.on("stored", cb);
        cb();
        return () => {
            emitter.off("stored", cb);
        };
    }, [emitter]);
    return codes;
}

export function useEntryOTPCodes(entryID: EntryID): { [key: string]: OTPCode } {
    const {
        currentSourceOTPCodes
    } = useContext(OTPContext);
    const entryCodes: { [key: string]: OTPCode } = useMemo(() => currentSourceOTPCodes.reduce(
        (output, otpCode: OTPCode) => otpCode.entryID === entryID
            ? ({
                ...output,
                [otpCode.entryProperty]: otpCode
            })
            : output,
            {}
        ),
        [currentSourceOTPCodes]
    );
    return entryCodes;
}

export function usePendingOTPs(): {
    pendingOTPs: Array<OTP>;
    removePendingOTP: (uri: string) => Promise<void>;
} {
    const [pendingOTPs, setPendingOTPs] = useState<Array<OTP>>([]);
    const emitter = useMemo(getAllEmitter, []);
    useEffect(() => {
        const cb = () => {
            setPendingOTPs(getPendingOTPs());
        };
        emitter.on("pending", cb);
        cb();
        return () => {
            emitter.off("pending", cb);
        };
    }, [emitter]);
    return {
        pendingOTPs,
        removePendingOTP
    };
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
            const sourceCodes = getOTPs().filter(code => code.sourceID === sourceID);
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
