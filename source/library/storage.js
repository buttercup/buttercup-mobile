import AsyncStorageInterface from "../compat/AsyncStorageInterface";
import SecureStorageInterface from "../compat/SecureStorageInterface";

const MIGRATION_COMPLETED_KEY = "bcup_migration_complete";

export function migrateStorageToKeychain() {
    const asyncStorage = new AsyncStorageInterface();
    const secureStorage = new SecureStorageInterface();

    return asyncStorage.getAllKeys().then(keys => {
        if (keys.indexOf(MIGRATION_COMPLETED_KEY) > -1) {
            // We've already migrated.. nothing else to do here
            return true;
        } else {
            // We need to migrate, move all Buttercup archive items over to Secure Storage
            let getValuePromises = [];
            const migrateKeys = keys.filter(key => key.indexOf("bcup_archive") > -1);

            migrateKeys.forEach(key => getValuePromises.push(asyncStorage.getValue(key)));

            // Load the key values and move them to Secure Storage
            return Promise.all(getValuePromises)
                .then(getValueResults => {
                    let setValuePromises = [];
                    getValueResults.forEach((value, index) =>
                        setValuePromises.push(secureStorage.setValue(migrateKeys[index], value))
                    );
                    return Promise.all(setValuePromises);
                })
                .then(setValueResults => {
                    // Check all migrations were successful
                    if (
                        setValueResults.filter(success => success).length === setValueResults.length
                    ) {
                        let removeKeyPromises = [];
                        migrateKeys.forEach(key =>
                            removeKeyPromises.push(asyncStorage.removeKey(key))
                        );
                        return Promise.all(removeKeyPromises);
                    } else {
                        throw Error("Failed to migrate from Async to Keychain");
                    }
                })
                .then(() => {
                    // Keys were removed from AsyncStorage. Flag that migration is complete and return..
                    asyncStorage.setValue(MIGRATION_COMPLETED_KEY, "true");
                    return true;
                });
        }
    });
}
