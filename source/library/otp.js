import * as OTPAuth from "otpauth";

export function getOTPTitleFromURL(url) {
    const otpInst = otpInstanceFromURL(url);
    return `${otpInst.issuer} (${otpInst.label})`;
}

export function otpInstanceFromURL(url) {
    return OTPAuth.URI.parse(url);
}
