package com.buttercup.securestorage.cipherstorage;

import android.os.Build;
import androidx.annotation.NonNull;

import com.facebook.android.crypto.keychain.AndroidConceal;
import com.facebook.android.crypto.keychain.SharedPrefsBackedKeyChain;
import com.facebook.crypto.Crypto;
import com.facebook.crypto.CryptoConfig;
import com.facebook.crypto.Entity;
import com.facebook.crypto.keychain.KeyChain;
import com.facebook.react.bridge.ReactApplicationContext;

import com.buttercup.securestorage.exceptions.CryptoFailedException;

/**
 * Taken from https://github.com/oyyq99999/react-native-secure-storage
 */

public class CipherStorageFacebookConceal implements CipherStorage {

    public static final String CIPHER_STORAGE_NAME = "FacebookConceal";
    public static final String SECURE_STORAGE = "RN_SECURE_STORAGE";

    private final Crypto crypto;

    public CipherStorageFacebookConceal(ReactApplicationContext reactContext) {
        KeyChain keyChain = new SharedPrefsBackedKeyChain(reactContext, CryptoConfig.KEY_256);
        this.crypto = AndroidConceal.get().createDefaultCrypto(keyChain);
    }

    @Override
    public EncryptionResult encrypt(@NonNull String service, @NonNull String key, @NonNull String value) throws CryptoFailedException {
        if (!crypto.isAvailable()) {
            throw new CryptoFailedException("Crypto is missing");
        }
        Entity valueEntity = createEntity(service, key);

        try {
            byte[] encryptedValue = crypto.encrypt(value.getBytes(charsetName), valueEntity);

            return new EncryptionResult(key, encryptedValue, this);
        } catch (Exception e) {
            throw new CryptoFailedException("Encryption failed for service " + service, e);
        }
    }

    @Override
    public DecryptionResult decrypt(@NonNull String service, @NonNull String key, @NonNull byte[] value) throws CryptoFailedException {
        if (!crypto.isAvailable()) {
            throw new CryptoFailedException("Crypto is missing");
        }
        Entity valueEntity = createEntity(service, key);

        try {
            byte[] decryptedValue = crypto.decrypt(value, valueEntity);

            return new DecryptionResult(key, new String(decryptedValue, charsetName));
        } catch (Exception e) {
            throw new CryptoFailedException("Decryption failed for service " + service, e);
        }
    }

    @Override
    public String getCipherStorageName() {
        return CIPHER_STORAGE_NAME;
    }

    @Override
    public int getMinSupportedApiLevel() {
        return Build.VERSION_CODES.JELLY_BEAN;
    }

    private Entity createEntity(String service, String key) {
        String prefix = getEntityPrefix(service);
        return Entity.create(prefix + ":" + key);
    }

    private String getEntityPrefix(String service) {
        return SECURE_STORAGE + "_" + service;
    }
}
