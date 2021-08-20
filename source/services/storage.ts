import { AsyncStorageInterface } from "../library/interface/AsyncStorageInterface";

let __asyncStorage: AsyncStorageInterface = null;

export function getAsyncStorage(): AsyncStorageInterface {
    if (!__asyncStorage) {
        __asyncStorage = new AsyncStorageInterface();
    }
    return __asyncStorage;
}
