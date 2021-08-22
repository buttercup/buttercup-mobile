import TouchID from "react-native-touch-id";
import SecureStorage, { ACCESSIBLE, AUTHENTICATION_TYPE } from "react-native-secure-storage";
import { VaultSourceID } from "buttercup";
// import { notifyError, notifySuccess } from "../library/notifications";

interface KeychainCredentials {
    [sourceID: string]: string;
}

const SECURE_STORAGE_CONFIG = {
    accessible: ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    authenticationPrompt: "",
    service: "pw.buttercup.mobile",
    authenticateType: AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
    accessGroup: "group.pw.buttercup.mobile" // So that the Keychain is available in the AutoFill Extension
};
const TOUCH_UNLOCK_CRED_KEY = "@@touchunlock";

export async function biometricsAvailable(): Promise<Boolean> {
    try {
        const supportCode = await TouchID.isSupported();
        return supportCode === "FaceID" || supportCode === "TouchID" || supportCode === true;
    } catch (err) {
        return false;
    }
}

export async function biometicsEnabledForSource(sourceID: VaultSourceID): Promise<Boolean> {
    const keychainCreds = await getBiometricCredentials();
    return keychainCreds.hasOwnProperty(sourceID);
}

export async function disableBiometicsForSource(sourceID: VaultSourceID): Promise<void> {
    const creds = await getBiometricCredentials();
    delete creds[sourceID];
    await setBiometricCredentials(creds);
    // @todo notify
}

export async function enableBiometricsForSource(sourceID: VaultSourceID, password: string): Promise<void> {
    await setSourcePassword(sourceID, password);
    // @todo notify
}

async function getBiometricCredentials(): Promise<KeychainCredentials> {
    const keychainCreds = await SecureStorage.getItem(TOUCH_UNLOCK_CRED_KEY, SECURE_STORAGE_CONFIG);
    return typeof keychainCreds === "string" && keychainCreds.length > 0
        ? JSON.parse(keychainCreds)
        : {};
}

async function setBiometricCredentials(credentials: KeychainCredentials) {
    SecureStorage.setItem(TOUCH_UNLOCK_CRED_KEY, JSON.stringify(credentials), SECURE_STORAGE_CONFIG);
}

async function setSourcePassword(sourceID: VaultSourceID, password: string): Promise<void> {
    const creds = await getBiometricCredentials();
    await setBiometricCredentials({
        ...creds,
        [sourceID]: password
    });
}
