package com.buttercup;

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public class CryptoBridge extends ReactContextBaseJavaModule {

    public CryptoBridge(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void decryptText(String encryptedText, String keyHex, String ivHex, String saltHex, String hmacHexKey, String hmacHex, Callback callback) {
        String decryptedText = BCCrypto.decryptText(encryptedText, keyHex, ivHex, saltHex, hmacHexKey, hmacHex);
        callback.invoke(null, decryptedText);
    }

    @ReactMethod
    public void deriveKeyFromPassword(String password, String salt, int rounds, Callback callback) {
        try {
            String derivedKey = BCDerivation.deriveKeyFromPassword(password, salt, rounds);
            callback.invoke(null, derivedKey);
        } catch (Exception e) {
            callback.invoke(e.getMessage(), null);
        }
    }

    @ReactMethod
    public void encryptText(String text, String keyHex, String saltHex, String hmacHexKey, Callback callback) {
        String encryptedText = BCCrypto.encryptText(text, keyHex, saltHex, hmacHexKey);
        callback.invoke(null, encryptedText);
    }

    @ReactMethod
    public void generateSaltWithLength(int length, Callback callback) {
        String salt = BCCrypto.generateSalt(length);
        callback.invoke(null, salt);
    }

    @ReactMethod
    public void generateUUIDs(Callback callback) {
        String[] uuids = BCCrypto.generateUUIDs(50);
        callback.invoke(null, String.join(",", uuids));
    }

    @Override
    public String getName() {
        return "CryptoBridge";
    }

}
