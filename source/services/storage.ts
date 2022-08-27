import { AsyncStorageInterface } from "../library/interface/AsyncStorageInterface";
import { SecureStorageInterface } from "../library/interface/SecureStorageInterface";

let __asyncStorage: AsyncStorageInterface = null,
    __secureStorage: SecureStorageInterface = null;

export function getAsyncStorage(): AsyncStorageInterface {
    if (!__asyncStorage) {
        __asyncStorage = new AsyncStorageInterface();
    }
    return __asyncStorage;
}

export function getSecureStorage(): SecureStorageInterface {
    if (!__secureStorage) {
        __secureStorage = new SecureStorageInterface();
    }
    return __secureStorage;
}
