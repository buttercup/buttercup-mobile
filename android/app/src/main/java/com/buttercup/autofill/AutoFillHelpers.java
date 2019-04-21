package com.buttercup.autofill;

/**
 * Helper class for saving and retrieving AutoFill entries from Secure Storage
 *
 * se1exin - 9/2/19
 */

import android.support.annotation.NonNull;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import li.yunqi.rnsecurestorage.PrefsStorage;
import li.yunqi.rnsecurestorage.cipherstorage.CipherStorage;
import li.yunqi.rnsecurestorage.cipherstorage.CipherStorageKeystoreAESCBC;

public class AutoFillHelpers {
    private static final String TAG = "AutoFillHelpers";
    private static final String autoFillKey = "pw.buttercup.mobile.autofillstore";
    private static final String domainMapKey = "pw.buttercup.mobile.domainmapstore";
    private static final String service = "pw.buttercup.mobile.autofillstore";

    private PrefsStorage prefsStorage;
    private CipherStorage cipherStorage;

    public AutoFillHelpers(ReactApplicationContext reactContext) {
        cipherStorage = new CipherStorageKeystoreAESCBC();
        prefsStorage = new PrefsStorage(reactContext, service);
    }

    /**
     * Retrieve the AutoFill Entries from encrypted storage
     * @return A WritableMap containing the AutoFill Entries. Will return an empty Map if no values exist
     * @throws Exception - There was an error decrypting or parsing the map from JSON
     */
    public WritableMap getAutoFillEntries() throws Exception {
        return getItem(autoFillKey);
    }

    /**
     * Set the AutoFill Entries in encrypted storage
     * @param autoFillEntries - The entries to store
     * @throws Exception - There was an error encrypting or parsing the map into JSON
     */
    public void setAutoFillEntries(@NonNull ReadableMap autoFillEntries) throws Exception {
        setItem(autoFillKey, autoFillEntries);
    }

    /**
     * Retrieve the DomainMap Entries from encrypted storage
     * @return A WritableMap containing the DomainMap Entries. Will return an empty Map if no values exist
     * @throws Exception - There was an error decrypting or parsing the map from JSON
     */
    public WritableMap getDomainMap() throws Exception {
        return getItem(domainMapKey);
    }

    /**
     * Retrieve the DomainMap Entries from encrypted storage
     * @return A WritableMap containing the DomainMap Entries. Will return an empty Map if no values exist
     * @throws Exception - There was an error decrypting or parsing the map from JSON
     */
    public void setDomainMap(@NonNull ReadableMap domainMap) throws Exception {
        setItem(domainMapKey, domainMap);
    }

    /**
     * Take AutoFill Entries and transform them into an index of domain name/URLs mapped to each AutoFill entry's 'recordIdentifier'
     *  The 'recordIdentifier' is simply the sourceID and entryID combined (in the format sourceID:entryID).
     *  The idea here is to both make the domain lookup process quicker than iterating the entire AutoFill structurem
     *  and to reduce the need to constantly decrypt the AutoFIll structure as well
     * @param autoFillEntries - The AutoFill Entries to map to Domain Names
     * @throws Exception - There was an error decrypting or parsing the info to/from JSON
     */
    public void updateDomainMap(ReadableMap autoFillEntries) throws Exception {
        HashMap<String, ArrayList<String>> domainMap = new HashMap<>();
        // Iterate the entries and add them to the Domain Map so they can be quickly looked up by domain name
        ReadableMapKeySetIterator autoFillEntriesIterator = autoFillEntries.keySetIterator();
        while(autoFillEntriesIterator.hasNextKey()){
            String sourceID = autoFillEntriesIterator.nextKey();
            ReadableMap childEntries = autoFillEntries.getMap(sourceID);

            // Then iterate each child entries of the source to create the final Domain Map
            ReadableMapKeySetIterator childEntriesIterator = childEntries.keySetIterator();
            while(childEntriesIterator.hasNextKey()){
                String entryID = childEntriesIterator.nextKey();
                ReadableMap entry = childEntries.getMap(entryID);

                // Set the record identifier based on the Source and Entry IDs so we can easily map back to this entry
                // Format: sourceID:entryID
                String recordIdentifier = sourceID + ":" + entryID;
                // Add a service identifier for every URL associated with the Entry
                ReadableArray urls = entry.getArray("urls");
                if (urls != null) {
                    for (int i = 0; i < urls.size(); i++) {
                        String url = urls.getString(i);
                        if (url != null && !url.isEmpty()) {
                            // If we haven't seen this URL before we need to add a new array to the domainMap
                            if (domainMap.get(url) == null) {
                                domainMap.put(url, new ArrayList<>());
                            }
                            domainMap.get(url).add(recordIdentifier);
                        }
                    }
                }
            }
        }

        // Now we have created the domainMap, we need to convert it to a React Native WritableMap so we can save it
        WritableMap finalDomainMap = Arguments.createMap();
        for (Map.Entry<String, ArrayList<String>> entry: domainMap.entrySet()) {
            WritableArray recordIdentifiers = Arguments.createArray();
            for (String recordIdentifier: entry.getValue()) {
             recordIdentifiers.pushString(recordIdentifier);
            }
            finalDomainMap.putArray(entry.getKey(), recordIdentifiers);
        }

        setDomainMap(finalDomainMap);
    }

    /**
     * For a given domain name, attempt to find matching AutoFill credentials
     * @param domain - The domain name to search for
     * @return - List of matching Username/Passwords in the form of the AutoFillEntry class.
     */
    public ArrayList<AutoFillEntry> getAutoFillEntriesForDomain(String domain) {
        ArrayList<AutoFillEntry> entries = new ArrayList<>();
        try {
            WritableMap domainMap = getDomainMap();
            ArrayList<String> matchingRecordIdentifiers = new ArrayList<>();

            // Search they domain map keys and build a list of matching recordIdentifiers
            ReadableMapKeySetIterator iterator = domainMap.keySetIterator();
            while (iterator.hasNextKey()) {
                String url = iterator.nextKey();
                if (url.toLowerCase().contains(domain.toLowerCase())) {
                    // There are credentials for this domain, add all the recordIndentifiers
                    // for the domain so they can be loaded later
                    ReadableArray recordIdentifiers = domainMap.getArray(url);
                    for (int i = 0; i < recordIdentifiers.size(); i++) {
                        matchingRecordIdentifiers.add(recordIdentifiers.getString(i));
                    }
                }
            }

            if (matchingRecordIdentifiers.size() > 0) {
                // We have matching records, now load the AutoFill entries and extract the actual usernames/passwords
                WritableMap autoFillEntries = getAutoFillEntries();
                for (String recordIdentifier: matchingRecordIdentifiers) {
                    // Try to pull the actual Entry credential out of the AutoFill store
                    String sourceID = recordIdentifier.split(":")[0];
                    String entryID = recordIdentifier.split(":")[1];

                    if (autoFillEntries.hasKey(sourceID) && autoFillEntries.getMap(sourceID).hasKey(entryID)) {
                        ReadableMap entry = autoFillEntries.getMap(sourceID).getMap(entryID);
                        String username = entry.getString("username");
                        String password = entry.getString("password");
                        String entryPath = entry.getString("entryPath");
                        entries.add(new AutoFillEntry(username, password, entryPath));
                    }
                }
            }

        } catch (Exception ex) {
            Log.e(TAG, ex.getMessage());
            return entries;
        }

        return entries;
    }

    /**
     * Get an Item from Encrypted Storage
     * @param key - Key to retrieve from
     * @return - The value that was in the store as a Writable Map. Will return an empty Map if the item could not be found.
     */
    private WritableMap getItem(String key) throws Exception {
        PrefsStorage.ResultSet resultSet = prefsStorage.getEncryptedEntry(key);
        if (resultSet == null) {
            return Arguments.createMap(); // Always return a writable map - even if empty
        }

        CipherStorage.DecryptionResult decryptionResult = cipherStorage.decrypt(service, key, resultSet.valueBytes);

        return AutoFillHelpers.jsonToReact(new JSONObject(decryptionResult.value));
    }

    /**
     * Set an Item in Encrypted Storage
     * @param key - Key to store as
     * @param value - Value to store
     */
    private void setItem(String key, ReadableMap value) throws Exception {
        prefsStorage.storeEncryptedEntry(
                cipherStorage.encrypt(service, key, AutoFillHelpers.reactToJSON(value).toString())
        );
    }

    /*
      Retrieved from https://github.com/gigya/ReactNative-Demo/blob/master/android/app/src/main/java/com/gigyareactnative/JsonConvert.java
      7/2/19 - se1exin
     */
    public static JSONObject reactToJSON(ReadableMap readableMap) throws JSONException {
        JSONObject jsonObject = new JSONObject();
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        while(iterator.hasNextKey()){
            String key = iterator.nextKey();
            ReadableType valueType = readableMap.getType(key);
            switch (valueType){
                case Null:
                    jsonObject.put(key,JSONObject.NULL);
                    break;
                case Boolean:
                    jsonObject.put(key, readableMap.getBoolean(key));
                    break;
                case Number:
                    try {
                        jsonObject.put(key, readableMap.getInt(key));
                    } catch(Exception e) {
                        jsonObject.put(key, readableMap.getDouble(key));
                    }
                    break;
                case String:
                    jsonObject.put(key, readableMap.getString(key));
                    break;
                case Map:
                    jsonObject.put(key, reactToJSON(readableMap.getMap(key)));
                    break;
                case Array:
                    jsonObject.put(key, reactToJSON(readableMap.getArray(key)));
                    break;
            }
        }

        return jsonObject;
    }

    public static JSONArray reactToJSON(ReadableArray readableArray) throws JSONException {
        JSONArray jsonArray = new JSONArray();
        for(int i=0; i < readableArray.size(); i++) {
            ReadableType valueType = readableArray.getType(i);
            switch (valueType){
                case Null:
                    jsonArray.put(JSONObject.NULL);
                    break;
                case Boolean:
                    jsonArray.put(readableArray.getBoolean(i));
                    break;
                case Number:
                    try {
                        jsonArray.put(readableArray.getInt(i));
                    } catch(Exception e) {
                        jsonArray.put(readableArray.getDouble(i));
                    }
                    break;
                case String:
                    jsonArray.put(readableArray.getString(i));
                    break;
                case Map:
                    jsonArray.put(reactToJSON(readableArray.getMap(i)));
                    break;
                case Array:
                    jsonArray.put(reactToJSON(readableArray.getArray(i)));
                    break;
            }
        }
        return jsonArray;
    }

    public static WritableMap jsonToReact(JSONObject jsonObject) throws JSONException {
        WritableMap writableMap = Arguments.createMap();
        Iterator iterator = jsonObject.keys();
        while(iterator.hasNext()) {
            String key = (String) iterator.next();
            Object value = jsonObject.get(key);
            if (value instanceof Float || value instanceof Double) {
                writableMap.putDouble(key, jsonObject.getDouble(key));
            } else if (value instanceof Number) {
                writableMap.putInt(key, jsonObject.getInt(key));
            } else if (value instanceof String) {
                writableMap.putString(key, jsonObject.getString(key));
            } else if (value instanceof JSONObject) {
                writableMap.putMap(key,jsonToReact(jsonObject.getJSONObject(key)));
            } else if (value instanceof JSONArray){
                writableMap.putArray(key, jsonToReact(jsonObject.getJSONArray(key)));
            } else if (value == JSONObject.NULL){
                writableMap.putNull(key);
            }
        }

        return writableMap;
    }

    public static WritableArray jsonToReact(JSONArray jsonArray) throws JSONException {
        WritableArray writableArray = Arguments.createArray();
        for(int i=0; i < jsonArray.length(); i++) {
            Object value = jsonArray.get(i);
            if (value instanceof Float || value instanceof Double) {
                writableArray.pushDouble(jsonArray.getDouble(i));
            } else if (value instanceof Number) {
                writableArray.pushInt(jsonArray.getInt(i));
            } else if (value instanceof String) {
                writableArray.pushString(jsonArray.getString(i));
            } else if (value instanceof JSONObject) {
                writableArray.pushMap(jsonToReact(jsonArray.getJSONObject(i)));
            } else if (value instanceof JSONArray){
                writableArray.pushArray(jsonToReact(jsonArray.getJSONArray(i)));
            } else if (value == JSONObject.NULL){
                writableArray.pushNull();
            }
        }
        return writableArray;
    }

    public static Map<String, Object> reactToMap(ReadableMap readableMap) {
        Map<String, Object> map = new HashMap<>();
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();

        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            ReadableType type = readableMap.getType(key);

            switch (type) {
                case Null:
                    map.put(key, null);
                    break;
                case Boolean:
                    map.put(key, readableMap.getBoolean(key));
                    break;
                case Number:
                    map.put(key, readableMap.getDouble(key));
                    break;
                case String:
                    map.put(key, readableMap.getString(key));
                    break;
                case Map:
                    map.put(key, reactToMap(readableMap.getMap(key)));
                    break;
                case Array:
                    map.put(key, reactToArray(readableMap.getArray(key)));
                    break;
            }
        }

        return map;
    }

    public static Object[] reactToArray(ReadableArray readableArray) {
        Object[] array = new Object[readableArray.size()];

        for (int i = 0; i < readableArray.size(); i++) {
            ReadableType type = readableArray.getType(i);

            switch (type) {
                case Null:
                    array[i] = null;
                    break;
                case Boolean:
                    array[i] = readableArray.getBoolean(i);
                    break;
                case Number:
                    array[i] = readableArray.getDouble(i);
                    break;
                case String:
                    array[i] = readableArray.getString(i);
                    break;
                case Map:
                    array[i] = reactToMap(readableArray.getMap(i));
                    break;
                case Array:
                    array[i] = reactToArray(readableArray.getArray(i));
                    break;
            }
        }

        return array;
    }
}
