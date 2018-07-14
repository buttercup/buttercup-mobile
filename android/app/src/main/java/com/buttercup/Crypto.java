package com.buttercup;

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.net.URLDecoder;
import java.lang.String;

public class Crypto extends ReactContextBaseJavaModule {
    private static native String generateUUIDList(int count);
    private static native String deriveKeyFromPassword(String password, String salt, int rounds, int bits);
    private static native String generateSalt(int length);
    private static native String generateRandomBytes(int length);
    private static native String encryptCBC(
        String encodedText,
        String keyHex,
        String salt,
        String ivHex,
        String hmacKeyHex
    );
    private static native String decryptCBC(
        String encryptedText,
        String keyHex,
        String ivHex,
        String salt,
        String hmacKeyHex,
        String hmacHex
    );

    static {
        System.loadLibrary("crypto");
    }

    public Crypto(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void pbkdf2(String password, String salt, int rounds, int bits, Promise promise) {
        String derivationHex = Crypto.deriveKeyFromPassword(password, salt, rounds, bits);
        if (derivationHex.length() > 0) {
            promise.resolve(derivationHex);
            return;
        }
        promise.reject("Key Derivation failed.");
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
        String encryptedText = Crypto.encryptCBC(
            encodedText,
            keyHex,
            salt,
            ivHex,
            hmacKeyHex
        );
        if (encryptedText == null) {
            promise.reject("Encryption failed.");
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
        String decryptedText = Crypto.decryptCBC(
            encryptedText,
            keyHex,
            ivHex,
            salt,
            hmacKeyHex,
            hmacHex
        );
        if (decryptedText == null) {
            promise.reject("Decryption failed. The archive is possibly tampered with.");
            return;
        }
        promise.resolve(decryptedText);
    }

    @ReactMethod
    public void generateUUIDs(int count, Promise promise) {
        String uuids = Crypto.generateUUIDList(10);
        if (uuids.length() > 0) {
            promise.resolve(uuids);
            return;
        }
        promise.reject("Generating UUIDs failed.");
    }

    @ReactMethod
    public void generateSaltWithLength(int length, Promise promise) {
        String salt = Crypto.generateSalt(length);
        if (salt.length() > 0) {
            promise.resolve(salt);
            return;
        }
        promise.reject("Generating Salt failed.");
    }

    @ReactMethod
    public void generateIV(int length, Promise promise) {
        String ivHex = Crypto.generateRandomBytes(length);
        if (ivHex.length() > 0) {
            promise.resolve(ivHex);
            return;
        }
        promise.reject("Generating IV failed.");
    }

    @Override
    public String getName() {
        return "Crypto";
    }
}
