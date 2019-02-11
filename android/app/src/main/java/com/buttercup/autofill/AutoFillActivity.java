package com.buttercup.autofill;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;

import org.spongycastle.jce.provider.BouncyCastleProvider;
import java.security.Security;

public class AutoFillActivity extends ReactActivity {
    private static final String TAG = "AutoFillActivity";

    static {
        Security.insertProviderAt(new BouncyCastleProvider(), 1);
    }


    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "ButtercupAutoFill";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        // We need to override the Bridge Delegate so we can inject PROPs into the react app
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected Bundle getLaunchOptions() {
                Intent intent = getIntent();
                String[] serviceIdentifiers = intent.getStringArrayExtra("serviceIdentifiers");

                Bundle bundle = new Bundle();
                bundle.putBoolean("isContextAutoFill", true);
                bundle.putStringArray("serviceIdentifiers", serviceIdentifiers);
                return bundle;
            }
        };

    }
}
