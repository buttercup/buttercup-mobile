import SharedGroupPreferences from "react-native-shared-group-preferences";

enum SharedGroupPreferencesError {
    NoUserDefaults = 0,
    NoValueForKey = 1
}

export class SharedStorageInterface {
    private _group: string;

    constructor(group: string) {
        this._group = group;
    }

    async getItem(key: string): Promise<any> {
        try {
            return await SharedGroupPreferences.getItem(key, this._group, {
                useAndroidSharedPreferences: true
            });
        } catch (err) {
            if (err === SharedGroupPreferencesError.NoUserDefaults || err === SharedGroupPreferencesError.NoValueForKey) {
                return undefined;
            }
            throw err;
        }
    }

    async setItem(key: string, value: any): Promise<void> {
        await SharedGroupPreferences.setItem(key, value, this._group, {
            useAndroidSharedPreferences: true
        });
    }
}
