package com.buttercup;

import android.util.Log;

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.net.URLDecoder;
import java.lang.String;

public class CryptoBridge extends ReactContextBaseJavaModule {

    private String join(String[] items) {
        String output = "";
        for (String item : items) {
            if (output.length() > 0) {
                output += ",";
            }
            output += item;
        }
        return output;
    }

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
    public void encryptText(String encodedText, String keyHex, String saltHex, String hmacHexKey, Callback callback) {
        String text;
        try {
            text = URLDecoder.decode(BCHelpers.base64ToString(encodedText), "UTF-8");
        } catch (Exception ex) {
            callback.invoke(null, "Error:" + ex.getMessage());
            return;
        }
        Log.i("BcupAndroid", "Text: " + text);
        Log.i("BcupAndroid", "TextLen: " + text.length());
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
        callback.invoke(null, join(uuids));
    }

    @Override
    public String getName() {
        return "CryptoBridge";
    }

}
