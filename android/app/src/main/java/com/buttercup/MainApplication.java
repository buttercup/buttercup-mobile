package com.buttercup;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.oblador.keychain.KeychainPackage;
import li.yunqi.rnsecurestorage.RNSecureStoragePackage;
import com.rnfingerprint.FingerprintAuthPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.actionsheet.ActionSheetPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.NativeModule;

import java.util.Arrays;
import java.util.List;
import java.util.Collections;
import java.util.ArrayList;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                new KeychainPackage(),
                new RNSecureStoragePackage(),
                new FingerprintAuthPackage(),
                new RandomBytesPackage(),
                new ActionSheetPackage(),
                new VectorIconsPackage(),
                new CryptoPackage()
            );
        }
    };

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }
}
