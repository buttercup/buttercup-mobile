package pw.buttercup.mobile;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.net.URLDecoder;
import java.lang.String;
import java.util.Map;
import java.util.HashMap;

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
    public void decryptText(String encryptedText, String keyHex, String ivHex, String saltHex, String hmacHexKey, String hmacHex, Promise promise) {
        String decryptedText = BCCrypto.decryptText(encryptedText, keyHex, ivHex, saltHex, hmacHexKey, hmacHex);
        promise.resolve(decryptedText);
    }

    @ReactMethod
    public void deriveKeyFromPassword(String password, String salt, int rounds, int bits, Promise promise) {
        try {
            String derivedKey = BCDerivation.deriveKeyFromPassword(password, salt, rounds, bits);
            promise.resolve(derivedKey);
        } catch (Exception e) {
            promise.reject("Failed deriving key: " + e.getMessage(), e);
        }
    }

    @ReactMethod
    public void encryptText(String encodedText, String keyHex, String saltHex, String hmacHexKey, Promise promise) {
        String text;
        try {
            // We decode the text from Base64 and URI-encoding due to limitations with the bridge
            // sending weird text that resulted from GZIP'ing:
            text = URLDecoder.decode(BCHelpers.base64ToString(encodedText), "UTF-8");
        } catch (Exception ex) {
            promise.reject("Failed encrypting data: " + ex.getMessage(), ex);
            return;
        }
        String encryptedText = BCCrypto.encryptText(text, keyHex, saltHex, hmacHexKey);
        promise.resolve(encryptedText);
    }

    @ReactMethod
    public void generateIV(Promise promise) {
        String iv;
        try {
            iv = BCCrypto.generateIV();
        } catch (Exception ex) {
            promise.reject("Failed generating IV: " + ex.getMessage(), ex);
            return;
        }
        promise.resolve(iv);
    }

    @ReactMethod
    public void generateSaltWithLength(int length, Promise promise) {
        String salt = BCCrypto.generateSalt(length);
        promise.resolve(salt);
    }

    @Override
    public String getName() {
        return "CryptoBridge";
    }

}
