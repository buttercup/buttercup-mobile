package com.buttercup;

import com.facebook.react.ReactActivity;
import org.spongycastle.jce.provider.BouncyCastleProvider;
import java.security.Security;

import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import android.os.Bundle;
import android.content.pm.PackageManager;
import android.os.Build;
import android.widget.Toast;

public class MainActivity extends ReactActivity {

    public static final int PERMISSION_REQ_CODE = 1234;

    String[] perms = {
            "android.permission.READ_EXTERNAL_STORAGE",
            "android.permission.WRITE_EXTERNAL_STORAGE"
    };

    static {
        Security.insertProviderAt(new BouncyCastleProvider(), 1);
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
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }

    @Override
    public void onCreate (Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Checking permissions on init
        checkPerms();
    }

    public void closeApplication() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
            this.finishAffinity();
        } else{
            this.finish();
            System.exit(0);
        }
    }

    public void checkPerms() {
        System.out.println("Checking perms");
        // Checking if device version > 22 and we need to use new permission model
        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.LOLLIPOP_MR1) {
            for (String perm : perms){
                // Checking each permission and if denied then requesting permissions
                if (checkSelfPermission(perm) == PackageManager.PERMISSION_DENIED){
                    requestPermissions(perms, PERMISSION_REQ_CODE);
                    break;
                }
            }
        }
    }

    // Permission results
    @Override
    public void onRequestPermissionsResult(int permsRequestCode, String[] permissions, int[] grantResults){
        System.out.println("Checking result");
        for (int grantResult: grantResults) {
            System.out.println("Result: " + (grantResult == PackageManager.PERMISSION_GRANTED ? "Granted" : "Denied"));
            if (grantResult == PackageManager.PERMISSION_DENIED) {
                Toast.makeText(MainActivity.this, "Required permissions not granted", Toast.LENGTH_SHORT);
                return;
            }
        }
        switch(permsRequestCode){
            case PERMISSION_REQ_CODE:
                // example how to get result of permissions requests (there can be more then one permission dialog)
                // boolean readAccepted = grantResults[0]==PackageManager.PERMISSION_GRANTED;
                // boolean writeAccepted = grantResults[1]==PackageManager.PERMISSION_GRANTED;
                // checking permissions to prevent situation when user denied some permission
                checkPerms();
                break;

        }
    }

}
