import TouchID from "react-native-touch-id";
import SecureStorage, { ACCESSIBLE, AUTHENTICATION_TYPE } from "react-native-secure-storage";
import { handleError } from "../global/exceptions.js";
import { executeNotification } from "../global/notify.js";
import { getSelectedSourceID } from "../selectors/archiveContents.js";
import { getArchivesDisplayList } from "../selectors/archives.js";
import { dispatch, getState } from "../store.js";
import { getSharedArchiveManager } from "../library/buttercup.js";
import { setSourcesUsingTouchID } from "../actions/archives.js";

const secureStorageConfig = {
    accessible: ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    authenticationPrompt: "",
    service: "pw.buttercup.mobile",
    authenticateType: AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
    accessGroup: "group.pw.buttercup.mobile" // So that the Keychain is available in the AutoFill Extension
};

export function getTouchUnlockCredentials() {
    return new Promise((resolve, reject) => {
        SecureStorage.getItem("-", secureStorageConfig).then(keychainCreds => {
            const credsObj =
                typeof keychainCreds === "string" && keychainCreds.length > 0
                    ? JSON.parse(keychainCreds)
                    : {};
            resolve(credsObj);
        });
    });
}

export function setTouchUnlockCredentials(credentials) {
    SecureStorage.setItem("-", JSON.stringify(credentials), secureStorageConfig);
}

export function disableTouchUnlock(sourceID) {
    return getTouchUnlockCredentials()
        .then(keychainCreds => {
            const newCreds = removeSourceFromKeychainCredentials(keychainCreds, sourceID);
            return setTouchUnlockCredentials(newCreds);
        })
        .then(() => {
            executeNotification("success", "Touch Unlock", "Successfully disabled touch unlock");
        })
        .then(() => updateTouchEnabledSources())
        .catch(error => {
            handleError("Failed disabling touch unlock", error);
        });
}

export function enableTouchUnlock(sourceID) {
    return TouchID.authenticate("Authenticate to enable touch unlock")
        .then(() => getTouchUnlockCredentials())
        .then(keychainCreds => {
            const archiveManager = getSharedArchiveManager();
            const state = getState();
            const sourceID = getSelectedSourceID(state);
            const source = archiveManager.getSourceForID(sourceID);
            if (!source) {
                throw new Error("Current source was not found");
            }
            const masterPassword = source.workspace.masterCredentials.password;
            if (!masterPassword) {
                throw new Error("Unable to locate current credentials");
            }
            const newCreds = updateKeychainCredentials(keychainCreds, sourceID, masterPassword);
            return setTouchUnlockCredentials(newCreds);
        })
        .then(() => {
            executeNotification("success", "Touch Unlock", "Successfully enabled touch unlock");
            return updateTouchEnabledSources().then(() => ({ action: "none" }));
        })
        .catch(err => {
            switch (err.name) {
                case "LAErrorSystemCancel":
                /* falls-through */
                case "LAErrorUserCancel":
                    return { action: "cancel" };
                case "LAErrorUserFallback":
                    return { action: "fallback" };
                default:
                    handleError("Failed enabling touch unlock", err);
                    break;
            }
        });
}

export function getKeychainCredentialsFromTouchUnlock() {
    return TouchID.authenticate("Authenticate to open archive")
        .then(() => getTouchUnlockCredentials())
        .catch(err => {
            switch (err.name) {
                case "LAErrorSystemCancel":
                /* falls-through */
                case "LAErrorUserCancel":
                    return { action: "cancel" };
                case "LAErrorUserFallback":
                    return { action: "fallback" };
                default:
                    throw err;
            }
        });
}

export function getMasterPasswordFromTouchUnlock(sourceID) {
    return touchIDEnabledForSource(sourceID)
        .then(enabled => {
            if (!enabled) {
                throw new Error("Touch unlock is not enabled for this source");
            }
            return getKeychainCredentialsFromTouchUnlock();
        })
        .then(keychainCreds => {
            const sourcePassword = keychainCreds[sourceID];
            if (!sourcePassword) {
                throw new Error("No credentials found under touch ID for this source");
            }
            return sourcePassword;
        });
}

function removeSourceFromKeychainCredentials(keychainCreds, sourceID) {
    delete keychainCreds[sourceID];
    return keychainCreds;
}

export function touchIDAvailable() {
    return TouchID.isSupported()
        .then(supportCode => {
            return supportCode === "FaceID" || supportCode === "TouchID" || supportCode === true;
        })
        .catch(err => {
            return false;
        });
}

export function touchIDEnabledForSource(sourceID) {
    return new Promise((resolve, reject) => {
        getTouchUnlockCredentials().then(keychainCreds => {
            resolve(keychainCreds.hasOwnProperty(sourceID));
        });
    });
}

function updateKeychainCredentials(keychainCreds, sourceID, password) {
    keychainCreds[sourceID] = password;
    return keychainCreds;
}

export function updateTouchEnabledSources() {
    const state = getState();
    const archivesList = getArchivesDisplayList(state);
    return Promise.all(
        archivesList.map(item =>
            touchIDEnabledForSource(item.id).then(enabled => [item.id, enabled])
        )
    ).then(results => {
        const enabledIDs = results.reduce((current, next) => {
            const [id, enabled] = next;
            if (enabled) {
                return [...current, id];
            }
            return current;
        }, []);
        dispatch(setSourcesUsingTouchID(enabledIDs));
    });
}
