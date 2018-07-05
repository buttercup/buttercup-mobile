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

    static {
        System.loadLibrary("crypto");
    }

    public Crypto(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void generateUUIDs(Promise promise) {
        String uuids = Crypto.generateUUIDList(10);
        promise.resolve(uuids);
    }

    @ReactMethod
    public void pbkdf2(String password, String salt, int rounds, int bits, Promise promise) {
        String derivationHexResult = Crypto.deriveKeyFromPassword(password, salt, rounds, bits);
        promise.resolve(derivationHexResult);
    }

    @Override
    public String getName() {
        return "Crypto";
    }

}
