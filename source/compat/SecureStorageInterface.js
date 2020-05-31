import SecureStorage, { ACCESSIBLE, AUTHENTICATION_TYPE } from "react-native-secure-storage";
import { StorageInterface } from "../library/buttercupCore.js";

const config = {
    accessible: ACCESSIBLE.WHEN_UNLOCKED,
    authenticationPrompt: "",
    service: "pw.buttercup.mobile.storage",
    authenticateType: AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
    accessGroup: "group.pw.buttercup.mobile" // So that the Keychain is available in the AutoFill Extension
};

/**
 * Interface for localStorage
 * @augments StorageInterface
 */
export default class SecureStorageInterface extends StorageInterface {
    constructor() {
        super();
        this._storage = SecureStorage;
    }

    get storage() {
        return this._storage;
    }

    /**
     * Get all keys from storage
     * @returns {Promise.<Array.<String>>} A promise that resolves with an array of keys
     */
    getAllKeys() {
        return this.storage.getAllKeys(config);
    }

    /**
     * Get the value of a key
     * @param {String} name The key name
     * @returns {Promise.<String>} A promise that resolves with the value
     */
    getValue(name) {
        return this.storage.getItem(name, config);
    }

    /**
     * Remove a key from the storage
     * @param {String} key The key to remove
     * @returns {Promise} A promise that resolves once the item has been removed
     */
    removeKey(key) {
        return this.storage.removeItem(key, config);
    }

    /**
     * Set the value for a key
     * @param {String} name The key name
     * @param {String} value The value to set
     * @returns {Promise} A promise that resolves when the value is set
     */
    setValue(name, value) {
        return this.storage.setItem(name, value, config);
    }
}
