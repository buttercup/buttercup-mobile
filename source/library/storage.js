import Storage from "react-native-storage";
import { AsyncStorage } from "react-native";

let __permaStorage;

export function getValue(key, defaultValue) {
    return __permaStorage
        .load({
            key,
            autoSync: false
        })
        .catch(err => {
            if (err && err.name === "NotFoundError") {
                return defaultValue;
            }
            throw err;
        });
}

export function initialisePermanentStorage() {
    __permaStorage = new Storage({
        size: 10000,
        storageBackend: AsyncStorage,
        defaultExpires: null,
        enableCache: true
    });
}

export function setValue(key, value, ttl = null) {
    if (/_/.test(key)) {
        throw new Error(`Failed saving value: Underscore's not allowed in key: "${key}"`);
    }
    return __permaStorage.save({
        key,
        data: value,
        expires: ttl
    });
}
