import { AsyncStorage } from "react-native";
import Buttercup from "buttercup-web";

const { StorageInterface } = Buttercup.storage;

/**
 * Interface for localStorage
 * @augments StorageInterface
 */
export default class AsyncStorageInterface extends StorageInterface {

    constructor() {
        super();
        this._storage = AsyncStorage;
    }

    get storage() {
        return this._storage;
    }

    /**
     * Get all keys from storage
     * @returns {Promise.<Array.<String>>} A promise that resolves with an array of keys
     */
    getAllKeys() {
        return new Promise((resolve, reject) => {
            this.storage.getAllKeys((err, keys) => {
                if (err) {
                    return reject(err);
                }
                return resolve(keys);
            });
        });
    }

    /**
     * Get the value of a key
     * @param {String} name The key name
     * @returns {Promise.<String>} A promise that resolves with the value
     */
    getValue(name) {
        return new Promise((resolve, reject) => {
            this.storage.getItem(name, (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    }

    /**
     * Set the value for a key
     * @param {String} name The key name
     * @param {String} value The value to set
     * @returns {Promise} A promise that resolves when the value is set
     */
    setValue(name, value) {
        return new Promise((resolve, reject) => {
            this.storage.setItem(name, value, err => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    }

}
