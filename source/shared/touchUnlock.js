import TouchID from "react-native-touch-id";
import { getValue } from "../library/storage.js";
import { handleError } from "../global/exceptions.js";
import { executeNotification } from "../global/notify.js";

const TOUCH_ID_ENABLED_PREFIX = "bcup:touchid-unlock-enabled:source:";

export function enableTouchUnlock(sourceID) {
    TouchID.authenticate("Authenticate to enable touch unlock")
        .then(success => {
            executeNotification("success", "Touch Unlock", "Successfully enabled touch unlock");
        })
        .catch(error => {
            handleError("Failed enabling touch unlock", error);
        });
}

export function touchIDEnabledForSource(sourceID) {
    const storageKey = `${TOUCH_ID_ENABLED_PREFIX}${sourceID}`;
    return getValue(storageKey, false);
}
