import EventEmitter from "eventemitter3";
import TouchID from "react-native-touch-id";
import SecureStorage, { ACCESSIBLE, AUTHENTICATION_TYPE } from "react-native-secure-storage";
import { VaultSourceID } from "buttercup";
import { BIOMETRICS_ERROR_NOT_ENROLLED } from "../symbols";

interface KeychainCredentials {
    [sourceID: string]: string;
}

let __ee: EventEmitter = null;

const SECURE_STORAGE_CONFIG = {
    accessible: ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    authenticationPrompt: "",
    service: "pw.buttercup.mobile",
    authenticateType: AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
    accessGroup: "group.pw.buttercup.mobile" // So that the Keychain is available in the AutoFill Extension
};
const TOUCH_UNLOCK_CRED_KEY = "@@touchunlock";

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

export async function enableBiometricsForSource(sourceID: VaultSourceID, password: string): Promise<void> {
    await setSourcePassword(sourceID, password);
    getBiometricEvents().emit(`biometrics-changed:${sourceID}`, { state: "enabled" });
}

async function getBiometricCredentials(): Promise<KeychainCredentials> {
    const keychainCreds = await SecureStorage.getItem(TOUCH_UNLOCK_CRED_KEY, SECURE_STORAGE_CONFIG);
    return typeof keychainCreds === "string" && keychainCreds.length > 0
        ? JSON.parse(keychainCreds)
        : {};
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
    await SecureStorage.setItem(TOUCH_UNLOCK_CRED_KEY, JSON.stringify(credentials), SECURE_STORAGE_CONFIG);
}

async function setSourcePassword(sourceID: VaultSourceID, password: string): Promise<void> {
    const creds = await getBiometricCredentials();
    await setBiometricCredentials({
        ...creds,
        [sourceID]: password
    });
}
