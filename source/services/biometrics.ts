import EventEmitter from "eventemitter3";
import TouchID from "react-native-touch-id";
import { VaultSourceID } from "buttercup";
import { getSecureStorage } from "./storage";
import { BIOMETRICS_ERROR_NOT_ENROLLED } from "../symbols";

interface KeychainCredentials {
    [sourceID: string]: string;
}

const TOUCH_UNLOCK_CRED_KEY = "@@touchunlock";

let __ee: EventEmitter = null;

export async function authenticateBiometrics(): Promise<boolean> {
    try {
        await TouchID.authenticate("To unlock the selected vault", {
            passcodeFallback: false,
            unifiedErrors: true
        });
        return true;
    } catch (err) {
        if (err.code === BIOMETRICS_ERROR_NOT_ENROLLED) {
            return false;
        }
        throw err;
    }
}

export async function biometricsAvailable(): Promise<boolean> {
    try {
        const supportCode = await TouchID.isSupported();
        return supportCode === "FaceID" || supportCode === "TouchID" || supportCode === true;
    } catch (err) {
        return false;
    }
}

export async function biometicsEnabledForSource(sourceID: VaultSourceID): Promise<boolean> {
    const keychainCreds = await getBiometricCredentials();
    return keychainCreds.hasOwnProperty(sourceID);
}

export async function disableBiometicsForSource(sourceID: VaultSourceID): Promise<void> {
    const creds = await getBiometricCredentials();
    delete creds[sourceID];
    await setBiometricCredentials(creds);
    getBiometricEvents().emit(`biometrics-changed:${sourceID}`, { state: "disabled" });
}

export async function enableBiometricsForSource(
    sourceID: VaultSourceID,
    password: string
): Promise<void> {
    await setSourcePassword(sourceID, password);
    getBiometricEvents().emit(`biometrics-changed:${sourceID}`, { state: "enabled" });
}

async function getBiometricCredentials(): Promise<KeychainCredentials> {
    const keychainCreds = (await getSecureStorage().getItem(
        TOUCH_UNLOCK_CRED_KEY
    )) as KeychainCredentials;
    return typeof keychainCreds === "object" && keychainCreds !== null ? keychainCreds : {};
}

export async function getBiometricCredentialsForSource(sourceID: VaultSourceID): Promise<string> {
    const creds = await getBiometricCredentials();
    return creds[sourceID] || null;
}

export function getBiometricEvents(): EventEmitter {
    if (!__ee) {
        __ee = new EventEmitter();
    }
    return __ee;
}

async function setBiometricCredentials(credentials: KeychainCredentials) {
    await getSecureStorage().setItem(TOUCH_UNLOCK_CRED_KEY, credentials);
}

async function setSourcePassword(sourceID: VaultSourceID, password: string): Promise<void> {
    const creds = await getBiometricCredentials();
    await setBiometricCredentials({
        ...creds,
        [sourceID]: password
    });
}
