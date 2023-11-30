import React, { useEffect, useMemo, useState } from "react";
import { HOTP, TOTP, URI as OTPURI } from "otpauth";
import queryString from "query-string";
import { ChildElements } from "../types";
import { OTP, OTPCode } from "../types";

interface IOTPContext {
    allOTPCodes: Array<OTPCode>;
    currentSourceOTPCodes: Array<OTPCode>;
}

interface OTPProviderProps {
    allOTPItems: Array<OTP>;
    children: ChildElements;
    currentSourceOTPItems: Array<OTP>;
}

export const OTPContext = React.createContext<IOTPContext>({} as IOTPContext);

export function OTPProvider(props: OTPProviderProps) {
    const [allOTPCodes, setAllOTPCodes] = useState<Array<OTPCode>>([]);
    const [currentSourceOTPCodes, setCurrentSourceOTPCodes] = useState<Array<OTPCode>>([]);
    useEffect(() => {
        const updateCodes = () => {
            setAllOTPCodes(props.allOTPItems.map(item => updateCode(item)));
            setCurrentSourceOTPCodes(props.currentSourceOTPItems.map(item => updateCode(item)));
        };
        updateCodes();
        const interval = setInterval(updateCodes, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [props.allOTPItems, props.currentSourceOTPItems]);
    const context: IOTPContext = useMemo(
        () => ({
            allOTPCodes,
            currentSourceOTPCodes
        }),
        [currentSourceOTPCodes]
    );
    return <OTPContext.Provider value={context}>{props.children}</OTPContext.Provider>;
}

function updateCode(item: OTP): OTPCode {
    let otp: TOTP | HOTP,
        search: string,
        errorMsg: string = "Error";
    try {
        otp = OTPURI.parse(item.otpURL);
        const searchInd = item.otpURL.indexOf("?");
        search = searchInd >= 0 ? item.otpURL.substring(searchInd) : "";
    } catch (err) {
        errorMsg = `Error: ${err.message}`;
    }
    const id = `${item.sourceID}:${item.entryID}:${item.entryProperty}`;
    if (!otp || otp instanceof HOTP) {
        return {
            ...item,
            id,
            currentCode: "ERROR",
            otpIssuer: otp?.issuer ?? "",
            otpTitle: otp?.label ?? errorMsg,
            period: 30,
            timeLeft: 0,
            valid: false
        };
    }
    const { image = null } = queryString.parse(search) as {
        image: string;
    };
    return {
        ...item,
        id,
        currentCode: otp.generate(),
        image,
        otpIssuer: otp.issuer || "",
        otpTitle: otp.label,
        period: otp.period,
        timeLeft: otp.period - (Math.floor(Date.now() / 1000) % otp.period),
        valid: true
    };
}
