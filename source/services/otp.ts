import { VaultSourceID } from "buttercup";
import EventEmitter from "eventemitter3";
import { HOTP, URI as OTPURI } from "otpauth";
import { notifyError} from "../library/notifications";
import { OTP } from "../types";

export interface PendingOTP {
    title: string;
    uri: string;
}

const __emitter = new EventEmitter();
let __pendingOTPs: Array<PendingOTP> = [],
    __otpCodes: Array<OTP> = [];

export function getCodes(): Array<OTP> {
    return __otpCodes;
}

export function getEmitter(): EventEmitter {
    return __emitter;
}

export function getPendingOTPs(): Array<PendingOTP> {
    return __pendingOTPs;
}

export function removeCodesForSource(
    sourceID: VaultSourceID
) {
    __otpCodes = __otpCodes.filter(item => item.sourceID !== sourceID);
    __emitter.emit("updated");
}

export function removePendingOTP(uri: string) {
    __pendingOTPs = __pendingOTPs.filter(item => item.uri !== uri);
    __emitter.emit("pending");
}

export function setCodesForSource(
    sourceID: VaultSourceID,
    codes: Array<OTP>
) {
    __otpCodes = __otpCodes.filter(item => item.sourceID !== sourceID);
    __otpCodes.push(...codes);
    __emitter.emit("updated");
}

export function storePendingOTPURI(uri: string): boolean {
    try {
        const otp = OTPURI.parse(uri);
        if (otp instanceof HOTP) {
            throw new Error("HOTP is not supported - only TOTP items can be added");
        }
        __pendingOTPs.push({
            title: otp.label,
            uri
        });
        __emitter.emit("pending");
    } catch (err) {
        notifyError("OTP Failure", err.message);
        return false;
    }
    return true;
}
