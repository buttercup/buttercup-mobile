import { AsyncStorageInterface } from "../library/interface/AsyncStorageInterface";
import { SharedStorageInterface } from "../library/interface/SharedStorageInterface";
import { GROUP } from "../symbols";

let __asyncStorage: AsyncStorageInterface = null,
    __sharedStorage: SharedStorageInterface = null;

export function getAsyncStorage(): AsyncStorageInterface {
    if (!__asyncStorage) {
        __asyncStorage = new AsyncStorageInterface();
    }
    return __asyncStorage;
}

export function getSharedStorage(): SharedStorageInterface {
    if (!__sharedStorage) {
        __sharedStorage = new SharedStorageInterface(GROUP);
    }
    return __sharedStorage;
}
