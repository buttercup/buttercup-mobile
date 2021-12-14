import EventEmitter from "eventemitter3";
import { ChannelQueue } from "@buttercup/channel-queue";
import { HOTP, URI as OTPURI } from "otpauth";
import { getAsyncStorage } from "./storage";
import { notifyError } from "../library/notifications";
import { OTP } from "../types";
import { VaultSourceID } from "buttercup";

const STORAGE_PREFIX_UNATTACHED = "otp:all:unattached";
const STORAGE_PREFIX_VAULTS = "otp:all:vaults";

const __queue = new ChannelQueue();
const __emitter = new EventEmitter();
let __otps: Array<OTP> = [];

export async function addPendingOTP(uri: string): Promise<boolean> {
    const existing = __otps.find(otp => otp.otpURL === uri && !otp.sourceID);
    if (existing) {
        return false;
    }
    try {
        const otp = OTPURI.parse(uri);
        if (otp instanceof HOTP) {
            throw new Error("HOTP is not supported - only TOTP items can be added");
        }
        __otps.push({
            otpTitle: otp.label,
            otpURL: uri,
            sourceID: null,
            entryTitle: null,
            entryID: null,
            entryProperty: null
        });
        __emitter.emit("pending");
        await storeOTPs();
    } catch (err) {
        notifyError("OTP Failure", err.message);
        return false;
    }
    return true;
}

export function getEmitter(): EventEmitter {
    return __emitter;
}

export function getOTPs(): Array<OTP> {
    return [...__otps];
}

export function getPendingOTPs(): Array<OTP> {
    return __otps.filter(otp => !otp.sourceID);
}

export async function initialise() {
    const storage = getAsyncStorage();
    await __queue.channel("store").enqueue(async () => {
        const [unattachedRaw, vaultsRaw] = await Promise.all([
            storage.getValue(STORAGE_PREFIX_UNATTACHED),
            storage.getValue(STORAGE_PREFIX_VAULTS)
        ]);
        const unattachedOTPs: Array<OTP> = unattachedRaw ? JSON.parse(unattachedRaw) : [];
        const vaultOTPs: Array<OTP> = vaultsRaw ? JSON.parse(vaultsRaw) : [];
        __otps = [
            ...unattachedOTPs,
            ...vaultOTPs
        ];
        console.log("OTPS1", __otps);
        sortOTPs();
    });
    __emitter.emit("stored");
}

export async function removePendingOTP(uri: string): Promise<void> {
    const ind = __otps.findIndex(otp => !otp.sourceID && otp.otpURL === uri);
    if (ind >= 0) {
        __otps.splice(ind, 1);
    }
    await storeOTPs();
}

export async function removeSourceOTPs(sourceID: VaultSourceID, store: boolean = true): Promise<void> {
    __otps = __otps.filter(otp => otp.sourceID !== sourceID);
    if (store) {
        await storeOTPs();
    }
}

export async function setSourceOTPs(sourceID: VaultSourceID, otps: Array<OTP>): Promise<void> {
    await removeSourceOTPs(sourceID, false);
    __otps.push(...otps);
    await storeOTPs();
}

function sortOTPs() {
    __otps = __otps.sort((a, b) => {
        if (a.otpTitle < b.otpTitle) return -1;
        if (a.otpTitle > b.otpTitle) return 1;
        return 0;
    });
}

export async function storeOTPs(): Promise<void> {
    const storage = getAsyncStorage();
    await __queue.channel("store").enqueue(async () => {
        const vaultOTPs: Array<OTP> = [];
        const unattachedOTPs: Array<OTP> = [];
        for (const otp of __otps) {
            if (!otp.sourceID) {
                unattachedOTPs.push(otp);
            } else {
                vaultOTPs.push(otp);
            }
        }
        await storage.setValue(STORAGE_PREFIX_UNATTACHED, JSON.stringify(unattachedOTPs));
        await storage.setValue(STORAGE_PREFIX_VAULTS, JSON.stringify(vaultOTPs));
        sortOTPs();
    });
    __emitter.emit("stored");
}
