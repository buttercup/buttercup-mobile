package com.buttercup;

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public class CryptoBridge extends ReactContextBaseJavaModule {
    public CryptoBridge(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void encryptText(
        String encodedText,
        String keyHex,
        String salt,
        String ivHex,
        String hmacKeyHex,
        Promise promise
    ) {
        String encryptedText = Crypto.encryptText(
            encodedText,
            keyHex,
            salt,
            ivHex,
            hmacKeyHex
        );
        if (encryptedText == null) {
            promise.reject("ERR_ENCRYPTION_FAILED", "Encryption failed");
            return;
        }
        promise.resolve(encryptedText);
    }

    @ReactMethod
    public void decryptText(
        String encryptedText,
        String keyHex,
        String ivHex,
        String salt,
        String hmacKeyHex,
        String hmacHex,
        Promise promise
    ) {
        String decryptedText = Crypto.decryptText(
            encryptedText,
            keyHex,
            ivHex,
            salt,
            hmacKeyHex,
            hmacHex
        );
        if (decryptedText == null) {
            promise.reject("ERR_DECRYPTION_FAILED", "Decryption failed: Possible tampering");
            return;
        }
        promise.resolve(decryptedText);
    }

    @ReactMethod
    public void generateIV(Promise promise) {
        String ivHex = Crypto.generateIV();
        if (ivHex.length() > 0) {
            promise.resolve(ivHex);
            return;
        }
        promise.reject("ERR_IV_GEN_FAILED", "Generating an IV failed");
    }

    @ReactMethod
    public void generateSaltWithLength(int length, Promise promise) {
        String salt = Crypto.generateSaltWithLength(length);
        if (salt.length() > 0) {
            promise.resolve(salt);
            return;
        }
        promise.reject("ERR_SALT_GEN_FAILED", "Generating a salt failed");
    }

    @ReactMethod
    public void generateUUIDs(int count, Promise promise) {
        String uuids = Crypto.generateUUIDs(count);
        if (uuids.length() > 0) {
            promise.resolve(uuids);
            return;
        }
        promise.reject("ERR_UUID_GEN_FAILED", "Generating UUIDs failed");
    }

    @Override
    public String getName() {
        return "Crypto";
    }

    @ReactMethod
    public void pbkdf2(String password, String salt, int rounds, int bits, Promise promise) {
        String outcome = Crypto.pbkdf2(password, salt, rounds, bits);
        if (outcome != null) {
            promise.resolve(outcome);
            return;
        }
        promise.reject("ERR_DERIVATION_FAILED", "Key derivation failed");
    }
}
