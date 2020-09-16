import AsyncStorage from "@react-native-community/async-storage";
import { StorageInterface } from "../library/buttercupCore.js";

export default class MobileStorageInterface extends StorageInterface {
    /**
     * Get all keys from storage
     * @returns {Promise.<Array.<String>>} A promise that resolves with an array of keys
     */
    getAllKeys() {
        return AsyncStorage.getAllKeys();
    }

    /**
     * Get the value of a key
     * @param {String} name The key name
     * @returns {Promise.<String>} A promise that resolves with the value
     */
    getValue(name) {
        return AsyncStorage.getItem(name);
    }

    /**
     * Remove a key from the storage
     * @param {String} key The key to remove
     * @returns {Promise} A promise that resolves once the item has been removed
     */
    removeKey(key) {
        return AsyncStorage.removeItem(name);
    }

    /**
     * Set the value for a key
     * @param {String} name The key name
     * @param {String} value The value to set
     * @returns {Promise} A promise that resolves when the value is set
     */
    setValue(name, value) {
        return AsyncStorage.setItem(name, value);
    }
}
