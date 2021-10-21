import React, { useEffect, useMemo, useState } from "react";
import { HOTP, URI as OTPURI } from "otpauth";
import { ChildElements } from "../types";
import { OTP, OTPCode } from "../types";

interface IOTPContext {
    otpCodes: Array<OTPCode>;
}

interface OTPProviderProps {
    children: ChildElements;
    otpItems: Array<OTP>;
}

export const OTPContext = React.createContext<IOTPContext>({} as IOTPContext);

export function OTPProvider(props: OTPProviderProps) {
    const [otpCodes, setOTPCodes] = useState<Array<OTPCode>>([]);
    useEffect(() => {
        setOTPCodes(props.otpItems.map(item => updateCode(item)));
    }, [props.otpItems]);
    useEffect(() => {
        const interval = setInterval(() => {
            setOTPCodes(props.otpItems.map(item => updateCode(item)));
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [props.otpItems]);
    const context: IOTPContext = useMemo(() => ({
        otpCodes
    }), [
        otpCodes
    ]);
    return (
        <OTPContext.Provider value={context}>{props.children}</OTPContext.Provider>
    );
}

function updateCode(item: OTP): OTPCode {
    const otp = OTPURI.parse(item.otpURL);
    const id = `${item.sourceID}:${item.entryID}:${item.entryProperty}`;
    if (otp instanceof HOTP) {
        return {
            ...item,
            id,
            currentCode: "ERROR",
            otpTitle: otp.label,
            period: 30,
            timeLeft: 0,
            valid: false
        };
    }
    return {
        ...item,
        id,
        currentCode: otp.generate(),
        otpTitle: otp.label,
        period: otp.period,
        timeLeft: otp.period - (Math.floor(Date.now() / 1000) % otp.period),
        valid: true
    };
}
