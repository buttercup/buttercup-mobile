import EncryptedStorage from "react-native-encrypted-storage";
import { notifyError } from "../notifications";

type StorableValue = string | number | boolean | null | Record<string, unknown> | Array<unknown>;

export class SecureStorageInterface {
    async clearStorage(): Promise<void> {
        try {
            await EncryptedStorage.clear();
        } catch (err) {
            notifyError("Failed clearing storage", err.message);
        }
    }

    async getItem(key: string): Promise<unknown> {
        try {
            const value = await EncryptedStorage.getItem(key);
            return typeof value === "undefined" ? undefined : JSON.parse(value);
        } catch (err) {
            notifyError("Failed reading storage", err.message);
            return undefined;
        }
    }

    async removeItem(key: string): Promise<void> {
        try {
            await EncryptedStorage.removeItem(key);
        } catch (err) {
            notifyError("Failed removing storage item", err.message);
        }
    }

    async setItem(key: string, value: StorableValue): Promise<void> {
        try {
            await EncryptedStorage.setItem(
                key,
                JSON.stringify(value)
            );
        } catch (err) {
            notifyError("Failed writing storage", err.message);
        }
    }
}
