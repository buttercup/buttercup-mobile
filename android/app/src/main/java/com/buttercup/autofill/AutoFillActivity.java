package com.buttercup.autofill;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.actionsheet.ActionSheetPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.buttercup.BuildConfig;
import com.buttercup.CryptoPackage;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
// import com.oblador.keychain.KeychainPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.rnfingerprint.FingerprintAuthPackage;

import org.spongycastle.jce.provider.BouncyCastleProvider;

import java.security.Security;
import java.util.Arrays;
import java.util.List;

import li.yunqi.rnsecurestorage.RNSecureStoragePackage;

public class AutoFillActivity extends ReactActivity {
    private static final String TAG = "AutoFillActivity";
    private ReactNativeHost mReactNativeHost;

    static {
        Security.insertProviderAt(new BouncyCastleProvider(), 1);
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        SoLoader.init(this, false);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        mReactNativeHost = null;
    }

    private ReactNativeHost getAutoFillReactNativeHost() {
        if (mReactNativeHost == null) {
            mReactNativeHost = new ReactNativeHost(getApplication()) {
                @Override
                public boolean getUseDeveloperSupport() {
                    return BuildConfig.DEBUG;
                }

                @Override
                protected List<ReactPackage> getPackages() {
                    Log.d(TAG, "getPackages");
                    return Arrays.<ReactPackage>asList(
                            new MainReactPackage(),
                            // new KeychainPackage(),
                            new RNSecureStoragePackage(),
                            new FingerprintAuthPackage(),
                            new RandomBytesPackage(),
                            new ActionSheetPackage(),
                            new VectorIconsPackage(),
                            new CryptoPackage(),
                            new AutoFillPackage()
                    );
                }
            };
        }

        return mReactNativeHost;
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Buttercup";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        // We need to override the Bridge Delegate so we can inject PROPs into the react app
        Log.d(TAG, "createReactActivityDelegate");
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected Bundle getLaunchOptions() {
                Log.d(TAG, "getLaunchOptions");
                Intent intent = getIntent();
                String[] serviceIdentifiers = intent.getStringArrayExtra("serviceIdentifiers");

                Bundle bundle = new Bundle();
                bundle.putBoolean("isContextAutoFill", true);
                bundle.putStringArray("serviceIdentifiers", serviceIdentifiers);
                return bundle;
            }

            @Override
            protected ReactNativeHost getReactNativeHost() {
                Log.d(TAG, "getReactNativeHost");
                return getAutoFillReactNativeHost();
            }
        };
    }
}
