import { VaultSourceID } from "buttercup";
import EventEmitter from "eventemitter3";
import { AsyncStorageInterface } from "../library/interface/AsyncStorageInterface";
import { getAsyncStorage } from "./storage";
import { notifyError } from "../library/notifications";

const STORAGE_PREFIX_SOURCE_STATISTICS = "statistics:source:";

let __storage: AsyncStorageInterface = null,
    __emitter: EventEmitter = null;

export function getEmitter(): EventEmitter {
    if (!__emitter) {
        __emitter = new EventEmitter();
    }
    return __emitter;
}

export async function getSourceItemsCount(
    sourceID: VaultSourceID
): Promise<{ entries: number; groups: number }> {
    const storage = getStorage();
    const key = `${STORAGE_PREFIX_SOURCE_STATISTICS}${sourceID}`;
    const res = await storage.getValue(key);
    return res
        ? JSON.parse(res)
        : {
              entries: 0,
              groups: 0
          };
}

function getStorage(): AsyncStorageInterface {
    if (!__storage) {
        __storage = getAsyncStorage();
    }
    return __storage;
}

export function updateSourceItemsCount(sourceID: VaultSourceID, entries: number, groups: number) {
    const storage = getStorage();
    const key = `${STORAGE_PREFIX_SOURCE_STATISTICS}${sourceID}`;
    storage
        .setValue(key, JSON.stringify({ entries, groups }))
        .then(() => {
            getEmitter().emit(`updated:${sourceID}`);
        })
        .catch(err => {
            console.error(err);
            notifyError("Statistics update failed", err.message);
        });
}
