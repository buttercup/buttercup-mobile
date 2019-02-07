package com.buttercup.autofill;

import com.facebook.react.bridge.WritableMap;

public interface AutoFillGetEntriesCallback {
    void onSuccess(WritableMap autoFillEntries);
    void onError(String message);
}
