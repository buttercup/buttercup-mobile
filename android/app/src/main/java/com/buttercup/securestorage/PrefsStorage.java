package com.buttercup.securestorage;

import android.content.Context;
import android.content.SharedPreferences;
import androidx.annotation.NonNull;
import android.util.Base64;

import com.facebook.react.bridge.ReactApplicationContext;

import java.util.ArrayList;
import java.util.Map;

import com.buttercup.securestorage.cipherstorage.CipherStorage.EncryptionResult;
import com.buttercup.securestorage.cipherstorage.CipherStorageFacebookConceal;

/**
 * Taken from https://github.com/oyyq99999/react-native-secure-storage
 */

public class PrefsStorage {

    public static final String SECURE_STORAGE_DATA = "RN_SECURE_STORAGE";

    public static class ResultSet {
        public final String cipherStorageName;
        public final byte[] valueBytes;

        public ResultSet(String cipherStorageName, byte[] valueBytes) {
            this.cipherStorageName = cipherStorageName;
            this.valueBytes = valueBytes;
        }
    }

    private final SharedPreferences prefs;

    public PrefsStorage(ReactApplicationContext reactContext, String service) {
        this.prefs = reactContext.getSharedPreferences(getSharedPreferenceName(service), Context.MODE_PRIVATE);
    }

    public void storeEncryptedEntry(@NonNull EncryptionResult encryptionResult) {
        String key = encryptionResult.key;
        String cipherStorageName = encryptionResult.cipherStorage.getCipherStorageName();

        prefs.edit()
                .putString(key, cipherStorageName + ":" + Base64.encodeToString(encryptionResult.value, Base64.DEFAULT))
                .apply();
    }

    public ResultSet getEncryptedEntry(@NonNull String key) {
        String value = prefs.getString(key, null);
        if (value == null) {
            return null;
        }

        String[] split = value.split(":", 2);
        if (split.length < 2) {
            return null;
        }
        String cipherStorageName = split[0];
        byte[] valueBytes = getBytesForValue(split[1]);

        if (cipherStorageName == null || cipherStorageName.isEmpty()) {
            // If the CipherStorage name is not found, we assume it is because the entry was written by an older version of this library. The older version used Facebook Conceal, so we default to that.
            cipherStorageName = CipherStorageFacebookConceal.CIPHER_STORAGE_NAME;
        }
        return new ResultSet(cipherStorageName, valueBytes);
    }

    public String[] getAllKeys() {
        Map<String, ?> allEntries = prefs.getAll();
        ArrayList<String> keyList = new ArrayList<>();
        keyList.addAll(allEntries.keySet());
        String[] keys = new String[keyList.size()];
        keyList.toArray(keys);
        return keys;
    }

    public void removeEntry(@NonNull String key) {
        prefs.edit().remove(key).apply();
    }

    private String getSharedPreferenceName(String service) {
        return SECURE_STORAGE_DATA + "_" + service;
    }

    private byte[] getBytesForValue(String b64) {
        return Base64.decode(b64, Base64.DEFAULT);
    }
}
