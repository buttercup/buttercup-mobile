package com.buttercup.securestorage;

import android.os.Build;
import androidx.annotation.NonNull;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;

import java.util.HashMap;
import java.util.Map;

import com.buttercup.securestorage.PrefsStorage.ResultSet;
import com.buttercup.securestorage.cipherstorage.CipherStorage;
import com.buttercup.securestorage.cipherstorage.CipherStorage.DecryptionResult;
import com.buttercup.securestorage.cipherstorage.CipherStorage.EncryptionResult;
import com.buttercup.securestorage.cipherstorage.CipherStorageFacebookConceal;
import com.buttercup.securestorage.cipherstorage.CipherStorageKeystoreAESCBC;
import com.buttercup.securestorage.exceptions.CryptoFailedException;
import com.buttercup.securestorage.exceptions.EmptyParameterException;

/**
 * Taken from https://github.com/oyyq99999/react-native-secure-storage
 */

public class RNSecureStorageModule extends ReactContextBaseJavaModule {

    public static final String E_EMPTY_PARAMETERS = "E_EMPTY_PARAMETERS";
    public static final String E_CRYPTO_FAILED = "E_CRYPTO_FAILED";
    public static final String E_KEYSTORE_ACCESS_ERROR = "E_KEYSTORE_ACCESS_ERROR";
    public static final String E_SUPPORTED_BIOMETRY_ERROR = "E_SUPPORTED_BIOMETRY_ERROR";
    public static final String SECURE_STORAGE_MODULE = "RNSecureStorage";
    public static final String FINGERPRINT_SUPPORTED_NAME = "Fingerprint";
    public static final String DEFAULT_SERVICE = "shared_preferences";

    private final Map<String, CipherStorage> cipherStorageMap = new HashMap<>();

    public RNSecureStorageModule(ReactApplicationContext reactContext) {
        super(reactContext);

        addCipherStorageToMap(new CipherStorageFacebookConceal(reactContext));
        addCipherStorageToMap(new CipherStorageKeystoreAESCBC());
    }

    @ReactMethod
    public void setItem(String key, String value, String service, Promise promise) {
        try {
            if (key == null || key.isEmpty() || value == null) {
                throw new EmptyParameterException("you passed empty or null key/value");
            }
            service = getDefaultServiceIfNull(service);
            final PrefsStorage prefsStorage = new PrefsStorage(getReactApplicationContext(), service);

            CipherStorage currentCipherStorage = getCipherStorageForCurrentAPILevel();

            EncryptionResult result = currentCipherStorage.encrypt(service, key, value);
            prefsStorage.storeEncryptedEntry(result);

            promise.resolve(true);
        } catch (EmptyParameterException e) {
            Log.e(SECURE_STORAGE_MODULE, e.getMessage());
            promise.reject(E_EMPTY_PARAMETERS, e);
        } catch (CryptoFailedException e) {
            Log.e(SECURE_STORAGE_MODULE, e.getMessage());
            promise.reject(E_CRYPTO_FAILED, e);
        }
    }

    @ReactMethod
    public void getItem(String key, String service, Promise promise) {
        try {
            service = getDefaultServiceIfNull(service);
            final PrefsStorage prefsStorage = new PrefsStorage(getReactApplicationContext(), service);

            CipherStorage currentCipherStorage = getCipherStorageForCurrentAPILevel();

            final DecryptionResult decryptionResult;
            ResultSet resultSet = prefsStorage.getEncryptedEntry(key);
            if (resultSet == null) {
                Log.e(SECURE_STORAGE_MODULE, "No entry found for service: " + service);
                promise.resolve(null);
                return;
            }

            if (resultSet.cipherStorageName.equals(currentCipherStorage.getCipherStorageName())) {
                // The encrypted data is encrypted using the current CipherStorage, so we just decrypt and return
                decryptionResult = currentCipherStorage.decrypt(service, key, resultSet.valueBytes);
            }
            else {
                // The encrypted data is encrypted using an older CipherStorage, so we need to decrypt the data first, then encrypt it using the current CipherStorage, then store it again and return
                CipherStorage oldCipherStorage = getCipherStorageByName(resultSet.cipherStorageName);
                // decrypt using the older cipher storage
                decryptionResult = oldCipherStorage.decrypt(service, key, resultSet.valueBytes);
                // encrypt using the current cipher storage
                EncryptionResult encryptionResult = currentCipherStorage.encrypt(service, key, decryptionResult.value);
                // store the encryption result
                prefsStorage.storeEncryptedEntry(encryptionResult);
            }

            promise.resolve(decryptionResult.value);
        } catch (CryptoFailedException e) {
            Log.e(SECURE_STORAGE_MODULE, e.getMessage());
            promise.reject(E_CRYPTO_FAILED, e);
        }
    }

    @ReactMethod
    public void removeItem(String key, String service, Promise promise) {
        try {
            service = getDefaultServiceIfNull(service);
            final PrefsStorage prefsStorage = new PrefsStorage(getReactApplicationContext(), service);
            prefsStorage.removeEntry(key);

            promise.resolve(true);
        } catch (Exception e) {
            Log.e(SECURE_STORAGE_MODULE, e.getMessage());
            promise.reject(E_KEYSTORE_ACCESS_ERROR, e);
        }
    }

    @ReactMethod
    public void getAllKeys(String service, Promise promise) {
        try {
            service = getDefaultServiceIfNull(service);
            final PrefsStorage prefsStorage = new PrefsStorage(getReactApplicationContext(), service);
            String[] allKeys = prefsStorage.getAllKeys();
            WritableArray keyArray = new WritableNativeArray();
            for (String key : allKeys) {
                keyArray.pushString(key);
            }
            promise.resolve(keyArray);
            return;
        } catch (Exception e) {
            Log.e(SECURE_STORAGE_MODULE, e.getMessage());
            promise.reject(E_KEYSTORE_ACCESS_ERROR, e);
        }
    }

    @ReactMethod
    public void getSupportedBiometryType(Promise promise) {
        try {
            boolean fingerprintAuthAvailable = isFingerprintAuthAvailable();
            if (fingerprintAuthAvailable) {
                promise.resolve(FINGERPRINT_SUPPORTED_NAME);
            } else {
                promise.resolve(null);
            }
        } catch (Exception e) {
            Log.e(SECURE_STORAGE_MODULE, e.getMessage());
            promise.reject(E_SUPPORTED_BIOMETRY_ERROR, e);
        }
    }

    @Override
    public String getName() {
        return SECURE_STORAGE_MODULE;
    }

    // The "Current" CipherStorage is the cipherStorage with the highest API level that is lower than or equal to the current API level
    private CipherStorage getCipherStorageForCurrentAPILevel() throws CryptoFailedException {
        int currentAPILevel = Build.VERSION.SDK_INT;
        CipherStorage currentCipherStorage = null;
        for (CipherStorage cipherStorage : cipherStorageMap.values()) {
            int cipherStorageAPILevel = cipherStorage.getMinSupportedApiLevel();
            // Is the cipherStorage supported on the current API level?
            boolean isSupported = (cipherStorageAPILevel <= currentAPILevel);
            // Is the API level better than the one we previously selected (if any)?
            if (isSupported && (currentCipherStorage == null || cipherStorageAPILevel > currentCipherStorage.getMinSupportedApiLevel())) {
                currentCipherStorage = cipherStorage;
            }
        }
        if (currentCipherStorage == null) {
            throw new CryptoFailedException("Unsupported Android SDK " + Build.VERSION.SDK_INT);
        }
        return currentCipherStorage;
    }

    private boolean isFingerprintAuthAvailable() {
        return DeviceAvailability.isFingerprintAuthAvailable(getCurrentActivity());
    }

    private void addCipherStorageToMap(CipherStorage cipherStorage) {
        cipherStorageMap.put(cipherStorage.getCipherStorageName(), cipherStorage);
    }

    private CipherStorage getCipherStorageByName(String cipherStorageName) {
        return cipherStorageMap.get(cipherStorageName);
    }

    @NonNull
    private String getDefaultServiceIfNull(String service) {
        return service == null ? DEFAULT_SERVICE : service;
    }
}
