import * as OTPAuth from "otpauth";

export function getOTPTitleFromURL(url) {
    const otpInst = otpInstanceFromURL(url);
    return `${otpInst.issuer} (${otpInst.label})`;
}

export function otpInstanceFromURL(url) {
    return OTPAuth.URI.parse(url);
}

export function isOTP(url) {
    if (typeof url !== "string" || !url.startsWith("otpauth")) {
        return false;
    }
    try {
        const instance = otpInstanceFromURL(url);
        if (instance) {
            return true;
        }
    } catch (err) {
        // noop
    }
    return false;
}
