import { getValue } from "../library/storage.js";

const TOUCH_ID_ENABLED_PREFIX = "bcup:touchid-unlock-enabled:source:";

export function touchIDEnabledForSource(sourceID) {
    const storageKey = `${TOUCH_ID_ENABLED_PREFIX}${sourceID}`;
    return getValue(storageKey, false);
}
