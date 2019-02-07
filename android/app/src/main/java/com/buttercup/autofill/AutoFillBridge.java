package com.buttercup.autofill;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableMap;

import java.util.HashMap;
import java.util.Map;

public class AutoFillBridge extends ReactContextBaseJavaModule {
    private static final String TAG = "AutoFillBridge";
    private static final String key = "pw.buttercup.mobile.autofillstore";
    private static final String service = "pw.buttercup.mobile.autofillstore";

    private AutoFillHelpers autoFillHelper;

    public AutoFillBridge(ReactApplicationContext reactContext) {
        super(reactContext);
        autoFillHelper = new AutoFillHelpers(reactContext);
    }

    @Override
    public String getName() {
        return "AutoFillBridge";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("DEVICE_SUPPORTS_AUTOFILL", true); // @TODO: Check for API Availability
        return constants;
    }

    /**
     * Merge Buttercup Credential Entries from a single Archive to the intermediate entry store (RNSecureStorage,
     *
     * The AutoFill Service will use the intermediate store to reverse map a matching domain back to a
     *   to a Buttercup Credential (and password) to complete the AutoFill process
     */
    @ReactMethod
    public void updateEntriesForSourceID(String sourceID, ReadableMap entries, Promise promise) {
        autoFillHelper.getAutoFillEntries(new AutoFillGetEntriesCallback() {
            @Override
            public void onSuccess(WritableMap autoFillEntries) {
                // We need to create a WritableMap to use putMap()
                WritableMap _entries = Arguments.createMap();
                _entries.merge(entries);

                autoFillEntries.putMap(sourceID, _entries);

                autoFillHelper.setAutoFillEntries(autoFillEntries, new AutoFillSetEntriesCallback() {
                    @Override
                    public void onSuccess() {
                        promise.resolve(true);
                    }

                    @Override
                    public void onError(String message) {
                        promise.reject(message);
                    }
                });
            }

            @Override
            public void onError(String message) {
                promise.reject(message);
            }
        });
    }

    /**
     * Remove all Entries for a Source from the credential store and update the ASCredentialIdentityStore to reflect the changes
     */
    @ReactMethod
    public void removeEntriesForSourceID(String sourceID, Promise promise) {
        autoFillHelper.getAutoFillEntries(new AutoFillGetEntriesCallback() {
            @Override
            public void onSuccess(WritableMap autoFillEntries) {
                // WritableMap has no remove method, so we need to create a new WritableMap so we can exclude the removed item
                WritableMap entries = Arguments.createMap();
                if (autoFillEntries.hasKey(sourceID)) {
                    // Unfortunately we can't just remove an item from a WritableMap,
                    // instead we need to completely recreate it without the item we want to exclude
                    ReadableMapKeySetIterator iterator = autoFillEntries.keySetIterator();
                    while(iterator.hasNextKey()) {
                        String key = iterator.nextKey();
                        if (!key.equals(sourceID) && autoFillEntries.getType(key) == ReadableType.Map) {
                            WritableMap map = Arguments.createMap();
                            map.merge(autoFillEntries.getMap(key));
                            // We need to create a WritableMap to use putMap()
                            entries.putMap(key, map);
                        }
                    }
                } else {
                    // Nothing to do, just pass the original entries back
                    entries = autoFillEntries;
                }

                autoFillHelper.setAutoFillEntries(entries, new AutoFillSetEntriesCallback() {
                    @Override
                    public void onSuccess() {
                        promise.resolve(true);
                    }

                    @Override
                    public void onError(String message) {
                        promise.reject(message);
                    }
                });
            }

            @Override
            public void onError(String message) {
                promise.reject(message);
            }
        });
    }
}
