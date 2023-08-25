import { EntryID, VaultSourceID } from "buttercup";
import { NativeModules } from "react-native";
import { IntermediateEntry, StoredAutofillEntries } from "../types";

export interface AutofillBridgeInterface {
    DEVICE_SUPPORTS_AUTOFILL: boolean;
    getAutoFillSystemStatus: () => Promise<boolean>;
    openAutoFillSystemSettings: () => Promise<void>;
    cancelAutoFill: () => Promise<void>;
    completeAutoFill: (username: string, password: string, entryPath: string) => Promise<void>;
    getEntriesForSourceID: (sourceID: VaultSourceID) => Promise<StoredAutofillEntries>;
    removeEntriesForSourceID: (sourceID: VaultSourceID) => Promise<void>;
    updateEntriesForSourceID: (
        sourceID: VaultSourceID,
        entries: Record<EntryID, IntermediateEntry>
    ) => Promise<void>;
}

const { AutoFillBridge } = NativeModules as { AutoFillBridge: AutofillBridgeInterface };

export { AutoFillBridge };
