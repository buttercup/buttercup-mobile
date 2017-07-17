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
    public void deriveKeyFromPassword(String password, String salt, int rounds, Callback callback) {
        try {
            String derivedKey = BCDerivation.deriveKeyFromPassword(password, salt, rounds);
            callback.invoke(null, derivedKey);
        } catch (Exception e) {
            callback.invoke(e.getMessage(), null);
        }
    }

    @Override
    public String getName() {
        return "CryptoBridge";
    }

}
