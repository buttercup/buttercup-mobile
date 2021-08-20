import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageInterface } from "buttercup";

export class AsyncStorageInterface extends StorageInterface {
    _storage: typeof AsyncStorage;

    constructor() {
        super();
        this._storage = AsyncStorage;
    }

    get storage() {
        return this._storage;
    }

    getAllKeys(): Promise<Array<string>> {
        return new Promise((resolve, reject) => {
            this.storage.getAllKeys((err, keys) => {
                if (err) {
                    return reject(err);
                }
                return resolve(keys);
            });
        });
    }

    getValue(name: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.storage.getItem(name, (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    }

    removeKey(key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.storage.removeItem(key, err => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    }

    setValue(name: string, value: string): Promise<void> {
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
