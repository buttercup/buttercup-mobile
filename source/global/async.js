import { buildCache } from "../compat/crypto.js";

let __asyncWorkQueue = null;

/**
 * @deprecated
 */
export function doAsyncWork() {
    if (__asyncWorkQueue) {
        return __asyncWorkQueue;
    }
    // Set queue so others use it instead of starting again
    __asyncWorkQueue = buildCache();
    return __asyncWorkQueue.then(() => {
        __asyncWorkQueue = null;
    });
}
