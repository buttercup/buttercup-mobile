package com.buttercup;

import android.app.Application;

import com.buttercup.autofill.AutoFillPackage;
import com.facebook.react.ReactApplication;
import org.reactnative.camera.RNCameraPackage;
import org.umhan35.RNSearchBarPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.actionsheet.ActionSheetPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
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

import java.util.Arrays;
import java.util.List;

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
            new RNCameraPackage(),
            new RNSearchBarPackage(),
            new RNScreensPackage(),
            new ReanimatedPackage(),
            new RNGestureHandlerPackage(),
                new ActionSheetPackage(),
                new RNGoogleSigninPackage(),
                new KeychainPackage(),
                new RNSecureStoragePackage(),
                new FingerprintAuthPackage(),
                new RandomBytesPackage(),
                new VectorIconsPackage(),
                new CryptoPackage(),
                new AutoFillPackage()
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
