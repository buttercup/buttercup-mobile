package com.buttercup.autofill;

import android.app.Activity;
import android.app.assist.AssistStructure;
import android.content.Intent;
import android.os.Build;
import android.service.autofill.Dataset;
import android.service.autofill.FillResponse;
import android.support.annotation.RequiresApi;
import android.util.Log;
import android.view.autofill.AutofillManager;
import android.view.autofill.AutofillValue;
import android.widget.RemoteViews;

import com.buttercup.R;
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

import static android.view.autofill.AutofillManager.EXTRA_ASSIST_STRUCTURE;

public class AutoFillBridge extends ReactContextBaseJavaModule {
    private static final String TAG = "AutoFillBridge";
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
        // Only Android 8+ supports autofill
        constants.put("DEVICE_SUPPORTS_AUTOFILL", (Build.VERSION.SDK_INT > Build.VERSION_CODES.O));
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
        try {
            // First get the existing AutoFill entries
            WritableMap autoFillEntries = autoFillHelper.getAutoFillEntries();

            // Merge the new entries into the existing entries. Keyed by source ID
            // We need to create a new WritableMap to use putMap() on the existing autoFillEntries
            // (param entries is a ReadableMap)
            WritableMap _entries = Arguments.createMap();
            _entries.merge(entries);
            autoFillEntries.putMap(sourceID, _entries);

            autoFillHelper.setAutoFillEntries(autoFillEntries);

            autoFillHelper.updateDomainMap(autoFillEntries);
            promise.resolve(true);
        } catch (Exception ex) {
            promise.reject(ex);
        }
    }

    /**
     * Remove all Entries for a Source from the credential store and update the ASCredentialIdentityStore to reflect the changes
     */
    @ReactMethod
    public void removeEntriesForSourceID(String sourceID, Promise promise) {
        try {
            // First get the existing AutoFill entries
            WritableMap autoFillEntries = autoFillHelper.getAutoFillEntries();

            // WritableMap has no remove method, so we need to create a new WritableMap so we can exclude the removed item
            WritableMap updatedEntries = Arguments.createMap();
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
                        updatedEntries.putMap(key, map);
                    }
                }
            } else {
                // Nothing to do, just pass the original entries back
                updatedEntries = autoFillEntries;
            }

            autoFillHelper.setAutoFillEntries(updatedEntries);
            promise.resolve(true);
        } catch (Exception ex) {
            promise.reject(ex);
        }
    }

    /**
     * Complete the Manual AutoFill Process by sending a desired username and password back to the Android AutoFill Service.
     * Note: This method should ONLY be used when the module is loaded from an AutoFill Context.
     */
    @RequiresApi(api = Build.VERSION_CODES.O)
    @ReactMethod
    public void completeAutoFill(String username, String password, String entryPath, Promise promise) {
        try {
            // Get the auth intent that came from the AutoFill service and re-parse the assist structre
            Intent autoIntent = getCurrentActivity().getIntent();
            AssistStructure structure = autoIntent.getParcelableExtra(EXTRA_ASSIST_STRUCTURE);
            // Parse the structure into fillable view IDs
            StructureParser.Result parseResult = new StructureParser(structure).parse();

            // Fill out the remote views with the selected credential
            RemoteViews remoteView = new RemoteViews(getCurrentActivity().getPackageName(), R.layout.autofill_list_item);
            remoteView.setTextViewText(R.id.autofill_username, "Login with " + username);
            remoteView.setTextViewText(R.id.autofill_domain, entryPath);
            Dataset.Builder builder = new Dataset.Builder(remoteView);

            // Assign the username/password to any found view IDs
            parseResult.email.forEach(id -> builder.setValue(id, AutofillValue.forText(username)));
            parseResult.username.forEach(id -> builder.setValue(id, AutofillValue.forText(username)));
            parseResult.password.forEach(id -> builder.setValue(id, AutofillValue.forText(password)));
            FillResponse fillResponse = new FillResponse.Builder()
                    .addDataset(
                            builder.build()
                    ).build();

            // Send the data back to the service.
            Intent replyIntent = new Intent();
            replyIntent.putExtra(AutofillManager.EXTRA_AUTHENTICATION_RESULT, fillResponse);
            getCurrentActivity().setResult(Activity.RESULT_OK, replyIntent);
            getCurrentActivity().finish();

            promise.resolve(true);
        } catch (Exception ex) {
            promise.reject(ex);
        }
    }

    @ReactMethod
    public void cancelAutoFill(Promise promise) {
        try {
            getCurrentActivity().setResult(Activity.RESULT_CANCELED);
            getCurrentActivity().finish();
            promise.resolve(true);
        } catch (Exception ex) {
            promise.reject(ex);
        }
    }
}
