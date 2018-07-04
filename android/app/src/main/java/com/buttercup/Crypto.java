package com.buttercup;

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.net.URLDecoder;
import java.lang.String;

public class Crypto extends ReactContextBaseJavaModule {

    private static native String hello(String input);

    static {
        System.loadLibrary("crypto");
    }

    public Crypto(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void sayHello(String name, Promise promise) {
        String output = Crypto.hello("sallar");
        // String output = "Hello" + name;
        promise.resolve(output);
    }

    @Override
    public String getName() {
        return "Crypto";
    }

}
