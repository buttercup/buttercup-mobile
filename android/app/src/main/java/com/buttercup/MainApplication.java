package com.buttercup;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.buttercup.autofill.AutoFillPackage;
import com.facebook.react.ReactApplication;

// import org.reactnative.camera.RNCameraPackage;
// import org.umhan35.RNSearchBarPackage;
// import com.swmansion.rnscreens.RNScreensPackage;
// import com.swmansion.reanimated.ReanimatedPackage;
// import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
// import com.actionsheet.ActionSheetPackage;
// import co.apptailor.googlesignin.RNGoogleSigninPackage;
// import com.oblador.keychain.KeychainPackage;
// import li.yunqi.rnsecurestorage.RNSecureStoragePackage;
// import com.rnfingerprint.FingerprintAuthPackage;
// import com.bitgo.randombytes.RandomBytesPackage;
// import com.actionsheet.ActionSheetPackage;
// import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        // @Override
        // protected List<ReactPackage> getPackages() {
        //     return Arrays.<ReactPackage>asList(
        //         new MainReactPackage(),
        //     new RNCameraPackage(),
        //     new RNSearchBarPackage(),
        //     new RNScreensPackage(),
        //     new ReanimatedPackage(),
        //     new RNGestureHandlerPackage(),
        //         new ActionSheetPackage(),
        //         new RNGoogleSigninPackage(),
        //         new KeychainPackage(),
        //         new RNSecureStoragePackage(),
        //         new FingerprintAuthPackage(),
        //         new RandomBytesPackage(),
        //         new VectorIconsPackage(),
        //         new CryptoPackage(),
        //         new AutoFillPackage()
        //     );
        // }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          packages.add(new CryptoPackage());
          packages.add(new AutoFillPackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index.android";
        }
    };

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        initializeFlipper(this); // Remove this line if you don't want Flipper enabled
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    /**
    * Loads Flipper in React Native templates.
    *
    * @param context
    */
    private static void initializeFlipper(Context context) {
        if (BuildConfig.DEBUG) {
            try {
                /*
                We use reflection here to pick up the class that initializes Flipper,
                since Flipper library is not available in release mode
                */
                Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
                aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            } catch (NoSuchMethodException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            }
        }
    }
}
