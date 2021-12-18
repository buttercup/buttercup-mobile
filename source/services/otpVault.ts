import { VaultSourceID } from "buttercup";
import EventEmitter from "eventemitter3";
import { OTP } from "../types";

const __emitter = new EventEmitter();
let __otpCodes: Array<OTP> = [];

export function getOTPs(): Array<OTP> {
    return __otpCodes;
}

export function getEmitter(): EventEmitter {
    return __emitter;
}

export function removeCodesForSource(
    sourceID: VaultSourceID
) {
    __otpCodes = __otpCodes.filter(item => item.sourceID !== sourceID);
    __emitter.emit("updated");
}

export function setCodesForSource(
    sourceID: VaultSourceID,
    codes: Array<OTP>
) {
    __otpCodes = __otpCodes.filter(item => item.sourceID !== sourceID);
    __otpCodes.push(...codes);
    __emitter.emit("updated");
}
