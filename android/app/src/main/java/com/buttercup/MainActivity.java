package com.buttercup;

import com.facebook.react.ReactActivity;
import org.spongycastle.jce.provider.BouncyCastleProvider;
import java.security.Security;

import android.provider.Settings;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.Log;
import android.view.autofill.AutofillManager;

public class MainActivity extends ReactActivity {

    public static final int PERMISSION_REQ_CODE = 1234;
    public static final int OVERLAY_PERMISSION_REQ_CODE = 1235;
    public static final int AUTOFILL_REQ_CODE = 1236;

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
    public void onCreate (Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Checking permissions on init
        checkPerms();

        checkForAutoFillPerms(); // @TODO: (testing only) Dont call on load, move to RN Module
    }

    private void checkForAutoFillPerms() {
        // @TODO: (testing only) Dont call on load, move to RN Module
        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.O) {
            AutofillManager mAutofillManager = getSystemService(AutofillManager.class);

            if (mAutofillManager != null && !mAutofillManager.hasEnabledAutofillServices()) {
                Intent intent = new Intent(Settings.ACTION_REQUEST_SET_AUTOFILL_SERVICE);
                intent.setData(Uri.parse("package:com.buttercup"));
                startActivityForResult(intent, 1);
            }
        }
    }


    public void checkPerms() {
        System.out.println("Checking perms");
        // Checking if device version > 22 and we need to use new permission model
        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.LOLLIPOP_MR1) {
            // Checking if we can draw window overlay
            if (!Settings.canDrawOverlays(this)) {
                System.out.println("Can't draw overlays");
                // Requesting permission for window overlay(needed for all react-native apps)
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:" + getPackageName()));
                startActivityForResult(intent, OVERLAY_PERMISSION_REQ_CODE);
            }
            for(String perm : perms){
                // Checking each persmission and if denied then requesting permissions
                if(checkSelfPermission(perm) == PackageManager.PERMISSION_DENIED){
                    requestPermissions(perms, PERMISSION_REQ_CODE);
                    break;
                }
            }
        }
    }

    // Window overlay permission intent result
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == OVERLAY_PERMISSION_REQ_CODE) {
            checkPerms();
        }

        if (requestCode == AUTOFILL_REQ_CODE) { // @TODO: (testing only) Move to RN Module
            Log.d("BCUP", "user enabled autofill");
        }
    }

    // Permission results
    @Override
    public void onRequestPermissionsResult(int permsRequestCode, String[] permissions, int[] grantResults){
        System.out.println("Checking result");
        for (int grantResult: grantResults) {
            System.out.println("Result: " + grantResult);
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
